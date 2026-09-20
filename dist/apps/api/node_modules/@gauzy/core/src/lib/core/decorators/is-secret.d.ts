/**
 * Checks if value is needs to be wrap with specific character.
 *
 * @param boolean
 * @returns
 */
export declare function IsSecret(boolean?: boolean): PropertyDecorator;
/**
 * Masks a secret value, leaving at most a short trailing hint visible.
 *
 * The previous implementation starred a percentage of the value from each end and left everything
 * between them in cleartext — at 25% that returned roughly half of a 40-character OAuth token
 * verbatim. It also used non-global `String.replace`, so a suffix that occurred earlier in the value
 * was masked instead of the real tail. Both are fixed here by masking the whole value up front
 * (GHSA-3rqg-gpm9-gx84).
 *
 * @param value - The sensitive value to mask.
 * @param character - The character used for replacement.
 * @returns The masked value: fully masked, or all but the last few characters when long enough.
 */
export declare function maskSecret(value: unknown, character?: string): string;
/**
 * Wrap specified keys in an object with a specific character based on metadata.
 *
 * @param secrets - The object containing the sensitive data.
 * @param targets - The target class or classes with metadata.
 * @param _percentage - Ignored. Masking is total; kept only to preserve the positional signature
 *                      for existing callers (see {@link maskSecret}).
 * @param character - The character used for replacement.
 * @returns The object with specified keys wrapped.
 */
export declare function WrapSecrets(secrets: Record<string, any>, targets: any | any[], _percentage?: number, character?: string): Record<string, any>;
