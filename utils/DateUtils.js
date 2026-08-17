class DateUtils {
    static nowStamp(format = 'iso') {
        const now = new Date();

        if (format === 'iso') return now.toISOString();
        if (format === 'yyyy-mm-dd') return now.toISOString().split('T')[0];
        if (format === 'yyyyMMddHHmmss') {
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const hh = String(now.getHours()).padStart(2, '0');
            const mi = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            return `${yyyy}${mm}${dd}${hh}${mi}${ss}`;
        }

        return now.toString();
    }

    static addDays(date, days) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    static formatDate(date, pattern = 'yyyy-mm-dd') {
        const value = new Date(date);
        const yyyy = value.getFullYear();
        const mm = String(value.getMonth() + 1).padStart(2, '0');
        const dd = String(value.getDate()).padStart(2, '0');

        if (pattern === 'yyyy-mm-dd') return `${yyyy}-${mm}-${dd}`;
        if (pattern === 'dd-mm-yyyy') return `${dd}-${mm}-${yyyy}`;
        if (pattern === 'mm/dd/yyyy') return `${mm}/${dd}/${yyyy}`;

        return value.toISOString();
    }
}

module.exports = DateUtils;
