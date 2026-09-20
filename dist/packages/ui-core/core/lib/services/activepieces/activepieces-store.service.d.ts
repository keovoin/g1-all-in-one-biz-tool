import { Observable } from 'rxjs';
import { ID, IActivepiecesConnection, IActivepiecesMcpServerPublic } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ActivepiecesStoreService {
    private _selectedIntegrationId$;
    selectedIntegrationId$: Observable<string>;
    private _connections$;
    connections$: Observable<IActivepiecesConnection[]>;
    private _currentConnection$;
    currentConnection$: Observable<IActivepiecesConnection>;
    private _mcpServers$;
    mcpServers$: Observable<IActivepiecesMcpServerPublic[]>;
    private _currentMcpServer$;
    currentMcpServer$: Observable<IActivepiecesMcpServerPublic>;
    private _isLoading$;
    isLoading$: Observable<boolean>;
    private _isMcpLoading$;
    isMcpLoading$: Observable<boolean>;
    private _error$;
    error$: Observable<string>;
    private _mcpError$;
    mcpError$: Observable<string>;
    private _projectId$;
    projectId$: Observable<string>;
    private _isEnabled$;
    isEnabled$: Observable<boolean>;
    /**
     * Set the selected integration ID
     */
    setSelectedIntegrationId(integrationId: ID): void;
    /**
     * Get the selected integration ID
     */
    getSelectedIntegrationId(): string;
    /**
     * Set connections list
     */
    setConnections(connections: IActivepiecesConnection[]): void;
    /**
     * Get connections
     */
    getConnections(): IActivepiecesConnection[];
    /**
     * Set current connection
     */
    setCurrentConnection(connection: IActivepiecesConnection): void;
    /**
     * Get current connection
     */
    getCurrentConnection(): IActivepiecesConnection;
    /**
     * Add a connection to the list
     */
    addConnection(connection: IActivepiecesConnection): void;
    /**
     * Update a connection in the list
     */
    updateConnection(connection: IActivepiecesConnection): void;
    /**
     * Remove a connection from the list
     */
    removeConnection(connectionId: string): void;
    /**
     * Set MCP servers list
     */
    setMcpServers(servers: IActivepiecesMcpServerPublic[]): void;
    /**
     * Get MCP servers
     */
    getMcpServers(): IActivepiecesMcpServerPublic[];
    /**
     * Set current MCP server
     */
    setCurrentMcpServer(server: IActivepiecesMcpServerPublic): void;
    /**
     * Get current MCP server
     */
    getCurrentMcpServer(): IActivepiecesMcpServerPublic;
    /**
     * Add an MCP server to the list
     */
    addMcpServer(server: IActivepiecesMcpServerPublic): void;
    /**
     * Update an MCP server in the list
     */
    updateMcpServer(server: IActivepiecesMcpServerPublic): void;
    /**
     * Remove an MCP server from the list
     */
    removeMcpServer(serverId: string): void;
    /**
     * Set loading state
     */
    setLoading(loading: boolean): void;
    /**
     * Get loading state
     */
    getLoading(): boolean;
    /**
     * Set MCP loading state
     */
    setMcpLoading(loading: boolean): void;
    /**
     * Get MCP loading state
     */
    getMcpLoading(): boolean;
    /**
     * Set error state
     */
    setError(error: string): void;
    /**
     * Get error state
     */
    getError(): string;
    /**
     * Clear error state
     */
    clearError(): void;
    /**
     * Set MCP error state
     */
    setMcpError(error: string): void;
    /**
     * Get MCP error state
     */
    getMcpError(): string;
    /**
     * Clear MCP error state
     */
    clearMcpError(): void;
    /**
     * Set project ID
     */
    setProjectId(projectId: string): void;
    /**
     * Get project ID
     */
    getProjectId(): string;
    /**
     * Set integration enabled status
     */
    setEnabled(enabled: boolean): void;
    /**
     * Get integration enabled status
     */
    getEnabled(): boolean;
    /**
     * Clear all connections
     */
    clearConnections(): void;
    /**
     * Clear all MCP servers
     */
    clearMcpServers(): void;
    /**
     * Reset store state
     */
    reset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActivepiecesStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ActivepiecesStoreService>;
}
