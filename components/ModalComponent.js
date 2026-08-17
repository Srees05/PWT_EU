class ModalComponent {
    constructor(page, rootSelector = '[role="dialog"], .modal, [data-testid="modal"]') {
        this.page = page;
        this.root = page.locator(rootSelector);
        this.closeButton = this.root
            .locator('button, [aria-label*="close" i], [data-testid="close"]')
            .first();
        this.confirmButton = this.root
            .locator('button')
            .filter({ hasText: /confirm|ok|yes|save|continue/i })
            .first();
        this.cancelButton = this.root
            .locator('button')
            .filter({ hasText: /cancel|dismiss|close/i })
            .first();
    }

    async waitForOpen() {
        await this.root.waitFor({ state: 'visible' });
        return this.root;
    }

    async isVisible() {
        return this.root.isVisible().catch(() => false);
    }

    async close() {
        if (await this.closeButton.count()) {
            await this.closeButton.click();
            return;
        }

        await this.page.keyboard.press('Escape');
    }

    async confirm() {
        await this.confirmButton.waitFor({ state: 'visible' });
        await this.confirmButton.click();
    }

    async cancel() {
        if (await this.cancelButton.count()) {
            await this.cancelButton.click();
            return;
        }

        await this.close();
    }
}

module.exports = ModalComponent;
