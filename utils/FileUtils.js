const fs = require('fs');
const path = require('path');

class FileUtils {
    static ensureDir(dirPath) {
        if (!dirPath) return;
        fs.mkdirSync(dirPath, { recursive: true });
    }

    static readJson(filePath) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    }

    static writeJson(filePath, data) {
        this.ensureDir(path.dirname(filePath));
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }

    static deleteFile(filePath) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    static listFiles(dirPath) {
        if (!fs.existsSync(dirPath)) return [];
        return fs.readdirSync(dirPath, { withFileTypes: true })
            .filter((entry) => entry.isFile())
            .map((entry) => entry.name);
    }
}

module.exports = FileUtils;
