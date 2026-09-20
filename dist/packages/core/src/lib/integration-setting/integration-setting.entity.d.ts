import { IIntegrationSetting } from '@gauzy/contracts';
import { IntegrationTenant, TenantOrganizationBaseEntity } from './../core/entities/internal';
export declare class IntegrationSetting extends TenantOrganizationBaseEntity implements IIntegrationSetting {
    settingsName: string;
    /**
     * 🛑 Every integration plugin writes its credentials into this one column — Hubstaff/Upwork/
     * GitHub/Zapier/Make.com OAuth access and refresh tokens, Activepieces and Plane API keys,
     * client secrets. `@Exclude` hides it on the JSON path only; the CSV export reads the property
     * directly, which is how those tokens left the system in cleartext (GHSA-j5h5-r956-rxc3).
     *
     * The predicate is exactly the default-deny policy `IntegrationSettingSubscriber` already
     * applies to the JSON path, so the two cannot drift: a value is a secret unless its
     * `settingsName` is on the explicit non-secret allowlist.
     */
    settingsValue: string;
    /**
     * IntegrationTenant
     */
    integration?: IntegrationTenant;
    integrationId?: IntegrationTenant['id'];
    /**
     * Additional fields to expose secret fields
     */
    wrapSecretKey?: string;
    wrapSecretValue?: string;
}
