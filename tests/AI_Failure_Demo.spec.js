const { test, expect } = require('../fixtures/CustomFixtures');

test('AI Failure Analyzer Demo @regression', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');

    await page.locator('#password').fill('secret_sauce');

    await page.locator('#login-button').click();

    // Intentionally WRONG locator
    // This is only to demonstrate GenAI failure analysis.
    await page.locator('#checkout_DOES_NOT_EXIST').click({
        timeout: 5000
    });

    await expect(page).toHaveURL(/inventory/);
});