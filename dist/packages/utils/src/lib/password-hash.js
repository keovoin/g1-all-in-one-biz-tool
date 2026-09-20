"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, keyLength: 64, saltLength: 16 };
async function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(SCRYPT_PARAMS.saltLength);
    const { N, r, p, keyLength } = SCRYPT_PARAMS;
    const derivedKey = await scryptAsync(password, salt, keyLength, { N, r, p });
    return ['$scrypt', N, r, p, salt.toString('hex'), derivedKey.toString('hex')].join('$');
}
async function verifyPassword(password, hashedPassword) {
    try {
        const parts = hashedPassword.split('$');
        if (parts.length !== 7 || parts[1] !== 'scrypt')
            return false;
        const [, , nStr, rStr, pStr, saltHex, hashHex] = parts;
        const N = parseInt(nStr, 10);
        const r = parseInt(rStr, 10);
        const p = parseInt(pStr, 10);
        if (isNaN(N) || isNaN(r) || isNaN(p) || N <= 0 || r <= 0 || p <= 0)
            return false;
        if (N > 1048576 || r > 64 || p > 64)
            return false;
        if ((N & (N - 1)) !== 0)
            return false;
        const salt = Buffer.from(saltHex, 'hex');
        const storedHash = Buffer.from(hashHex, 'hex');
        const derivedKey = await scryptAsync(password, salt, storedHash.length, { N, r, p });
        return (0, crypto_1.timingSafeEqual)(derivedKey, storedHash);
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=password-hash.js.map