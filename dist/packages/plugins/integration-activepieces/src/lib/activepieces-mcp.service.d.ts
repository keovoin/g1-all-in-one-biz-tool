import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@gauzy/config';
import { IntegrationTenantService } from '@gauzy/core';
import { IActivepiecesMcpServer, IActivepiecesMcpServersListResponse, IActivepiecesMcpServersListParams } from '@gauzy/contracts';
import { ActivepiecesMcpUpdateDto } from './dto';
export declare class ActivepiecesMcpService {
    private readonly httpService;
    private readonly configService;
    private readonly integrationTenantService;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService, integrationTenantService: IntegrationTenantService);
    /**
     * List MCP servers for a project
     */
    listMcpServers(params: IActivepiecesMcpServersListParams): Promise<IActivepiecesMcpServersListResponse>;
    /**
     * Get MCP server by ID
     */
    getMcpServer(serverId: string): Promise<IActivepiecesMcpServer>;
    /**
     * Update MCP server
     */
    updateMcpServer(serverId: string, updateData: ActivepiecesMcpUpdateDto): Promise<IActivepiecesMcpServer>;
    /**
     * Rotate MCP server token
     */
    rotateMcpServerToken(serverId: string): Promise<IActivepiecesMcpServer>;
    /**
     * Get MCP servers for current tenant
     */
    getTenantMcpServers(projectId: string): Promise<IActivepiecesMcpServer[]>;
    /**
     * Helper method for making HTTP requests with standard headers and error handling
     */
    private request;
    /**
     * Get API key for Activepieces API calls.
     * Looks for a tenant-specific API key in the database first, then falls back to global config.
     */
    private getApiKey;
}
