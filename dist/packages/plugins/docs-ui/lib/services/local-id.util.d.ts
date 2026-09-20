/**
 * Client-side identifier generation for the Documents UI.
 *
 * SECURITY NOTE (rule `typescript:S2245`): the ids built here are local bookkeeping keys
 * only — an in-flight upload's tracking handle and a saved-view key in `localStorage`.
 * They are never a secret, a token, or part of any access decision: every server-side
 * object is addressed by its own server-issued id and authorized server-side, so nothing
 * follows from predicting one of these. They were nonetheless moved off `Math.random()`,
 * which is seeded per realm and can repeat across tabs restored from the same session.
 *
 * Mirrors the approach already used by `ui-core`'s `createId()` (dashboard layouts):
 * Web Crypto where it exists, with a time-plus-counter fallback for the jsdom/unit-test
 * and insecure-context environments that offer none.
 */
/**
 * A lowercase hex token of exactly `length` characters.
 *
 * Hex rather than base36 so the bytes map onto characters without modulo bias.
 *
 * @param length How many characters the token should have.
 * @returns The token.
 */
export declare function randomIdToken(length: number): string;
