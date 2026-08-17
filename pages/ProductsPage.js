const DropdownComponent = require('../components/DropdownComponent');
const HeaderComponent = require('../components/HeaderComponent');
const LoggerUtils = require('../utils/LoggerUtils');

class ProductsPage {

    constructor(page) {
        this.page = page;

        // Locators
        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');

        this.sortComponent = new DropdownComponent(page, '[data-test="product-sort-container"]');
        this.headerComponent = new HeaderComponent(page, 'header');
    }

    getProductAddToCartButton(productName) {
        const productId = productName
            .toLowerCase()
            .replaceAll(' ', '-');

        return this.page.locator(
            `[data-test="add-to-cart-${productId}"]`
        );
    }

    async sortProducts(option) {
        LoggerUtils.info(`Sorting products by: ${option}`);
        await this.sortComponent.selectByText(option);
    }

    async addProductToCart(productName) {
        LoggerUtils.info(`Adding product to cart: ${productName}`);
        await this.getProductAddToCartButton(productName).click();
    }

    async openCart() {
        LoggerUtils.step('Open cart');
        await this.cartIcon.click();
    }

    async logout() {
        LoggerUtils.info('Logging out from application');
        await this.headerComponent.openUserMenu();
        await this.menuButton.click();
        await this.logoutLink.click();
    }
}

module.exports = ProductsPage;