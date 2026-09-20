"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonSecretSettingKeys = exports.sensitiveSecretKeys = void 0;
exports.keysToWrapSecrets = keysToWrapSecrets;
const utils_1 = require("@gauzy/utils");
const is_secret_1 = require("../core/decorators/is-secret");
// Assuming you have fetched sensitive keys specific entity
exports.sensitiveSecretKeys = ['apiKey', 'apiSecret', 'openAiSecretKey', 'openAiOrganizationId'];
/**
 * Setting names whose `settingsValue` is NOT a secret and may be returned to API clients in
 * cleartext. The masking policy is default-deny: every `settingsValue` is masked EXCEPT for the
 * names in this allowlist. This closes the gap where OAuth access/refresh tokens and client secrets
 * (access_token, refresh_token, client_secret, accessToken, consumerSecret, ...) were serialized
 * verbatim because they were not in the old hard-coded sensitive list (GHSA-3rqg-gpm9-gx84).
 */
exports.nonSecretSettingKeys = [
    'isEnabled',
    // the same on/off flag under the spellings individual integrations persist it as
    'is_enabled',
    'IS_ENABLED',
    'make_webhook_enabled',
    'sync',
    'autoSync',
    'syncTag',
    'sync_tag',
    'zone',
    'region',
    'setup_action',
    'installation_id',
    'organizationId',
    'tenantId'
];
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
function keysToWrapSecrets(keysToWrap, secrets, _percentage = 35, character = '*') {
    // Checks if a value is an object
    if ((0, utils_1.isObject)(secrets) && Array.isArray(keysToWrap)) {
        // Checks if a value is not empty
        for (const key of keysToWrap) {
            if ((0, utils_1.isNotEmpty)(secrets[key])) {
                secrets[key] = (0, is_secret_1.maskSecret)(secrets[key], character);
            }
        }
    }
    return secrets;
}
//# sourceMappingURL=integration-setting.utils.js.map