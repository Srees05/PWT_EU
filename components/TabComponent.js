class TabComponent {
    constructor(page, rootSelector = '[role="tablist"], .tabs, [data-testid="tabs"]') {
        this.page = page;
        this.root = page.locator(rootSelector);
    }

    getTab(label) {
        return this.root.locator('[role="tab"], button').filter({ hasText: label }).first();
    }

    async select(label) {
        const tab = this.getTab(label);
        await tab.waitFor({ state: 'visible' });
        await tab.click();
        return tab;
    }

    async isSelected(label) {
        const tab = this.getTab(label);
        const ariaSelected = await tab.getAttribute('aria-selected');

        if (ariaSelected !== null) {
            return ariaSelected === 'true';
        }

        const classes = await tab.getAttribute('class');
        return /active|selected/i.test(classes || '');
    }
}

module.exports = TabComponent;
