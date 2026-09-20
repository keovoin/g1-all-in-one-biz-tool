"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUtilsVersion = void 0;
/**
 * Retrieves the version from package.json.
 * @returns {string | undefined} The version if available, otherwise undefined.
 */
const getUtilsVersion = () => {
    try {
        return require('../../package.json').version;
    }
    catch (error) {
        console.error(`Error retrieving version from package.json:`, error);
        return undefined;
    }
};
exports.getUtilsVersion = getUtilsVersion;
//# sourceMappingURL=version.js.map