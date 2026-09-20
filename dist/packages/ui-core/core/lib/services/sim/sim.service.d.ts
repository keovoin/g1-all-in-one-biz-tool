import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID, IIntegrationTenant } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * Represents a single SIM workflow execution record.
 */
export interface ISimExecutionRecord {
    id: string;
    workflowId: string;
    executionId?: string;
    status: string;
    triggeredBy?: string;
    duration?: number;
    createdAt: string;
    updatedAt?: string;
    result?: Record<string, unknown>;
}
/**
 * Paginated response for execution history.
 */
export interface ISimExecutionHistoryResponse {
    data: ISimExecutionRecord[];
    total: number;
}
/**
 * Result of a workflow execution (sync or async).
 */
export interface ISimWorkflowExecutionResult {
    executionId?: string;
    status?: string;
    result?: Record<string, unknown>;
    taskId?: string;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
}
/**
 * Async job status response.
 */
export interface ISimJobStatusResponse {
    taskId: string;
    status: string;
    result?: Record<string, unknown>;
    [key: string]: unknown;
}
/**
 * Supported event type from the backend.
 */
export interface ISimSupportedEvent {
    event: string;
    description: string;
}
/**
 * Event-to-workflow mapping.
 */
export interface ISimEventMapping {
    event: string;
    workflowId: string;
}
export declare class SimService {
    private readonly http;
    private readonly API_URL;
    constructor(http: HttpClient);
    /**
     * Configure SIM integration with API key.
     */
    setup(apiKey: string, organizationId?: string): Observable<{
        integrationTenantId: string;
    }>;
    /**
     * Get SIM integration settings (sanitized, no API key exposed).
     */
    getSettings(): Observable<{
        isEnabled: boolean;
        hasApiKey: boolean;
    }>;
    /**
     * Execute a SIM workflow.
     */
    executeWorkflow(workflowId: string, body: {
        input?: unknown;
        timeout?: number;
        runAsync?: boolean;
    }): Observable<ISimWorkflowExecutionResult>;
    /**
     * Validate a workflow is deployed and ready.
     */
    validateWorkflow(workflowId: string): Observable<{
        workflowId: string;
        isDeployed: boolean;
    }>;
    /**
     * Get async job status.
     */
    getJobStatus(taskId: string): Observable<ISimJobStatusResponse>;
    /**
     * Get workflow execution history.
     */
    getExecutionHistory(query?: {
        workflowId?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Observable<ISimExecutionHistoryResponse>;
    /**
     * Check if SIM integration is enabled.
     */
    getIntegrationStatus(integrationTenantId: ID): Observable<{
        enabled: boolean;
    }>;
    /**
     * Get integration tenant information (with sensitive settings redacted).
     */
    getIntegrationTenant(integrationTenantId: ID): Observable<IIntegrationTenant>;
    /**
     * Get supported event types for workflow triggers.
     */
    getSupportedEvents(): Observable<ISimSupportedEvent[]>;
    /**
     * Get all event-to-workflow mappings for the current tenant.
     */
    getEventMappings(): Observable<ISimEventMapping[]>;
    /**
     * Set an event-to-workflow mapping.
     */
    setEventMapping(event: string, workflowId: string): Observable<ISimEventMapping>;
    /**
     * Remove an event-to-workflow mapping.
     */
    removeEventMapping(event: string): Observable<{
        removed: boolean;
        event: string;
    }>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SimService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SimService>;
}
