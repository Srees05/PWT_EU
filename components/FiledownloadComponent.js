class FiledownloadComponent {
    constructor(page, rootSelector = 'a[download], button[download], [data-testid="file-download"]') {
        this.page = page;
        this.root = page.locator(rootSelector);
    }

    async download(expectedFileName = null) {
        const trigger = this.root.first();
        await trigger.waitFor({ state: 'visible' });

        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            trigger.click()
        ]);

        if (expectedFileName) {
            const suggestedName = download.suggestedFilename();
            if (suggestedName !== expectedFileName) {
                throw new Error(`Expected downloaded file '${expectedFileName}' but got '${suggestedName}'`);
            }
        }

        return download;
    }
}

module.exports = FiledownloadComponent;
