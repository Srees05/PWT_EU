const { test, expect } = require('../../fixtures/CustomFixtures');
const { App_Config } = require('../../config/App_Config');
const LoggerUtils = require('../../utils/LoggerUtils');

const testData = require('../../testdata/UI_E2E_01_PlaceOrder.json');

test('@regression @e2e UI_E2E_02 - Cart Management', async ({
    page,
    loginPage,
    productsPage,
    cartPage
}) => {

    LoggerUtils.step('Start UI_E2E_02 - Cart Management');
    LoggerUtils.info(`Base URL: ${App_Config.baseURL}`);

    await page.goto(App_Config.baseURL);

    await loginPage.login(
        testData.login.username,
        testData.login.password,
        'UI_E2E_02'
    );

    await productsPage.addProductToCart(
        testData.product.productName
    );

    await productsPage.openCart();

    await expect(cartPage.cartItems)
        .toContainText(testData.product.productName);

    await cartPage.removeProduct(testData.product.productName);

    const productRemoved = await cartPage.hasProduct(testData.product.productName);
    expect(productRemoved).toBeFalsy();

    LoggerUtils.info('UI_E2E_02 completed successfully');
});