const TableComponent = require('../components/TableComponent');

class CartPage {

    constructor(page) {
        this.page = page;

        // Locators
        this.cartItems = page.locator('[data-test="inventory-item-name"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton =
            page.locator('[data-test="continue-shopping"]');

        this.table = new TableComponent(page, '[data-test="cart-list"]');
    }

    getRemoveButton(productName) {
        const productId = productName
            .toLowerCase()
            .replaceAll(' ', '-');

        return this.page.locator(
            `[data-test="remove-${productId}"]`
        );
    }

    async removeProduct(productName) {
        await this.getRemoveButton(productName).click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async hasProduct(productName) {
        return this.table.getRowByText(productName).count() > 0;
    }
}

module.exports = CartPage;