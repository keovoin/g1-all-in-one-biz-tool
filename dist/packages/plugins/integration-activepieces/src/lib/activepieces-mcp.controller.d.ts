import { ListMcpServersDto, ActivepiecesMcpUpdateDto } from './dto';
import { ActivepiecesMcpService } from './activepieces-mcp.service';
import { IActivepiecesMcpServerPublic, IActivepiecesMcpServersListResponsePublic } from '@gauzy/contracts';
export declare class ActivepiecesMcpController {
    private readonly activepiecesMcpService;
    private readonly logger;
    constructor(activepiecesMcpService: ActivepiecesMcpService);
    /**
     * Remove sensitive token field from MCP server object
     */
    private sanitizeMcpServer;
    /**
     * Validate and trim ID parameter
     */
    private validateAndTrimId;
    /**
     * Handle errors consistently across all controller methods
     */
    private handleError;
    /**
     * List MCP servers for a project
     */
    listMcpServers(query: ListMcpServersDto): Promise<IActivepiecesMcpServersListResponsePublic>;
    /**
     * Get MCP servers for current tenant
     */
    getTenantMcpServers({ projectId }: ListMcpServersDto): Promise<IActivepiecesMcpServerPublic[]>;
    /**
     * Get MCP server by ID
     */
    getMcpServer(serverId: string): Promise<IActivepiecesMcpServerPublic>;
    /**
     * Update MCP server
     */
    updateMcpServer(serverId: string, updateData: ActivepiecesMcpUpdateDto): Promise<IActivepiecesMcpServerPublic>;
    /**
     * Rotate MCP server token
     */
    rotateMcpServerToken(serverId: string): Promise<IActivepiecesMcpServerPublic>;
}
