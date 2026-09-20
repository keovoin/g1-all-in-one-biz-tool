"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureHttpPrefix = void 0;
/**
 * Ensures the URL has either "http://" or "https://" prefix.
 *
 * @param url - The URL to check and add the prefix if missing.
 * @param prefix - The protocol to add ("http" or "https"). Defaults to "https".
 * @returns The URL with the specified protocol prefix.
 *
 * @example
 * ```typescript
 * ensureHttpPrefix("example.com"); // Output: "https://example.com"
 * ensureHttpPrefix("example.com", "http"); // Output: "http://example.com"
 * ensureHttpPrefix("https://example.com"); // Output: "https://example.com"
 * ```
 */
const ensureHttpPrefix = (url, prefix = 'https') => {
    if (!url)
        return url;
    return url.startsWith('http://') || url.startsWith('https://') ? url : `${prefix}://${url}`;
};
exports.ensureHttpPrefix = ensureHttpPrefix;
//# sourceMappingURL=ensure-http-prefix.js.map