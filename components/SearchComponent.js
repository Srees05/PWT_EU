class SearchComponent {
    constructor(page, rootSelector = '[data-testid="search"], .search, form[role="search"], input[type="search"]') {
        this.page = page;
        this.root = page.locator(rootSelector);
        this.input = this.root
            .locator('input[type="search"], input[placeholder*="search" i], input[aria-label*="search" i]')
            .first();
        this.submitButton = this.root
            .locator('button, input[type="submit"]')
            .filter({ hasText: /search|find/i })
            .first();
    }

    async search(term) {
        await this.input.waitFor({ state: 'visible' });
        await this.input.fill(term);

        if (await this.submitButton.count()) {
            await this.submitButton.click();
            return;
        }

        await this.input.press('Enter');
    }

    async clear() {
        if (await this.input.count()) {
            await this.input.fill('');
        }
    }

    async getValue() {
        return this.input.inputValue();
    }
}

module.exports = SearchComponent;
