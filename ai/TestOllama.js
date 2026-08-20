const OllamaProvider = require('./providers/OllamaProvider');

console.log('TestOllama.js started');

async function testOllama() {

    try {

        const ai = new OllamaProvider();

        const failure = `
Playwright Test Failure

Test Name:
UI_E2E_01_PlaceOrder

Error:
locator('#checkout').click()
Timeout 5000ms exceeded.

Analyze this Playwright failure.

Provide exactly:

1. Failure Category
2. Probable Root Cause
3. Suggested Investigation
`;

        console.log('Sending Playwright failure to local LLM...\n');

        const analysis = await ai.analyze(failure);

        console.log('OLLAMA FAILURE ANALYSIS');
        console.log('----------------------------------');
        console.log(analysis);

    } catch (error) {

        console.error('OLLAMA ERROR:');
        console.error(error);
    }
}

testOllama();