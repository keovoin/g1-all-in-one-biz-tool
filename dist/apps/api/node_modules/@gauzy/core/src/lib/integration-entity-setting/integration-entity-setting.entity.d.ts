import { IIntegrationEntitySetting, IIntegrationEntitySettingTied, IIntegrationTenant, IntegrationEntity } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class IntegrationEntitySetting extends TenantOrganizationBaseEntity implements IIntegrationEntitySetting {
    entity: IntegrationEntity;
    sync: boolean;
    /**
     * IntegrationTenant
     */
    integration?: IIntegrationTenant;
    integrationId?: IIntegrationTenant['id'];
    /**
     * IntegrationEntitySettingTied
     */
    tiedEntities?: IIntegrationEntitySettingTied[];
}
