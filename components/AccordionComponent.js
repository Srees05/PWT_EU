class AccordionComponent {
    constructor(page, rootSelector = '[data-testid="accordion"], .accordion, [role="list"]') {
        this.page = page;
        this.root = page.locator(rootSelector);
    }

    getItem(title) {
        return this.root
            .locator('button, [role="button"], .accordion-item')
            .filter({ hasText: title })
            .first();
    }

    async expand(title) {
        const item = this.getItem(title);
        await item.waitFor({ state: 'visible' });
        await item.click();
        return item;
    }

    async collapse(title) {
        const item = this.getItem(title);
        await item.waitFor({ state: 'visible' });
        if (await this.isExpanded(title)) {
            await item.click();
        }
        return item;
    }

    async toggle(title) {
        return this.expand(title);
    }

    async isExpanded(title) {
        const item = this.getItem(title);
        const expanded = await item.getAttribute('aria-expanded');
        return expanded === 'true';
    }
}

module.exports = AccordionComponent;
