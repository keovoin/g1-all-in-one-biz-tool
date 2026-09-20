/**
 * Helper function to check if a feature is enabled
 *
 * @param featureKey - The feature key to check
 * @param defaultEnable - Default value to return if the feature is not enabled
 * @returns
 */
export declare const isFeatureEnabled: (featureKey: string) => boolean;
/**
 * Reads a boolean-ish environment flag from the first of `keys` that carries a non-empty value.
 *
 * Opt-in by design: anything other than an explicit affirmative (`true`/`1`/`yes`/`on`, in any
 * case, surrounded by any whitespace) resolves to `false`. Used for flags whose "on" position
 * weakens a security control, so an unset, misspelled or garbage value stays on the safe side.
 *
 * @param keys - Environment variable names to consult, in order of precedence.
 * @returns True only when one of them is explicitly set to an affirmative value.
 */
export declare const isEnvFlagEnabled: (...keys: string[]) => boolean;
/**
 * Parses a non-negative integer environment variable.
 *
 * Unlike the `parseInt(...) || fallback` idiom used elsewhere in this file, an explicit `0` is
 * preserved instead of collapsing to the fallback — some of these settings use `0` to mean
 * "disabled", and silently re-enabling them would be the wrong default.
 *
 * The WHOLE trimmed value must be decimal digits. `Number.parseInt` alone accepts a numeric prefix,
 * so a typo such as `AUTH_MAX_FAILED_ATTEMPTS=0oops` would have parsed as `0` and silently switched
 * the brute-force counter off; anything malformed now takes the fallback instead.
 *
 * @param value - The raw environment value.
 * @param fallback - Value used when `value` is unset, malformed, or not a safe non-negative integer.
 * @returns The parsed value, or `fallback`.
 */
export declare const parseNonNegativeInt: (value: string | undefined, fallback: number) => number;
