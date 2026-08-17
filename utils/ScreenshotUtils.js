const fs = require('fs');

class ScreenshotUtils {

    static async capture(page, testName, screenshotName) {

        const screenshotDir = 'reports/screenshots';

        // Create screenshot directory if it does not exist
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        // Generate timestamp
        const timestamp = new Date()
            .toISOString()
            .replace(/[:.]/g, '-');

        // Generate screenshot file name
        const fileName =
            `${testName}_${screenshotName}_${timestamp}.png`;

        // Capture screenshot
        await page.screenshot({
            path: `${screenshotDir}/${fileName}`,
            fullPage: true
        });
    }
}

module.exports = ScreenshotUtils;