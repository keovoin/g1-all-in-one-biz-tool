/**
 * Setting names whose `value` is NOT a credential and may leave the system in cleartext.
 *
 * `tenant_setting` is a free-form key/value table: buckets, regions and endpoint URLs sit in it
 * next to AWS/Wasabi/DigitalOcean secret access keys, the Cloudinary API secret, the PostHog key,
 * the Sentry DSN and the Jitsu write key. There is no way to tell them apart from the value, so the
 * policy is **default-deny** — the same one `nonSecretSettingKeys` applies to `integration_setting`
 * (GHSA-3rqg-gpm9-gx84). A name nobody has classified (a future plugin's setting, say) is treated
 * as a secret, because the cost of over-masking a bucket name in an export archive is nothing and
 * the cost of guessing wrong the other way is a live credential in a downloadable file.
 */
export declare const nonSecretTenantSettingNames: string[];
/**
 * Whether a `tenant_setting` row holds a credential.
 *
 * Two sources agree here so the export path and `TenantSettingGetHandler` cannot drift apart in the
 * dangerous direction: a name carrying `@IsSecret()` on one of the provider DTOs is always a
 * secret, and any name that is not on {@link nonSecretTenantSettingNames} is treated as one too.
 *
 * @param name - The `tenant_setting.name` of the row.
 * @returns `true` when the row's value must never be exported in cleartext.
 */
export declare function isSecretTenantSettingName(name: unknown): boolean;
/**
 * Whether a setting name carries `@IsSecret()` on one of the provider-configuration DTOs.
 *
 * This is the half of {@link isSecretTenantSettingName} that does not depend on the hand-maintained
 * allowlist: it keeps a DTO-declared secret masked even if somebody wrongly adds its name to
 * {@link nonSecretTenantSettingNames}. `@IsSecret()` stores its flag on the DTO prototype, which
 * `Reflect.getMetadata` reaches from an instance by walking the prototype chain.
 *
 * @param name - The `tenant_setting.name` of the row.
 * @returns `true` when a provider DTO declares the setting secret.
 */
export declare function isIsSecretMarkedTenantSettingName(name: string): boolean;
