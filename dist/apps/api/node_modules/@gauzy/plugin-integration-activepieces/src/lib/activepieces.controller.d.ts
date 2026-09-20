import { ActivepiecesService } from './activepieces.service';
import { CreateActivepiecesIntegrationDto, SetupActivepiecesIntegrationDto, ActivepiecesConnectionsListQueryDto } from './dto';
import { IActivepiecesConnection, IActivepiecesConnectionsListResponse } from '@gauzy/contracts';
export declare class ActivepiecesController {
    private readonly activepiecesService;
    private readonly logger;
    constructor(activepiecesService: ActivepiecesService);
    /**
     * Set up ActivePieces integration with API key
     */
    setupIntegration(input: SetupActivepiecesIntegrationDto): Promise<{
        integrationTenantId: string;
    }>;
    /**
     * Create or update ActivePieces connection (upsert)
     */
    upsertConnection(input: CreateActivepiecesIntegrationDto): Promise<IActivepiecesConnection>;
    /**
     * List connections for a project
     */
    listConnections(integrationId: string, params: ActivepiecesConnectionsListQueryDto): Promise<IActivepiecesConnectionsListResponse>;
    /**
     * Get tenant connections
     */
    getTenantConnections(integrationId: string, projectId: string): Promise<IActivepiecesConnection[]>;
    /**
     * Get ActivePieces connection details
     */
    getConnection(integrationId: string): Promise<IActivepiecesConnection | null>;
    /**
     * Delete ActivePieces connection
     */
    deleteConnection(integrationId: string): Promise<void>;
    /**
     * Check if ActivePieces integration is enabled
     */
    getIntegrationStatus(integrationId: string): Promise<{
        enabled: boolean;
    }>;
    /**
     * Get integration tenant information
     */
    getIntegrationTenant(integrationId: string): Promise<any>;
}
