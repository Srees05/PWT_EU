const ScreenshotUtils = require('../utils/ScreenshotUtils');
const LoggerUtils = require('../utils/LoggerUtils');
const FormComponent = require('../components/FormComponent');

class CheckoutPage {

    constructor(page) {
        this.page = page;

        // Customer Information
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');

        // Order Overview
        this.finishButton = page.locator('[data-test="finish"]');
        this.summaryInfo = page.locator('[data-test="checkout-summary-container"]');

        // Order Confirmation
        this.successMessage = page.locator('[data-test="complete-header"]');

        this.form = new FormComponent(page, '[data-test="checkout-info-container"]');
        this.form.getField = (fieldName) => {
            const fieldMap = {
                firstName: this.firstNameInput,
                lastName: this.lastNameInput,
                postalCode: this.postalCodeInput,
            };

            return fieldMap[fieldName] || page.locator(`[name="${fieldName}"]`).first();
        };
    }

    async enterCustomerDetails(firstName, lastName, postalCode, testName) {
        LoggerUtils.step('Fill checkout customer details');

        await this.form.fillField('firstName', firstName);
        await this.form.fillField('lastName', lastName);
        await this.form.fillField('postalCode', postalCode);
        await this.continueButton.click();

        const overviewOpened = await this.summaryInfo
            .isVisible()
            .catch(() => false);

        const status = overviewOpened ? 'PASS' : 'FAIL';
        LoggerUtils.info(`Checkout overview status: ${status}`);

        if (testName) {
            await ScreenshotUtils.capture(
                this.page,
                testName,
                `CustomerDetails-${status}`
            );
        }
    }

    async placeOrder(testName) {
        LoggerUtils.step('Place order');

        await this.finishButton.click();

        const orderPlaced = await this.successMessage
            .isVisible()
            .catch(() => false);

        const status = orderPlaced ? 'PASS' : 'FAIL';
        LoggerUtils.info(`Order placement status: ${status}`);

        if (testName) {
            await ScreenshotUtils.capture(
                this.page,
                testName,
                `PlaceOrder-${status}`
            );
        }
    }
}

module.exports = CheckoutPage;