class StringUtils {
    static normalizeWhitespace(value) {
        return (value || '').replace(/\s+/g, ' ').trim();
    }

    static slugify(value) {
        return this.normalizeWhitespace(value)
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    static titleCase(value) {
        return this.normalizeWhitespace(value)
            .toLowerCase()
            .split(' ')
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    static containsAny(text, values = []) {
        const content = (text || '').toLowerCase();
        return values.some((value) => content.includes(String(value).toLowerCase()));
    }
}

module.exports = StringUtils;
