export declare const sensitiveSecretKeys: string[];
/**
 * Setting names whose `settingsValue` is NOT a secret and may be returned to API clients in
 * cleartext. The masking policy is default-deny: every `settingsValue` is masked EXCEPT for the
 * names in this allowlist. This closes the gap where OAuth access/refresh tokens and client secrets
 * (access_token, refresh_token, client_secret, accessToken, consumerSecret, ...) were serialized
 * verbatim because they were not in the old hard-coded sensitive list (GHSA-3rqg-gpm9-gx84).
 */
export declare const nonSecretSettingKeys: string[];
/**
 * Wrap specified keys in an object with a specific character.
 *
 * @param keysToWrap - An array of keys to be wrapped.
 * @param secrets - The object containing the sensitive data.
 * @param _percentage - Ignored. Masking is total; kept only to preserve the positional signature
 *                      for existing callers (see {@link maskSecret}).
 * @param character - The character used for replacement.
 * @returns The object with specified keys wrapped.
 */
export declare function keysToWrapSecrets(keysToWrap: string[], secrets: Record<string, any>, _percentage?: number, character?: string): Record<string, any>;
