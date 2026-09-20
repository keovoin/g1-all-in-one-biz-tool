"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAlphaNumericCode = generateAlphaNumericCode;
const node_crypto_1 = require("node:crypto");
const constants_1 = require("@gauzy/constants");
/**
 * Generates a cryptographically secure random alphanumeric code.
 *
 * Uses `crypto.randomInt()` (a cryptographically secure PRNG) instead of `Math.random()` to prevent
 * predictability attacks on security-sensitive codes (e.g., magic login codes,
 * invite codes, verification codes).
 *
 * @param length - The length of the code. Default is `ALPHA_NUMERIC_CODE_LENGTH` (8).
 * @returns A randomly generated alphanumeric code.
 */
function generateAlphaNumericCode(length = constants_1.ALPHA_NUMERIC_CODE_LENGTH) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const index = (0, node_crypto_1.randomInt)(characters.length);
        code += characters[index];
    }
    return code;
}
//# sourceMappingURL=code-generator.js.map