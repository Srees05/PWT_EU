const ScreenshotUtils = require('../utils/ScreenshotUtils');
const LoggerUtils = require('../utils/LoggerUtils');
const FormComponent = require('../components/FormComponent');
const { App_Config } = require('../config/App_Config');

class LoginPage {

    constructor(page) {
        this.page = page;
        this.config = App_Config;

        // Locators
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.productsTitle = page.locator('[data-test="title"]');

        this.form = new FormComponent(page, '#login_button_container');
        this.form.getField = (fieldName) => {
            const fieldMap = {
                username: this.usernameInput,
                password: this.passwordInput,
            };

            return fieldMap[fieldName] || page.locator(`[name="${fieldName}"]`).first();
        };
    }

    async login(username, password, testName) {
        LoggerUtils.step('Login to application');
        LoggerUtils.info(`Using base URL: ${this.config.baseURL}`);

        await this.form.fillField('username', username);
        await this.form.fillField('password', password);
        await this.loginButton.click();

        const loginPassed = await this.productsTitle
            .isVisible()
            .catch(() => false);

        const status = loginPassed ? 'PASS' : 'FAIL';
        LoggerUtils.info(`Login status: ${status}`);

        if (testName) {
            await ScreenshotUtils.capture(
                this.page,
                testName,
                `Login-${status}`
            );
        }
    }
}

module.exports = LoginPage;