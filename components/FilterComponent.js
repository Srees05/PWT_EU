class FilterComponent {
    constructor(page, rootSelector = '[data-testid="filter"], .filter, [aria-label*="filter" i]') {
        this.page = page;
        this.root = page.locator(rootSelector);
    }

    async open() {
        const toggle = this.root
            .locator('button, [role="button"]')
            .filter({ hasText: /filter|show filters/i })
            .first();

        if (await toggle.count()) {
            await toggle.click();
        }
    }

    async apply() {
        const applyButton = this.root
            .locator('button, input[type="submit"]')
            .filter({ hasText: /apply|filter|submit/i })
            .first();

        if (await applyButton.count()) {
            await applyButton.click();
        }
    }

    async reset() {
        const resetButton = this.root
            .locator('button')
            .filter({ hasText: /reset|clear/i })
            .first();

        if (await resetButton.count()) {
            await resetButton.click();
        }
    }

    async selectOption(optionText) {
        const select = this.root.locator('select').first();

        if (await select.count()) {
            await select.selectOption({ label: optionText });
            return;
        }

        const option = this.root
            .locator('button, [role="option"]')
            .filter({ hasText: optionText })
            .first();

        if (await option.count()) {
            await option.click();
        }
    }

    async setText(value) {
        const input = this.root
            .locator('input[type="text"], input:not([type]), textarea')
            .first();

        if (await input.count()) {
            await input.fill(String(value));
        }
    }
}

module.exports = FilterComponent;
