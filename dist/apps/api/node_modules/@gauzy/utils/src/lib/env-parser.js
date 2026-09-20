"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnvWithFallback = parseEnvWithFallback;
function parseEnvWithFallback(value, fallback) {
    // If value is undefined or empty, return fallback
    if (value === undefined || value === '') {
        return fallback;
    }
    // Boolean parsing
    if (typeof fallback === 'boolean') {
        const lower = value.trim().toLowerCase();
        if (lower === 'true')
            return true;
        if (lower === 'false')
            return false;
        return fallback;
    }
    // Number parsing
    if (typeof fallback === 'number') {
        const trimmed = value.trim();
        if (trimmed === '')
            return fallback;
        const parsed = Number(trimmed);
        return Number.isNaN(parsed) ? fallback : parsed;
    }
    // String or other types - return value as-is
    return value;
}
//# sourceMappingURL=env-parser.js.map