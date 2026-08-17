class DropdownComponent {
    constructor(page, rootSelector = '[data-testid="dropdown"], select, .dropdown, [role="combobox"]') {
        this.page = page;
        this.root = page.locator(rootSelector);
        this.trigger = this.root.locator('button, select, [role="combobox"]').first();
    }

    async open() {
        await this.trigger.waitFor({ state: 'visible' });
        await this.trigger.click();
    }

    async selectByText(optionText) {
        const selector = this.root.locator('select').first();

        if (await selector.count()) {
            await selector.selectOption({ label: optionText });
            return;
        }

        await this.open();
        const option = this.page
            .locator('[role="option"], li, button')
            .filter({ hasText: optionText })
            .first();

        await option.waitFor({ state: 'visible' });
        await option.click();
    }

    async selectByValue(value) {
        const selector = this.root.locator('select').first();

        if (await selector.count()) {
            await selector.selectOption({ value });
            return;
        }

        await this.open();
        const option = this.page
            .locator(`[role="option"][value="${value}"], li[value="${value}"], button[value="${value}"]`)
            .first();

        if (await option.count()) {
            await option.waitFor({ state: 'visible' });
            await option.click();
            return;
        }

        const fallback = this.page
            .locator('[role="option"], li, button')
            .filter({ hasText: String(value) })
            .first();

        await fallback.waitFor({ state: 'visible' });
        await fallback.click();
    }
}

module.exports = DropdownComponent;
