class LoggerUtils {
    static info(message, extra = '') {
        console.log(`[INFO] ${message}${extra ? ` | ${extra}` : ''}`);
    }

    static warn(message, extra = '') {
        console.warn(`[WARN] ${message}${extra ? ` | ${extra}` : ''}`);
    }

    static error(message, extra = '') {
        console.error(`[ERROR] ${message}${extra ? ` | ${extra}` : ''}`);
    }

    static step(message) {
        console.log(`\n===== ${message} =====`);
    }
}

module.exports = LoggerUtils;
