const { test: base, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');

const FailureInvestigationAgent =
    require('../ai/agents/FailureInvestigationAgent');


// ============================================================
// CUSTOM PLAYWRIGHT FIXTURES
// ============================================================

const test = base.extend({

    loginPage: async ({ page }, use) => {

        const loginPage =
            new LoginPage(page);

        await use(loginPage);
    },


    productsPage: async ({ page }, use) => {

        const productsPage =
            new ProductsPage(page);

        await use(productsPage);
    },


    cartPage: async ({ page }, use) => {

        const cartPage =
            new CartPage(page);

        await use(cartPage);
    },


    checkoutPage: async ({ page }, use) => {

        const checkoutPage =
            new CheckoutPage(page);

        await use(checkoutPage);
    }

});


// ============================================================
// GLOBAL TIMEOUT FOR TEST + AI FAILURE INVESTIGATION
// ============================================================

test.setTimeout(
    Number(
        process.env.AI_FAILURE_TIMEOUT_MS ||
        240000
    )
);


// ============================================================
// AGENTIC AI FAILURE INVESTIGATION
//
// PASS:
// No AI call
//
// FAIL:
// Playwright Error
//      ↓
// FailureInvestigationAgent
//      ↓
// MCP Tools
//      ↓
// Ollama
//      ↓
// Grounded RCA
//      ↓
// Playwright Attachment
// ============================================================

test.afterEach(async ({}, testInfo) => {

    // --------------------------------------------------------
    // Run AI investigation ONLY when actual status
    // differs from expected status
    // --------------------------------------------------------

    if (
        testInfo.status ===
        testInfo.expectedStatus
    ) {

        return;
    }


    console.log(
        '\n========================================'
    );

    console.log(
        'AGENTIC AI FAILURE INVESTIGATION'
    );

    console.log(
        '========================================'
    );


    console.log(
        `Investigating failed test: ${testInfo.title}`
    );


    try {

        // ----------------------------------------------------
        // CAPTURE REAL PLAYWRIGHT FAILURE INFORMATION
        // ----------------------------------------------------

        const errorMessage =
            testInfo.error?.message ||
            'No Playwright error message available';


        const stackTrace =
            testInfo.error?.stack ||
            'No Playwright stack trace available';


        const failureDetails = {

            testName:
                testInfo.title,

            testFile:
                testInfo.file,

            error:
                errorMessage,

            stack:
                stackTrace
        };


        // ----------------------------------------------------
        // CREATE AGENT
        // ----------------------------------------------------

        const agent =
            new FailureInvestigationAgent();


        // ----------------------------------------------------
        // START AGENTIC INVESTIGATION
        //
        // Agent:
        // Reason
        //   ↓
        // MCP Tool
        //   ↓
        // Observation
        //   ↓
        // Reason Again
        //   ↓
        // Final RCA
        // ----------------------------------------------------

        const analysis =
            await agent.investigate(
                failureDetails
            );


        // ----------------------------------------------------
        // PRINT RCA
        // ----------------------------------------------------

        console.log(
            '\nFINAL AGENTIC AI RCA'
        );

        console.log(
            '----------------------------------------'
        );

        console.log(
            analysis
        );

        console.log(
            '========================================\n'
        );


        // ----------------------------------------------------
        // ATTACH RCA TO PLAYWRIGHT REPORT
        // ----------------------------------------------------

        await testInfo.attach(
            'Agentic AI Failure Investigation',
            {

                body:
                    Buffer.from(
                        analysis,
                        'utf8'
                    ),

                contentType:
                    'text/plain'
            }
        );


        console.log(
            'Agentic AI RCA attached to Playwright report.'
        );

    }

    catch (error) {

        // ----------------------------------------------------
        // IMPORTANT
        //
        // AI/MCP/Ollama failure must never replace
        // the original Playwright failure.
        // ----------------------------------------------------

        console.error(
            'Agentic AI investigation failed:',
            error.message
        );
    }
});


module.exports = {
    test,
    expect
};