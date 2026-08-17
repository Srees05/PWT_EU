class TableComponent {
    constructor(page, rootSelector = 'table, [role="table"], [data-testid="table"]') {
        this.page = page;
        this.root = page.locator(rootSelector);
    }

    getRowByText(text) {
        return this.root.locator('tr').filter({ hasText: text }).first();
    }

    getCell(rowText, columnIndex = 0) {
        return this.getRowByText(rowText).locator('td, th').nth(columnIndex);
    }

    async getRowText(rowText) {
        return (await this.getRowByText(rowText).textContent()) || '';
    }

    async getCellText(rowText, columnIndex = 0) {
        return (await this.getCell(rowText, columnIndex).textContent()) || '';
    }

    async rowCount() {
        return this.root.locator('tr').count();
    }
}

module.exports = TableComponent;
