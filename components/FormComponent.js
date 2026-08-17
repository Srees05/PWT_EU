class FormComponent {
    constructor(page, rootSelector = 'form, [data-testid="form"], .form') {
        this.page = page;
        this.root = page.locator(rootSelector);
        this.submitButton = this.root
            .locator('button[type="submit"], input[type="submit"], button')
            .filter({ hasText: /submit|save|continue|next|send/i })
            .first();
    }

    getField(name) {
        const normalized = name.toLowerCase().replace(/[_\s]+/g, '-');

        return this.root
            .locator(
                `input[name="${name}"], input[name="${normalized}"], input[aria-label="${name}"], input[placeholder="${name}"], ` +
                `select[name="${name}"], select[name="${normalized}"], textarea[name="${name}"], textarea[name="${normalized}"]`
            )
            .first();
    }

    async fillField(name, value) {
        const field = this.getField(name);
        await field.waitFor({ state: 'visible' });

        const fieldType = await field.getAttribute('type');
        const tagName = await field.evaluate((element) => element.tagName.toLowerCase());

        if (tagName === 'select') {
            await field.selectOption({ label: String(value) });
            return field;
        }

        if (fieldType === 'checkbox' || fieldType === 'radio') {
            if (value === true || value === 'true' || value === 'on') {
                await field.check();
            } else {
                await field.uncheck();
            }
            return field;
        }

        await field.fill(String(value));
        return field;
    }

    async fill(fields) {
        for (const [name, value] of Object.entries(fields)) {
            await this.fillField(name, value);
        }
    }

    async submit() {
        await this.submitButton.waitFor({ state: 'visible' });
        await this.submitButton.click();
    }
}

module.exports = FormComponent;
