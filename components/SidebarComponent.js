class SidebarComponent {
    constructor(page, rootSelector = 'aside, [data-testid="sidebar"], .sidebar') {
        this.page = page;
        this.root = page.locator(rootSelector);
        this.toggleButton = page
            .locator('button, [role="button"]')
            .filter({ hasText: /menu|sidebar/i })
            .first();
    }

    async open() {
        if (await this.toggleButton.count()) {
            await this.toggleButton.click();
        }
    }

    async close() {
        if (await this.toggleButton.count()) {
            await this.toggleButton.click();
        }
    }

    getItem(itemName) {
        return this.root.locator('a, button').filter({ hasText: itemName }).first();
    }

    async click(itemName) {
        const item = this.getItem(itemName);
        await item.waitFor({ state: 'visible' });
        await item.click();
        return item;
    }

    async isVisible() {
        return this.root.isVisible().catch(() => false);
    }
}

module.exports = SidebarComponent;
