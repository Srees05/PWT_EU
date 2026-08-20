const OllamaProvider = require('../providers/OllamaProvider');

class FailureInvestigationAgent {

    constructor() {

    this.ai = new OllamaProvider();

    this.client = null;

    // Local default = 4 investigation steps.
    // Can be overridden from Docker/Jenkins/Kubernetes.
    this.maxSteps =
        Number(process.env.AGENT_MAX_STEPS || 4);

    this.executedActions = new Set();
}


    // ==================================================
    // CONNECT TO MCP SERVER
    // ==================================================

    async connectMcp() {

        const { Client } =
            await import('@modelcontextprotocol/client');

        const { StdioClientTransport } =
            await import('@modelcontextprotocol/client/stdio');


        this.client = new Client({
            name: 'pwt-eu-failure-investigation-agent',
            version: '1.0.0'
        });


        const transport = new StdioClientTransport({
            command: 'node',
            args: ['mcp/PwtMcpServer.js']
        });


        console.log(
            'Agent connecting to PWT_EU MCP Server...'
        );


        await this.client.connect(transport);


        console.log(
            'Agent connected to MCP Server'
        );
    }


    // ==================================================
    // ASK OLLAMA FOR NEXT INVESTIGATION ACTION
    // ==================================================

    async decideNextAction(
        failureDetails,
        availableTools,
        investigationHistory
    ) {

        const prompt = `
You are an autonomous QA Failure Investigation Agent
for a Playwright automation framework.

Your responsibility is to investigate failures using
REAL evidence from the project.

AVAILABLE MCP TOOLS:

${availableTools.map(tool =>
    `- ${tool.name}: ${tool.description || ''}`
).join('\n')}


PLAYWRIGHT FAILURE:

TEST NAME:
${failureDetails.testName}

ERROR:
${failureDetails.error}

STACK:
${failureDetails.stack || 'Not available'}


EVIDENCE COLLECTED SO FAR:

${investigationHistory || 'No evidence collected yet.'}


Choose ONLY ONE next action.

Allowed actions:

1. list_project_files
2. read_project_file
3. final


IMPORTANT RULES:

- Do NOT request the same MCP operation twice.
- Review the evidence already collected before choosing.
- If a file has already been read, do NOT read it again.
- If enough evidence exists, choose "final".
- Never claim something was inspected unless it appears
  in the collected evidence.
- Never claim DevTools, browser DOM, screenshots,
  network logs, traces or videos were inspected unless
  such evidence was actually supplied.
- Separate confirmed facts from probable causes.
- Do not invent project files.
- Do not automatically recommend XPath.
- Do not automatically recommend increasing timeout.


Preferred JSON format:


To list files:

{
  "action": "list_project_files",
  "arguments": {
    "directory": "tests"
  },
  "reason": "I need to discover the failing test file."
}


To read a file:

{
  "action": "read_project_file",
  "arguments": {
    "filePath": "tests/AI_Failure_Demo.spec.js"
  },
  "reason": "I need to inspect the failing test implementation."
}


When sufficient evidence exists:

{
  "action": "final",
  "analysis": "Enough evidence has been collected."
}
`;


        const response =
            await this.ai.analyze(prompt);


        return this.extractJson(response);
    }


    // ==================================================
    // PARSE OLLAMA RESPONSE
    // ==================================================

