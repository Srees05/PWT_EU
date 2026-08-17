class DatepickerComponent {
    constructor(page, rootSelector = '[data-testid="datepicker"], .datepicker, input[type="date"]') {
        this.page = page;
        this.root = page.locator(rootSelector);
        this.input = this.root.locator('input, [role="textbox"]').first();
    }

    async openCalendar() {
        await this.input.waitFor({ state: 'visible' });
        await this.input.click();
    }

    async selectDate(dateString) {
        await this.input.waitFor({ state: 'visible' });
        await this.input.fill(dateString);
        await this.input.press('Tab');
    }

    async selectDay(day) {
        const dateButton = this.page
            .locator('button, [role="button"]')
            .filter({ hasText: String(day) })
            .first();

        await dateButton.waitFor({ state: 'visible' });
        await dateButton.click();
    }
}

module.exports = DatepickerComponent;
