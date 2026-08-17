const ENV = (process.env.ENV || 'QA').toUpperCase();

const configMap = {
    DEV: {
        baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
        browser: process.env.BROWSER || 'chromium',
        headless: (process.env.HEADLESS || 'true').toLowerCase() === 'true',
        timeout: Number(process.env.TIMEOUT || 30000),
        retries: Number(process.env.RETRIES || 1),
    },
    QA: {
        baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
        browser: process.env.BROWSER || 'chromium',
        headless: (process.env.HEADLESS || 'true').toLowerCase() === 'true',
        timeout: Number(process.env.TIMEOUT || 30000),
        retries: Number(process.env.RETRIES || 1),
    },
    STAGING: {
        baseURL: process.env.BASE_URL || 'https://staging.example.com',
        browser: process.env.BROWSER || 'chromium',
        headless: (process.env.HEADLESS || 'true').toLowerCase() === 'true',
        timeout: Number(process.env.TIMEOUT || 30000),
        retries: Number(process.env.RETRIES || 1),
    },
    PROD: {
        baseURL: process.env.BASE_URL || 'https://example.com',
        browser: process.env.BROWSER || 'chromium',
        headless: (process.env.HEADLESS || 'true').toLowerCase() === 'true',
        timeout: Number(process.env.TIMEOUT || 30000),
        retries: Number(process.env.RETRIES || 1),
    },
};

const App_Config = configMap[ENV] || configMap.QA;

module.exports = {
    ENV,
    App_Config,
    getConfig: (env = ENV) => configMap[(env || ENV).toUpperCase()] || configMap.QA,
};
