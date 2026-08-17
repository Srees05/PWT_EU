class NavigationComponent {
    constructor(page, rootSelector = 'nav, [data-testid="navigation"], .navigation') {
        this.page = page;
        this.root = page.locator(rootSelector);
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

    async isActive(itemName) {
        const item = this.getItem(itemName);
        const classes = await item.getAttribute('class');
        const ariaCurrent = await item.getAttribute('aria-current');
        return /active|selected|current/i.test(classes || '') || ariaCurrent === 'page';
    }
}

module.exports = NavigationComponent;
