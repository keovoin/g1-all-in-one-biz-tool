"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEncryptionKey = generateEncryptionKey;
const crypto_1 = require("crypto");
/**
 * Generates a secure 32-byte encryption key encoded in Base64.
 *
 * @returns {string} A Base64-encoded encryption key.
 *
 * @example
 * const encryptionKey = generateEncryptionKey();
 * console.log(encryptionKey); // Outputs a 32-byte Base64-encoded string
 */
function generateEncryptionKey(length = 32) {
    return (0, crypto_1.randomBytes)(length).toString('base64');
}
//# sourceMappingURL=generate-encryption-key.js.map