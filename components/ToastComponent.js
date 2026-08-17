class ToastComponent {
    constructor(page, rootSelector = '[role="alert"], [data-testid="toast"], .toast') {
        this.page = page;
        this.root = page.locator(rootSelector);
    }

    async waitForVisible(messagePattern = /./) {
        const toast = this.root.filter({ hasText: messagePattern }).first();
        await toast.waitFor({ state: 'visible' });
        return toast;
    }

    async getMessage() {
        const toast = this.root.first();
        if (await toast.count()) {
            return (await toast.textContent()) || '';
        }

        return '';
    }

    async close() {
        const closeButton = this.root.locator('button').filter({ hasText: /close|x/i }).first();
        if (await closeButton.count()) {
            await closeButton.click();
        }
    }
}

module.exports = ToastComponent;
