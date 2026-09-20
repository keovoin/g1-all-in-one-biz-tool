import { ITenant } from '@gauzy/contracts';
import { TenantBaseEntity } from '../../core/entities/internal';
export declare class TenantSetting extends TenantBaseEntity implements ITenant {
    name?: string;
    /**
     * 🛑 Holds the tenant's object-storage secret access keys (AWS/Wasabi/DigitalOcean), the
     * Cloudinary API secret and the monitoring keys and Sentry DSN. `TenantSettingGetHandler` masks
     * them with
     * `WrapSecrets` on the JSON path; the CSV export never reaches that handler
     * (GHSA-j5h5-r956-rxc3). Default-deny, see {@link isSecretTenantSettingName}.
     */
    value?: string;
}
