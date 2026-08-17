const { chromium, firefox, webkit } = require('@playwright/test');

class BrowserUtils {
    static async launch(browserName = 'chromium', launchOptions = {}) {
        const browserMap = { chromium, firefox, webkit };
        const browserFactory = browserMap[browserName] || chromium;
        return browserFactory.launch(launchOptions);
    }

    static async newContext(browser, contextOptions = {}) {
        return browser.newContext(contextOptions);
    }

    static async openPage(browser, url, contextOptions = {}) {
        const context = await this.newContext(browser, contextOptions);
        const page = await context.newPage();
        if (url) await page.goto(url);
        return { context, page };
    }

    static async closeContext(context) {
        if (context) await context.close();
    }
}

module.exports = BrowserUtils;
