import { IIntegrationMap, IIntegrationTenant, IntegrationEntity } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class IntegrationMap extends TenantOrganizationBaseEntity implements IIntegrationMap {
    entity: IntegrationEntity;
    sourceId: string;
    gauzyId: string;
    integration: IIntegrationTenant;
    integrationId: IIntegrationTenant['id'];
}
