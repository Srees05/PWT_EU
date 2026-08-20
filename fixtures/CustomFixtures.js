const { test: base, expect } = require('@playwright/test');

const fs = require('fs');
const path = require('path');

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
// TIMEOUT
// ============================================================

test.setTimeout(
    Number(
        process.env.AI_FAILURE_TIMEOUT_MS ||
        240000
    )
);


// ============================================================
// AGENTIC AI FAILURE INVESTIGATION
// ============================================================

test.afterEach(async ({}, testInfo) => {

    // Run only when actual result differs from expected result
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

        // ====================================================
        // CAPTURE PLAYWRIGHT FAILURE
        // ====================================================

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


        // ====================================================
        // START FAILURE INVESTIGATION AGENT
        // ====================================================

        const agent =
            new FailureInvestigationAgent();


        const analysis =
            await agent.investigate(
                failureDetails
            );


        // ====================================================
        // PRINT FINAL RCA
        // ====================================================

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


        // ====================================================
        // CREATE AI REPORT DIRECTORY
        // ====================================================

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


        // ====================================================
        // CREATE SAFE RCA FILE NAME
        // ====================================================

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


        // ====================================================
        // BUILD RCA REPORT
        // ====================================================

        const reportContent = `
PWT_EU - AGENTIC AI FAILURE INVESTIGATION
=========================================

TEST NAME:
${testInfo.title}

TEST FILE:
${testInfo.file}

BROWSER:
${testInfo.project.name}

STATUS:
${testInfo.status}


-----------------------------------------
PLAYWRIGHT ERROR
-----------------------------------------

${errorMessage}


-----------------------------------------
STACK TRACE
-----------------------------------------

${stackTrace}


-----------------------------------------
AGENTIC AI RCA
-----------------------------------------

${analysis}


=========================================
AI Provider : Ollama
Model       : ${process.env.OLLAMA_MODEL || 'llama3.2:3b'}
MCP Enabled : Yes
Agent       : FailureInvestigationAgent
=========================================
`;


        // ====================================================
        // SAVE RCA AS TXT
        // ====================================================

        fs.writeFileSync(
            reportFile,
            reportContent,
            'utf8'
        );


        console.log(
            `Agentic AI analysis saved: ${reportFile}`
        );


        // ====================================================
        // ATTACH RCA TO PLAYWRIGHT REPORT
        // ====================================================

        await testInfo.attach(
            'Agentic AI Failure Investigation',
            {

                path:
                    reportFile,

                contentType:
                    'text/plain'
            }
        );


        console.log(
            'Agentic AI RCA attached to Playwright report.'
        );

    }

    catch (error) {

        // AI failure must never replace original Playwright failure
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