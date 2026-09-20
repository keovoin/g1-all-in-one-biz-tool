import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { IActivepiecesConnection, ICreateActivepiecesIntegrationInput, IActivepiecesConnectionsListResponse, IActivepiecesConnectionsListParams, IActivepiecesMcpServerPublic, IActivepiecesMcpServersListResponsePublic, IActivepiecesMcpServersListParams, IActivepiecesMcpServerUpdateRequest, ID, IIntegrationTenant } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ActivepiecesService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Set up ActivePieces integration with an API key
     */
    setup(apiKey: string, organizationId?: string): Observable<{
        integrationTenantId: string;
    }>;
    /**
     * Create or update ActivePieces connection (upsert)
     */
    upsertConnection(input: ICreateActivepiecesIntegrationInput): Observable<IActivepiecesConnection>;
    /**
     * Get ActivePieces connection details
     */
    getConnection(integrationId: ID): Observable<IActivepiecesConnection | null>;
    /**
     * List connections for a project
     */
    listConnections(integrationId: ID, params: IActivepiecesConnectionsListParams): Observable<IActivepiecesConnectionsListResponse>;
    /**
     * Get tenant connections
     */
    getTenantConnections(integrationId: ID, projectId: string): Observable<IActivepiecesConnection[]>;
    /**
     * Delete ActivePieces connection
     */
    deleteConnection(integrationId: ID): Observable<void>;
    /**
     * Check if ActivePieces integration is enabled
     */
    getIntegrationStatus(integrationId: ID): Observable<{
        enabled: boolean;
    }>;
    /**
     * Get integration tenant information
     */
    getIntegrationTenant(integrationId: ID): Observable<IIntegrationTenant>;
    /**
     * List MCP servers for a project
     */
    listMcpServers(integrationId: ID, params: IActivepiecesMcpServersListParams): Observable<IActivepiecesMcpServersListResponsePublic>;
    /**
     * Get MCP server details
     */
    getMcpServer(integrationId: ID, serverId: string): Observable<IActivepiecesMcpServerPublic>;
    /**
     * Create MCP server
     */
    createMcpServer(integrationId: ID, data: {
        name: string;
        agentId: string;
    }): Observable<IActivepiecesMcpServerPublic>;
    /**
     * Update MCP server
     */
    updateMcpServer(integrationId: ID, serverId: string, data: IActivepiecesMcpServerUpdateRequest): Observable<IActivepiecesMcpServerPublic>;
    /**
     * Delete MCP server
     */
    deleteMcpServer(integrationId: ID, serverId: string): Observable<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActivepiecesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ActivepiecesService>;
}
