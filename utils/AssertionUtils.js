const { expect } = require('@playwright/test');

class AssertionUtils {
    static async expectText(locator, expectedText, options = {}) {
        await expect(locator).toContainText(expectedText, options);
    }

    static async expectVisible(locator, options = {}) {
        await expect(locator).toBeVisible(options);
    }

    static async expectHidden(locator, options = {}) {
        await expect(locator).toBeHidden(options);
    }

    static async expectEnabled(locator, options = {}) {
        await expect(locator).toBeEnabled(options);
    }

    static async expectDisabled(locator, options = {}) {
        await expect(locator).toBeDisabled(options);
    }
}

module.exports = AssertionUtils;
