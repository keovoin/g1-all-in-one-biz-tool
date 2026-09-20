import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@gauzy/config';
import { IntegrationService, IntegrationTenantService } from '@gauzy/core';
import { IActivepiecesConnection, IActivepiecesConnectionsListResponse, IActivepiecesConnectionsListParams, ICreateActivepiecesIntegrationInput } from '@gauzy/contracts';
export declare class ActivepiecesService {
    private readonly httpService;
    private readonly configService;
    private readonly integrationService;
    private readonly integrationTenantService;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService, integrationService: IntegrationService, integrationTenantService: IntegrationTenantService);
    /**
     * Set up the ActivePieces integration by saving the API key.
     * Finds or creates the ACTIVE_PIECES integration record and creates an integration tenant
     * with API_KEY and IS_ENABLED settings.
     */
    setupIntegration(apiKey: string, organizationId?: string): Promise<{
        integrationTenantId: string;
    }>;
    /**
     * Create or update ActivePieces connection for the tenant (using upsert endpoint)
     */
    upsertConnection(input: ICreateActivepiecesIntegrationInput): Promise<IActivepiecesConnection>;
    /**
     * List ActivePieces connections for a project
     */
    listConnections(params: IActivepiecesConnectionsListParams, integrationId?: string): Promise<IActivepiecesConnectionsListResponse>;
    /**
     * Get connections for current tenant
     */
    getTenantConnections(projectId: string, integrationId: string): Promise<IActivepiecesConnection[]>;
    /**
     * Get ActivePieces connection by integration tenant ID
     */
    getConnection(integrationTenantId: string): Promise<IActivepiecesConnection | null>;
    /**
     * Delete ActivePieces connection
     */
    deleteConnection(integrationTenantId: string): Promise<boolean>;
    /**
     * Get API key for Activepieces API calls.
     * Looks for a tenant-specific API key in the database first, then falls back to global config.
     * @param integrationTenantId - The integration tenant ID (not the base integration ID)
     */
    getApiKey(integrationTenantId?: string): Promise<string>;
    /**
     * Get project IDs for an integration tenant
     */
    getProjectIds(integrationTenantId: string): Promise<string[]>;
    /**
     * Check if ActivePieces integration is enabled
     */
    isIntegrationEnabled(integrationTenantId: string): Promise<boolean>;
    /**
     * Get integration tenant information
     */
    getIntegrationTenant(integrationId: string): Promise<any>;
    /**
     * Save connection settings to the database
     */
    private saveConnectionSettings;
}
