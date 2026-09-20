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
export declare function generateAlphaNumericCode(length?: number): string;
