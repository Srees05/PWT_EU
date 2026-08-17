class FileuploadComponent {
    constructor(page, rootSelector = 'input[type="file"], [data-testid="file-upload"], .file-upload') {
        this.page = page;
        this.root = page.locator(rootSelector);
        this.input = this.root.locator('input[type="file"]').first();
    }

    async upload(filePath) {
        await this.input.waitFor({ state: 'attached' });
        await this.input.setInputFiles(filePath);
    }

    async uploadMultiple(filePaths) {
        await this.input.waitFor({ state: 'attached' });
        await this.input.setInputFiles(filePaths);
    }
}

module.exports = FileuploadComponent;
