import { ID, IIntegrationTenant } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class ZapierWebhookSubscription extends TenantOrganizationBaseEntity {
    targetUrl: string;
    event: string;
    /**
     * Integration Tenant
     */
    integration?: IIntegrationTenant;
    /**
     * Integration Tenant ID
     */
    integrationId: ID;
}
