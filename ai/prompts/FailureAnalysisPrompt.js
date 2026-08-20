function buildFailurePrompt(failureDetails) {

    return `
You are a Senior QA Automation Engineer specializing in Playwright.

Analyze the following Playwright test failure.

TEST NAME:
${failureDetails.testName}

ERROR:
${failureDetails.error}

STACK TRACE:
${failureDetails.stack || 'Not available'}

Analyze only the evidence provided.

Do not assume a root cause is confirmed unless the evidence proves it.
Do not automatically recommend increasing timeouts.
Do not automatically recommend XPath.
Clearly distinguish probable causes from confirmed facts.

Return ONLY the following format:

FAILURE CATEGORY: <category>

PROBABLE ROOT CAUSE:
<short explanation>

SUGGESTED INVESTIGATION:
1. <step>
2. <step>
3. <step>
`;
}

module.exports = buildFailurePrompt;