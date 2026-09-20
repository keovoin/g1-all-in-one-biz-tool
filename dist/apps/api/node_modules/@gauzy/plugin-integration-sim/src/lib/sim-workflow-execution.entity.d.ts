import { ID, IIntegrationTenant } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class SimWorkflowExecution extends TenantOrganizationBaseEntity {
    workflowId: string;
    executionId?: string;
    status: string;
    input?: any;
    output?: any;
    error?: any;
    duration?: number;
    triggeredBy?: string;
    /**
     * Integration Tenant
     */
    integration?: IIntegrationTenant;
    /**
     * Integration Tenant ID
     */
    integrationId: ID;
}
