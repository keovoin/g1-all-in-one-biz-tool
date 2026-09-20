import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class SimService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/integration/sim`;
    }
    /**
     * Configure SIM integration with API key.
     */
    setup(apiKey, organizationId) {
        const params = organizationId ? new HttpParams().set('organizationId', organizationId) : undefined;
        return this.http.post(`${this.API_URL}/setup`, { apiKey }, { params });
    }
    /**
     * Get SIM integration settings (sanitized, no API key exposed).
     */
    getSettings() {
        return this.http.get(`${this.API_URL}/settings`);
    }
    /**
     * Execute a SIM workflow.
     */
    executeWorkflow(workflowId, body) {
        const encodedWorkflowId = encodeURIComponent(workflowId);
        return this.http.post(`${this.API_URL}/workflows/${encodedWorkflowId}/execute`, body);
    }
    /**
     * Validate a workflow is deployed and ready.
     */
    validateWorkflow(workflowId) {
        const encodedWorkflowId = encodeURIComponent(workflowId);
        return this.http.get(`${this.API_URL}/workflows/${encodedWorkflowId}/validate`);
    }
    /**
     * Get async job status.
     */
    getJobStatus(taskId) {
        const encodedTaskId = encodeURIComponent(taskId);
        return this.http.get(`${this.API_URL}/jobs/${encodedTaskId}/status`);
    }
    /**
     * Get workflow execution history.
     */
    getExecutionHistory(query) {
        let params = new HttpParams();
        if (query?.workflowId)
            params = params.set('workflowId', query.workflowId);
        if (query?.status)
            params = params.set('status', query.status);
        if (query?.limit != null)
            params = params.set('limit', query.limit.toString());
        if (query?.offset != null)
            params = params.set('offset', query.offset.toString());
        return this.http.get(`${this.API_URL}/executions`, { params });
    }
    /**
     * Check if SIM integration is enabled.
     */
    getIntegrationStatus(integrationTenantId) {
        return this.http.get(`${this.API_URL}/status/${integrationTenantId}`);
    }
    /**
     * Get integration tenant information (with sensitive settings redacted).
     */
    getIntegrationTenant(integrationTenantId) {
        return this.http.get(`${this.API_URL}/integration-tenant/${integrationTenantId}`);
    }
    /**
     * Get supported event types for workflow triggers.
     */
    getSupportedEvents() {
        return this.http.get(`${this.API_URL}/events/supported`);
    }
    /**
     * Get all event-to-workflow mappings for the current tenant.
     */
    getEventMappings() {
        return this.http.get(`${this.API_URL}/events/mappings`);
    }
    /**
     * Set an event-to-workflow mapping.
     */
    setEventMapping(event, workflowId) {
        return this.http.post(`${this.API_URL}/events/mappings`, { event, workflowId });
    }
    /**
     * Remove an event-to-workflow mapping.
     */
    removeEventMapping(event) {
        const encodedEvent = encodeURIComponent(event);
        return this.http.delete(`${this.API_URL}/events/mappings/${encodedEvent}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SimService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SimService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SimService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=sim.service.js.map