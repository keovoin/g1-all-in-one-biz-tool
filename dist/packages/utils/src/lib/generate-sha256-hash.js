"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSha256Hash = generateSha256Hash;
const crypto_1 = require("crypto");
/**
 * Generate a SHA256 hash of the input string.
 *
 * @param data - The input string to hash.
 * @returns The SHA256 hash of the input string as a hexadecimal string.
 */
function generateSha256Hash(data) {
    return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
}
// Example usage (for testing purposes, can be removed in production)
// const secretKey = 'my-secret-key';
// console.log('SHA256 Hash:', generateSha256Hash(secretKey));
//# sourceMappingURL=generate-sha256-hash.js.map