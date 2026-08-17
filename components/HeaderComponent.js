class HeaderComponent {
    constructor(page, rootSelector = 'header, [data-testid="header"], .header') {
        this.page = page;
        this.root = page.locator(rootSelector);
        this.menuButton = page
            .locator('button, [role="button"]')
            .filter({ hasText: /menu|navigation/i })
            .first();
        this.userMenuButton = page
            .locator('button, [role="button"]')
            .filter({ hasText: /profile|account|user|menu/i })
            .first();
    }

    async openMenu() {
        if (await this.menuButton.count()) {
            await this.menuButton.click();
        }
    }

    async clickNavItem(itemName) {
        const navLink = this.root.locator('a, button').filter({ hasText: itemName }).first();
        await navLink.waitFor({ state: 'visible' });
        await navLink.click();
    }

    async openUserMenu() {
        if (await this.userMenuButton.count()) {
            await this.userMenuButton.click();
        }
    }

    async logout() {
        await this.openUserMenu();
        const logoutLink = this.page
            .locator('a, button')
            .filter({ hasText: /logout|sign out|log out/i })
            .first();

        await logoutLink.waitFor({ state: 'visible' });
        await logoutLink.click();
    }
}

module.exports = HeaderComponent;
