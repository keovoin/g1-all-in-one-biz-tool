import { ITenantUiPreferencesUpdateInput, PreferredUiEnum } from '@gauzy/contracts';
/**
 * Tenant-wide UI preferences — the validation DTO of `PUT /tenant-ui-preferences`.
 *
 * The values are plain (non-secret) tenant settings, so they need no `WrapSecrets` entry in
 * `TenantSettingGetHandler`; they surface in `GET /tenant-setting` like any other row.
 */
export declare class UiPreferencesConfigDTO implements ITenantUiPreferencesUpdateInput {
    readonly preferredUi?: PreferredUiEnum;
}
