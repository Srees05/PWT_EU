const ClaudeProvider = require('./providers/ClaudeProvider');

console.log("TestClaude.js started");

async function testClaude() {

    try {

        console.log("Creating Claude provider...");

        const ai = new ClaudeProvider();

        // Temporary sample Playwright failure
        const failure = `
Playwright Test Failure

Test Name:
UI_E2E_01_PlaceOrder

Error:
locator('#checkout').click()
Timeout 5000ms exceeded.

Analyze this Playwright failure and provide:

1. Failure Category
2. Probable Root Cause
3. Suggested Investigation
`;

        console.log("Sending Playwright failure to Claude...");

        const analysis = await ai.analyze(failure);

        console.log("\nCLAUDE FAILURE ANALYSIS");
        console.log("----------------------------------");
        console.log(analysis);

    } catch (error) {

        console.error("\nCLAUDE ERROR:");
        console.error(error);
    }
}

testClaude();