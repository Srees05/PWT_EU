class PaginationComponent {
    constructor(page, rootSelector = '[data-testid="pagination"], .pagination, nav[aria-label*="pagination" i]') {
        this.page = page;
        this.root = page.locator(rootSelector);
    }

    getPageButton(pageNumber) {
        return this.root.locator('button, a').filter({ hasText: String(pageNumber) }).first();
    }

    async goTo(pageNumber) {
        const button = this.getPageButton(pageNumber);
        await button.waitFor({ state: 'visible' });
        await button.click();
    }

    async next() {
        const button = this.root
            .locator('button, a')
            .filter({ hasText: /next|›|»/i })
            .first();

        await button.waitFor({ state: 'visible' });
        await button.click();
    }

    async previous() {
        const button = this.root
            .locator('button, a')
            .filter({ hasText: /prev|previous|‹|«/i })
            .first();

        await button.waitFor({ state: 'visible' });
        await button.click();
    }

    async isCurrentPage(pageNumber) {
        const button = this.getPageButton(pageNumber);
        const ariaCurrent = await button.getAttribute('aria-current');
        const classes = await button.getAttribute('class');
        return ariaCurrent === 'page' || /current|active/i.test(classes || '');
    }
}

module.exports = PaginationComponent;
