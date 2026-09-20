import { CommandBus } from '@nestjs/cqrs';
import { ID, IIntegrationAICreateInput, IIntegrationTenant, IIntegrationTenantUpdateInput } from '@gauzy/contracts';
import { IntegrationService, IntegrationTenantService } from '@gauzy/core';
import { GauzyAIService } from './gauzy-ai.service';
import { RequestConfigProvider } from './request-config.provider';
export declare class IntegrationAIService {
    private readonly _commandBus;
    private readonly _requestConfigProvider;
    private readonly _gauzyAIService;
    private readonly _integrationService;
    private readonly _integrationTenantService;
    private readonly logger;
    constructor(_commandBus: CommandBus, _requestConfigProvider: RequestConfigProvider, _gauzyAIService: GauzyAIService, _integrationService: IntegrationService, _integrationTenantService: IntegrationTenantService);
    /**
     * Creates a new integration tenant for Gauzy AI.
     * @param input - The input data for creating the integration tenant.
     * @returns A promise that resolves to the created integration tenant.
     */
    create(input: IIntegrationAICreateInput): Promise<IIntegrationTenant>;
    /**
     * Updates an integration tenant by ID with the provided input.
     *
     * @param {IIntegrationTenant['id']} integrationId - The ID of the integration tenant to update.
     * @returns {Promise<IIntegrationTenant>} - A promise resolving to the updated integration tenant.
     */
    update(integrationId: ID, input: IIntegrationTenantUpdateInput): Promise<IIntegrationTenant>;
    /**
     * Updates a tenant's API key by configuring the necessary parameters,
     * triggering the update in the Gauzy AI service, and handling any potential errors in a robust manner.
     */
    updateOneTenantApiKey({ apiKey, apiSecret, openAiSecretKey, openAiOrganizationId }: {
        apiKey: any;
        apiSecret: any;
        openAiSecretKey: any;
        openAiOrganizationId: any;
    }): Promise<void>;
}
