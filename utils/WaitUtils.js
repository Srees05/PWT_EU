class WaitUtils {
    static async retry(fn, { retries = 3, delay = 500, timeout = 30000 } = {}) {
        let lastError;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                if (attempt === retries) break;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        throw new Error(`Retry failed after ${retries} attempts. Last error: ${lastError?.message || lastError}`);
    }

    static async waitForCondition(predicate, { timeout = 30000, interval = 250 } = {}) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            if (await predicate()) {
                return true;
            }
            await new Promise((resolve) => setTimeout(resolve, interval));
        }

        return false;
    }

    static async waitForLocator(locator, { timeout = 30000, state = 'visible' } = {}) {
        await locator.waitFor({ state, timeout });
        return locator;
    }
}

module.exports = WaitUtils;