    extractJson(response) {

        let cleaned = response.trim();


        cleaned = cleaned
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();


        // ------------------------------------------------
        // FIRST TRY NORMAL JSON
        // ------------------------------------------------

        const firstBrace =
            cleaned.indexOf('{');

        const lastBrace =
            cleaned.lastIndexOf('}');


        if (
            firstBrace !== -1 &&
            lastBrace !== -1
        ) {

            const jsonText =
                cleaned.substring(
                    firstBrace,
                    lastBrace + 1
                );


            try {

                const parsed =
                    JSON.parse(jsonText);


                // Return parsed JSON even if action is missing.
                // Main investigation loop handles invalid actions safely.
                return parsed;

            }

            catch (error) {

                console.log(
                    'Agent JSON parsing failed. Using fallback parser...'
                );
            }
        }


        // ------------------------------------------------
        // FALLBACK PARSER FOR SMALL LOCAL LLM
        // ------------------------------------------------

        const lowerResponse =
            cleaned.toLowerCase();


        // ------------------------------------------------
        // READ PROJECT FILE
        // ------------------------------------------------

        if (
            lowerResponse.includes(
                'read_project_file'
            )
        ) {

            const fileMatch =
                cleaned.match(
                    /(?:pages|tests|config|fixtures|ai|mcp|components)[\\/][\w.\-\\/]+\.js/i
                );


            if (fileMatch) {

                return {

                    action:
                        'read_project_file',

                    arguments: {

                        filePath:
                            fileMatch[0]
                                .replace(/\\/g, '/')
                    },

                    reason:
                        cleaned
                };
            }
        }


        // ------------------------------------------------
        // LIST PROJECT FILES
        // ------------------------------------------------

        if (
            lowerResponse.includes(
                'list_project_files'
            )
        ) {

            let directory = 'pages';


            if (
                lowerResponse.includes('tests')
            ) {

                directory = 'tests';
            }

            else if (
                lowerResponse.includes('results')
            ) {

                directory = 'results';
            }

            else if (
                lowerResponse.includes('config')
            ) {

                directory = 'config';
            }

            else if (
                lowerResponse.includes('components')
            ) {

                directory = 'components';
            }

            else if (
                lowerResponse.includes('fixtures')
            ) {

                directory = 'fixtures';
            }


            return {

                action:
                    'list_project_files',

                arguments: {
                    directory
                },

                reason:
                    cleaned
            };
        }


        // ------------------------------------------------
        // FINAL
        // ------------------------------------------------

        if (
            lowerResponse.includes('final') ||
            lowerResponse.includes('root cause') ||
            lowerResponse.includes('rca')
        ) {

            return {

                action: 'final',

                analysis: cleaned
            };
        }


        // ------------------------------------------------
        // UNRECOGNIZED RESPONSE
        // ------------------------------------------------

        return {

            action: null,

            analysis: cleaned
        };
    }


    // ==================================================
    // UNIQUE ACTION KEY
    // ==================================================

    getActionKey(action) {

        return JSON.stringify({

            action:
                action.action,

            arguments:
                action.arguments || {}
        });
    }


    // ==================================================
    // EXECUTE MCP TOOL
    // ==================================================

    async executeTool(action) {

        console.log(
            `\nAgent selected MCP tool: ${action.action}`
        );


        console.log(
            `Reason: ${action.reason || 'Not provided'}`
        );


        const result =
            await this.client.callTool({

                name:
                    action.action,

                arguments:
                    action.arguments || {}
            });


        return result.content
            .filter(
                item =>
                    item.type === 'text'
            )
            .map(
                item =>
                    item.text
            )
            .join('\n');
    }


    // ==================================================
    // GENERATE GROUNDED FINAL RCA
    // ==================================================

    async generateFinalRca(
        failureDetails,
        investigationHistory
    ) {

        const prompt = `
You are a Senior QA Automation Engineer.

Generate the FINAL RCA for this Playwright failure.

You MUST use ONLY the failure information and MCP
evidence supplied below.

Do NOT claim that you:

- inspected browser DevTools
- inspected the live DOM
- inspected screenshots
- inspected videos
- inspected network logs
- inspected traces
- executed another test

unless such evidence explicitly appears below.

If something has not been verified, describe it as
a POSSIBILITY or recommended investigation.


PLAYWRIGHT FAILURE

TEST:
${failureDetails.testName}

ERROR:
${failureDetails.error}

STACK:
${failureDetails.stack || 'Not available'}


ACTUAL MCP EVIDENCE COLLECTED:

${investigationHistory || 'No MCP evidence collected.'}


Return EXACTLY these sections:

FAILURE CATEGORY:

CONFIRMED FACTS:
- Only facts directly supported by supplied evidence.

PROBABLE ROOT CAUSE:
- Clearly identify this as a conclusion based on evidence.

SUPPORTING EVIDENCE:
- Explain which evidence supports the conclusion.

SUGGESTED FIX:
- Give the most appropriate likely correction.

ADDITIONAL INVESTIGATION:
- Mention only checks that still need to be performed.
`;


        return await this.ai.analyze(
            prompt
        );
    }


    // ==================================================
    // MAIN AGENT INVESTIGATION LOOP
    // ==================================================

