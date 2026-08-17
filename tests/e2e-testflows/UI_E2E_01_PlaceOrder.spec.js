const { test, expect } = require('../../fixtures/CustomFixtures');
const { App_Config } = require('../../config/App_Config');
const LoggerUtils = require('../../utils/LoggerUtils');

const testData = require('../../testdata/UI_E2E_01_PlaceOrder.json');

test('@smoke @e2e UI_E2E_01 - Place Order', async ({
    page,
    loginPage,
    productsPage,
    cartPage,
    checkoutPage
}) => {

    LoggerUtils.step('Start UI_E2E_01 - Place Order');
    LoggerUtils.info(`Base URL: ${App_Config.baseURL}`);

    await page.goto(App_Config.baseURL);

    await loginPage.login(
        testData.login.username,
        testData.login.password,
        'UI_E2E_01'
    );

    await productsPage.addProductToCart(
        testData.product.productName
    );

    await productsPage.openCart();

    await expect(cartPage.cartItems)
        .toContainText(testData.product.productName);

    await cartPage.proceedToCheckout();

    await checkoutPage.enterCustomerDetails(
        testData.checkout.firstName,
        testData.checkout.lastName,
        testData.checkout.postalCode,
        'UI_E2E_01'
    );

    await checkoutPage.placeOrder('UI_E2E_01');

    await expect(checkoutPage.successMessage)
        .toHaveText('Thank you for your order!');

    LoggerUtils.info('UI_E2E_01 completed successfully');
});