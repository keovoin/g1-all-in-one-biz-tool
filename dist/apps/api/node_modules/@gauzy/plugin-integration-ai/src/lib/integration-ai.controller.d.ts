import { ID, IIntegrationAICreateInput, IIntegrationTenant, IIntegrationTenantUpdateInput } from '@gauzy/contracts';
import { IntegrationAIService } from './integration-ai.service';
export declare class IntegrationAIController {
    private readonly _integrationAIService;
    constructor(_integrationAIService: IntegrationAIService);
    /**
     * Create a new Integration AI entity.
     *
     * @param input - The data required to create a new Integration AI entity.
     * @returns A promise that resolves to the created Integration Tenant entity.
     */
    create(input: IIntegrationAICreateInput): Promise<IIntegrationTenant>;
    /**
     * Update Gauzy AI integration by ID.
     *
     * @param id - The ID of the integration to update.
     * @param input - The updated data for the integration.
     * @returns A promise that resolves to the updated Integration Tenant entity.
     */
    update(id: ID, input: IIntegrationTenantUpdateInput): Promise<IIntegrationTenant>;
}
