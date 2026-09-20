import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ActivepiecesService {
    constructor(http) {
        this.http = http;
    }
    /**
     * Set up ActivePieces integration with an API key
     */
    setup(apiKey, organizationId) {
        const body = { apiKey };
        if (organizationId) {
            body.organizationId = organizationId;
        }
        return this.http.post(`${API_PREFIX}/integration/activepieces/setup`, body);
    }
    /**
     * Create or update ActivePieces connection (upsert)
     */
    upsertConnection(input) {
        return this.http.post(`${API_PREFIX}/integration/activepieces/connection`, input);
    }
    /**
     * Get ActivePieces connection details
     */
    getConnection(integrationId) {
        return this.http.get(`${API_PREFIX}/integration/activepieces/connection/${integrationId}`);
    }
    /**
     * List connections for a project
     */
    listConnections(integrationId, params) {
        let httpParams = new HttpParams();
        if (params.projectId)
            httpParams = httpParams.set('projectId', params.projectId);
        if (params.cursor)
            httpParams = httpParams.set('cursor', params.cursor);
        if (params.scope)
            httpParams = httpParams.set('scope', params.scope);
        if (params.pieceName)
            httpParams = httpParams.set('pieceName', params.pieceName);
        if (params.displayName)
            httpParams = httpParams.set('displayName', params.displayName);
        if (params.status)
            httpParams = httpParams.set('status', params.status);
        if (params.limit)
            httpParams = httpParams.set('limit', params.limit.toString());
        return this.http.get(`${API_PREFIX}/integration/activepieces/connections/${integrationId}`, { params: httpParams });
    }
    /**
     * Get tenant connections
     */
    getTenantConnections(integrationId, projectId) {
        return this.http.get(`${API_PREFIX}/integration/activepieces/connections/tenant/${integrationId}/${projectId}`);
    }
    /**
     * Delete ActivePieces connection
     */
    deleteConnection(integrationId) {
        return this.http.delete(`${API_PREFIX}/integration/activepieces/connection/${integrationId}`);
    }
    /**
     * Check if ActivePieces integration is enabled
     */
    getIntegrationStatus(integrationId) {
        return this.http.get(`${API_PREFIX}/integration/activepieces/status/${integrationId}`);
    }
    /**
     * Get integration tenant information
     */
    getIntegrationTenant(integrationId) {
        return this.http.get(`${API_PREFIX}/integration/activepieces/integration-tenant/${integrationId}`);
    }
    /**
     * List MCP servers for a project
     */
    listMcpServers(integrationId, params) {
        let httpParams = new HttpParams();
        if (params.projectId)
            httpParams = httpParams.set('projectId', params.projectId);
        if (params.cursor)
            httpParams = httpParams.set('cursor', params.cursor);
        if (params.name)
            httpParams = httpParams.set('name', params.name);
        if (params.limit)
            httpParams = httpParams.set('limit', params.limit.toString());
        return this.http.get(`${API_PREFIX}/integration/activepieces/mcp-servers/${integrationId}`, { params: httpParams });
    }
    /**
     * Get MCP server details
     */
    getMcpServer(integrationId, serverId) {
        return this.http.get(`${API_PREFIX}/integration/activepieces/mcp-server/${integrationId}/${serverId}`);
    }
    /**
     * Create MCP server
     */
    createMcpServer(integrationId, data) {
        return this.http.post(`${API_PREFIX}/integration/activepieces/mcp-server/${integrationId}`, data);
    }
    /**
     * Update MCP server
     */
    updateMcpServer(integrationId, serverId, data) {
        return this.http.put(`${API_PREFIX}/integration/activepieces/mcp-server/${integrationId}/${serverId}`, data);
    }
    /**
     * Delete MCP server
     */
    deleteMcpServer(integrationId, serverId) {
        return this.http.delete(`${API_PREFIX}/integration/activepieces/mcp-server/${integrationId}/${serverId}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivepiecesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivepiecesService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivepiecesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=activepieces.service.js.map