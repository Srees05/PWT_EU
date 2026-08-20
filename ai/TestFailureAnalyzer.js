const FailureAnalyzer = require('./FailureAnalyzer');

async function run() {

    const analyzer = new FailureAnalyzer('ollama');

    const failureDetails = {
        testName: 'UI_E2E_01_PlaceOrder',
        error: "locator('#checkout').click() timed out after 5000ms",
        stack: 'CartPage.js:25'
    };

    const result = await analyzer.analyze(failureDetails);

    console.log('\nAI FAILURE ANALYSIS');
    console.log('--------------------------------');
    console.log(result);
}

run().catch(console.error);