import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class ActivepiecesStoreService {
    constructor() {
        // Selected integration ID
        this._selectedIntegrationId$ = new BehaviorSubject(null);
        this.selectedIntegrationId$ = this._selectedIntegrationId$.asObservable();
        // Connections state
        this._connections$ = new BehaviorSubject([]);
        this.connections$ = this._connections$.asObservable();
        // Current connection (single)
        this._currentConnection$ = new BehaviorSubject(null);
        this.currentConnection$ = this._currentConnection$.asObservable();
        // MCP Servers state
        this._mcpServers$ = new BehaviorSubject([]);
        this.mcpServers$ = this._mcpServers$.asObservable();
        // Current MCP Server (single)
        this._currentMcpServer$ = new BehaviorSubject(null);
        this.currentMcpServer$ = this._currentMcpServer$.asObservable();
        // Loading states
        this._isLoading$ = new BehaviorSubject(false);
        this.isLoading$ = this._isLoading$.asObservable();
        this._isMcpLoading$ = new BehaviorSubject(false);
        this.isMcpLoading$ = this._isMcpLoading$.asObservable();
        // Error states
        this._error$ = new BehaviorSubject(null);
        this.error$ = this._error$.asObservable();
        this._mcpError$ = new BehaviorSubject(null);
        this.mcpError$ = this._mcpError$.asObservable();
        // Project ID
        this._projectId$ = new BehaviorSubject(null);
        this.projectId$ = this._projectId$.asObservable();
        // Integration status
        this._isEnabled$ = new BehaviorSubject(false);
        this.isEnabled$ = this._isEnabled$.asObservable();
    }
    /**
     * Set the selected integration ID
     */
    setSelectedIntegrationId(integrationId) {
        this._selectedIntegrationId$.next(integrationId);
    }
    /**
     * Get the selected integration ID
     */
    getSelectedIntegrationId() {
        return this._selectedIntegrationId$.getValue();
    }
    /**
     * Set connections list
     */
    setConnections(connections) {
        this._connections$.next(connections);
    }
    /**
     * Get connections
     */
    getConnections() {
        return this._connections$.getValue();
    }
    /**
     * Set current connection
     */
    setCurrentConnection(connection) {
        this._currentConnection$.next(connection);
    }
    /**
     * Get current connection
     */
    getCurrentConnection() {
        return this._currentConnection$.getValue();
    }
    /**
     * Add a connection to the list
     */
    addConnection(connection) {
        const currentConnections = this._connections$.getValue();
        this._connections$.next([...currentConnections, connection]);
    }
    /**
     * Update a connection in the list
     */
    updateConnection(connection) {
        const currentConnections = this._connections$.getValue();
        const updatedConnections = currentConnections.map((c) => (c.id === connection.id ? connection : c));
        this._connections$.next(updatedConnections);
    }
    /**
     * Remove a connection from the list
     */
    removeConnection(connectionId) {
        const currentConnections = this._connections$.getValue();
        this._connections$.next(currentConnections.filter((c) => c.id !== connectionId));
    }
    /**
     * Set MCP servers list
     */
    setMcpServers(servers) {
        this._mcpServers$.next(servers);
    }
    /**
     * Get MCP servers
     */
    getMcpServers() {
        return this._mcpServers$.getValue();
    }
    /**
     * Set current MCP server
     */
    setCurrentMcpServer(server) {
        this._currentMcpServer$.next(server);
    }
    /**
     * Get current MCP server
     */
    getCurrentMcpServer() {
        return this._currentMcpServer$.getValue();
    }
    /**
     * Add an MCP server to the list
     */
    addMcpServer(server) {
        const currentServers = this._mcpServers$.getValue();
        this._mcpServers$.next([...currentServers, server]);
    }
    /**
     * Update an MCP server in the list
     */
    updateMcpServer(server) {
        const currentServers = this._mcpServers$.getValue();
        const updatedServers = currentServers.map((s) => (s.id === server.id ? server : s));
        this._mcpServers$.next(updatedServers);
    }
    /**
     * Remove an MCP server from the list
     */
    removeMcpServer(serverId) {
        const currentServers = this._mcpServers$.getValue();
        this._mcpServers$.next(currentServers.filter((s) => s.id !== serverId));
    }
    /**
     * Set loading state
     */
    setLoading(loading) {
        this._isLoading$.next(loading);
    }
    /**
     * Get loading state
     */
    getLoading() {
        return this._isLoading$.getValue();
    }
    /**
     * Set MCP loading state
     */
    setMcpLoading(loading) {
        this._isMcpLoading$.next(loading);
    }
    /**
     * Get MCP loading state
     */
    getMcpLoading() {
        return this._isMcpLoading$.getValue();
    }
    /**
     * Set error state
     */
    setError(error) {
        this._error$.next(error);
    }
    /**
     * Get error state
     */
    getError() {
        return this._error$.getValue();
    }
    /**
     * Clear error state
     */
    clearError() {
        this._error$.next(null);
    }
    /**
     * Set MCP error state
     */
    setMcpError(error) {
        this._mcpError$.next(error);
    }
    /**
     * Get MCP error state
     */
    getMcpError() {
        return this._mcpError$.getValue();
    }
    /**
     * Clear MCP error state
     */
    clearMcpError() {
        this._mcpError$.next(null);
    }
    /**
     * Set project ID
     */
    setProjectId(projectId) {
        this._projectId$.next(projectId);
    }
    /**
     * Get project ID
     */
    getProjectId() {
        return this._projectId$.getValue();
    }
    /**
     * Set integration enabled status
     */
    setEnabled(enabled) {
        this._isEnabled$.next(enabled);
    }
    /**
     * Get integration enabled status
     */
    getEnabled() {
        return this._isEnabled$.getValue();
    }
    /**
     * Clear all connections
     */
    clearConnections() {
        this._connections$.next([]);
        this._currentConnection$.next(null);
    }
    /**
     * Clear all MCP servers
     */
    clearMcpServers() {
        this._mcpServers$.next([]);
        this._currentMcpServer$.next(null);
    }
    /**
     * Reset store state
     */
    reset() {
        this._selectedIntegrationId$.next(null);
        this._connections$.next([]);
        this._currentConnection$.next(null);
        this._mcpServers$.next([]);
        this._currentMcpServer$.next(null);
        this._isLoading$.next(false);
        this._isMcpLoading$.next(false);
        this._error$.next(null);
        this._mcpError$.next(null);
        this._projectId$.next(null);
        this._isEnabled$.next(false);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivepiecesStoreService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivepiecesStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivepiecesStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=activepieces-store.service.js.map