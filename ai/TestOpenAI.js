const OpenAIProvider = require('./providers/OpenAIProvider');

async function testAI() {

    const ai = new OpenAIProvider();

    const failure = `
    Playwright Test Failure:

    Test Name: UI_E2E_01_PlaceOrder

    Error:
    locator('#checkout').click()
    Timeout 5000ms exceeded.

    Analyze this failure and provide:

    1. Failure Category
    2. Probable Root Cause
    3. Suggested Investigation
    `;

    console.log('Sending Playwright failure to OpenAI...\n');

    const analysis = await ai.analyze(failure);

    console.log('AI FAILURE ANALYSIS');
    console.log('------------------------------');
    console.log(analysis);
}

testAI().catch(console.error);