    async investigate(
        failureDetails
    ) {

        console.log(
            '\n========================================'
        );

        console.log(
            'AGENTIC AI FAILURE INVESTIGATION'
        );

        console.log(
            '========================================'
        );


        // Clear memory before every investigation
        this.executedActions.clear();


        await this.connectMcp();


        try {

            const tools =
                await this.client.listTools();


            console.log(
                '\nAvailable MCP Tools:'
            );


            for (
                const tool
                of tools.tools
            ) {

                console.log(
                    `- ${tool.name}`
                );
            }


            let investigationHistory = '';


            // ==================================================
            // REASON → ACT → OBSERVE LOOP
            // ==================================================

            for (
                let step = 1;
                step <= this.maxSteps;
                step++
            ) {

                console.log(
                    `\n--- Agent Investigation Step ${step} ---`
                );


                const action =
                    await this.decideNextAction(
                        failureDetails,
                        tools.tools,
                        investigationHistory
                    );


                console.log(
                    `Agent Decision: ${action?.action}`
                );


                // ------------------------------------------------
                // INVALID / MISSING AGENT DECISION
                // ------------------------------------------------

                if (
                    !action ||
                    !action.action
                ) {

                    console.log(
                        '\nAgent returned no valid next action.'
                    );


                    console.log(
                        'Using collected evidence to generate final RCA.'
                    );


                    return await this.generateFinalRca(
                        failureDetails,
                        investigationHistory
                    );
                }


                // ------------------------------------------------
                // AGENT CHOOSES FINAL
                // ------------------------------------------------

                if (
                    action.action ===
                    'final'
                ) {

                    console.log(
                        '\nAgent has enough evidence.'
                    );


                    console.log(
                        'Generating grounded final RCA...'
                    );


                    return await this.generateFinalRca(
                        failureDetails,
                        investigationHistory
                    );
                }


                // ------------------------------------------------
                // ALLOWED MCP TOOLS
                // ------------------------------------------------

                const allowedTools = [

                    'read_project_file',

                    'list_project_files'
                ];


                if (
                    !allowedTools.includes(
                        action.action
                    )
                ) {

                    console.log(
                        `\nUnsupported tool requested: ${action.action}`
                    );


                    console.log(
                        'Using collected evidence to generate final RCA.'
                    );


                    return await this.generateFinalRca(
                        failureDetails,
                        investigationHistory
                    );
                }


                // ------------------------------------------------
                // DUPLICATE ACTION PROTECTION
                // ------------------------------------------------

                const actionKey =
                    this.getActionKey(
                        action
                    );


                if (
                    this.executedActions.has(
                        actionKey
                    )
                ) {

                    console.log(
                        '\nDuplicate MCP action blocked.'
                    );


                    console.log(
                        `Already executed: ${action.action}`
                    );


                    investigationHistory += `

STEP ${step}

AGENT REQUESTED DUPLICATE ACTION:

${action.action}

ARGUMENTS:
${JSON.stringify(action.arguments)}

RESULT:
BLOCKED.

This exact MCP operation was already executed.

Do NOT request it again.

Choose a DIFFERENT MCP operation or choose FINAL.

----------------------------------------
`;


                    continue;
                }


                // Remember this action
                this.executedActions.add(
                    actionKey
                );


                // ------------------------------------------------
                // EXECUTE MCP TOOL
                // ------------------------------------------------

                const observation =
                    await this.executeTool(
                        action
                    );


                console.log(
                    '\nMCP Observation:'
                );


                console.log(
                    observation.substring(
                        0,
                        1500
                    )
                );


                // ------------------------------------------------
                // STORE MCP EVIDENCE
                // ------------------------------------------------

                investigationHistory += `

STEP ${step}

ACTION:
${action.action}

REASON:
${action.reason || 'Not provided'}

ARGUMENTS:
${JSON.stringify(action.arguments)}

MCP OBSERVATION:
${observation}

----------------------------------------
`;
            }


            // ==================================================
            // MAXIMUM STEPS REACHED
            // ==================================================

            console.log(
                '\nMaximum investigation steps reached.'
            );


            console.log(
                'Generating grounded RCA from collected evidence...'
            );


            return await this.generateFinalRca(
                failureDetails,
                investigationHistory
            );
        }

        finally {

            if (
                this.client
            ) {

                await this.client.close();


                console.log(
                    '\nAgent disconnected from MCP Server.'
                );
            }
        }
    }
}


module.exports =
    FailureInvestigationAgent;