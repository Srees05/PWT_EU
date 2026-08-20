const { test: base } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const FailureInvestigationAgent =
    require('../ai/agents/FailureInvestigationAgent');

const test = base.extend({});


test.afterEach(async ({}, testInfo) => {

    // ------------------------------------------------
    // Run Agentic AI only for FAILED tests
    // ------------------------------------------------

    if (testInfo.status !== 'failed') {
        return;
    }


    // ------------------------------------------------
    // Give Agentic investigation additional time
    //
    // Normal tests remain at normal Playwright timeout.
    // Only failed tests entering AI investigation
    // receive this extended timeout.
    // ------------------------------------------------

   testInfo.setTimeout(
    Number(
        process.env.AI_FAILURE_TIMEOUT_MS ||
        180000
    )
);


    console.log('\n========================================');
    console.log('AGENTIC AI FAILURE INVESTIGATION');
    console.log('========================================');


    try {

        const agent =
            new FailureInvestigationAgent();


        const failureDetails = {

            testName:
                testInfo.title,

            error:
                testInfo.error?.message ||
                'Error message not available',

            stack:
                testInfo.error?.stack ||
                'Stack trace not available'
        };


        console.log(
            `Investigating failed test: ${testInfo.title}`
        );


        // ------------------------------------------------
        // START AGENTIC INVESTIGATION
        // ------------------------------------------------

        const analysis =
            await agent.investigate(
                failureDetails
            );


        console.log('\nFINAL AGENTIC AI RCA');
        console.log('----------------------------------------');
        console.log(analysis);
        console.log('========================================\n');


        // ------------------------------------------------
        // CREATE REPORT DIRECTORY
        // ------------------------------------------------

        const reportDirectory =
            path.join(
                process.cwd(),
                'reports',
                'agentic-ai-analysis'
            );


        fs.mkdirSync(
            reportDirectory,
            {
                recursive: true
            }
        );


        // ------------------------------------------------
        // SAFE FILE NAME
        // ------------------------------------------------

        const safeTestName =
            testInfo.title.replace(
                /[^a-zA-Z0-9-_]/g,
                '_'
            );


        const reportFile =
            path.join(
                reportDirectory,
                `${safeTestName}.txt`
            );


        // ------------------------------------------------
        // BUILD AGENTIC RCA REPORT
        // ------------------------------------------------

        const reportContent = `
PWT_EU - AGENTIC AI FAILURE INVESTIGATION
=========================================

TEST NAME:
${testInfo.title}

BROWSER:
${testInfo.project.name}

STATUS:
${testInfo.status}


-----------------------------------------
PLAYWRIGHT ERROR
-----------------------------------------

${failureDetails.error}


-----------------------------------------
STACK TRACE
-----------------------------------------

${failureDetails.stack}


-----------------------------------------
AGENTIC AI RCA
-----------------------------------------

${analysis}


=========================================
AI Provider: Ollama
Model: llama3.2:3b
MCP Enabled: Yes
Agent: FailureInvestigationAgent
=========================================
`;


        fs.writeFileSync(
            reportFile,
            reportContent,
            'utf8'
        );


        console.log(
            `Agentic AI analysis saved: ${reportFile}`
        );


        // ------------------------------------------------
        // ATTACH RCA TO PLAYWRIGHT REPORT
        // ------------------------------------------------

        await testInfo.attach(
            'Agentic AI Failure Investigation',
            {
                path: reportFile,
                contentType: 'text/plain'
            }
        );


        console.log(
            'Agentic AI RCA attached to Playwright report.'
        );

    }

    catch (error) {

        // Important:
        // AI failure must never replace/hide the
        // original Playwright failure.
        console.error(
            'Agentic AI investigation failed:',
            error.message
        );
    }
});


module.exports = { test };