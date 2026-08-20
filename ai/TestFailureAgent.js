const FailureInvestigationAgent =
    require('./agents/FailureInvestigationAgent');


async function testAgent() {

    console.log('Starting PWT_EU Failure Investigation Agent...');


    const agent =
        new FailureInvestigationAgent();


    // Simulated failure taken from our Playwright demo
    const failureDetails = {

        testName:
            'AI Failure Analyzer Demo',

        error:
            "locator('#checkout_DOES_NOT_EXIST').click() timed out after 5000ms",

        stack: `
tests/AI_Failure_Demo.spec.js:16

await page
    .locator('#checkout_DOES_NOT_EXIST')
    .click({ timeout: 5000 });
`
    };


    try {

        const analysis =
            await agent.investigate(
                failureDetails
            );


        console.log('\n========================================');
        console.log('FINAL AGENTIC AI RCA');
        console.log('========================================');

        console.log(analysis);

        console.log('========================================');

    }

    catch (error) {

        console.error('\nAGENT ERROR:');
        console.error(error);

    }
}


testAgent();