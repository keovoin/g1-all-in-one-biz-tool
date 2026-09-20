"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizerUtil = void 0;
class SanitizerUtil {
    static sanitizeHeaders(headers) {
        const sanitized = { ...headers };
        for (const header of this.sensitiveHeaders) {
            const headerLower = header.toLowerCase();
            for (const key in sanitized) {
                if (key.toLowerCase() === headerLower) {
                    sanitized[key] = '[REDACTED]';
                }
            }
        }
        return sanitized;
    }
    static sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object')
            return obj;
        if (Array.isArray(obj))
            return obj.map((item) => this.sanitizeObject(item));
        const result = { ...obj };
        for (const key in result) {
            if (this.sensitiveFields.includes(key.toLowerCase())) {
                result[key] = '[REDACTED]';
            }
            else if (typeof result[key] === 'object') {
                result[key] = this.sanitizeObject(result[key]);
            }
        }
        return result;
    }
}
exports.SanitizerUtil = SanitizerUtil;
SanitizerUtil.sensitiveFields = ['password', 'token', 'secret', 'credit_card', 'ssn'];
SanitizerUtil.sensitiveHeaders = ['authorization', 'cookie', 'api-key'];
//# sourceMappingURL=sanitizer.util.js.map