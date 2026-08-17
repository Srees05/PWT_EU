class DataUtils {
    static deepClone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    static pick(object, keys = []) {
        return keys.reduce((result, key) => {
            if (object && Object.prototype.hasOwnProperty.call(object, key)) {
                result[key] = object[key];
            }
            return result;
        }, {});
    }

    static isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    }

    static mapObjectToArray(object) {
        return Object.entries(object || {}).map(([key, value]) => ({ key, value }));
    }
}

module.exports = DataUtils;
