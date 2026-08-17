class RandomUtils {
    static string(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }

    static number(min = 0, max = 9999) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static email(domain = 'example.com') {
        return `${this.string(8).toLowerCase()}@${domain}`;
    }
}

module.exports = RandomUtils;
