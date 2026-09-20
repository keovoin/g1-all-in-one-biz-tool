import { IIntegrationTenant } from '@gauzy/contracts';
import type { WorkflowExecutionResult, AsyncExecutionResult } from 'simstudio-ts-sdk';
import { ConfigService } from '@gauzy/config';
import { IntegrationService, IntegrationTenantService } from '@gauzy/core';
import { SimClientFactory } from './sim-client.factory';
import { SimRepositoryService } from './sim-repository.service';
import { SimWorkflowExecution } from './sim-workflow-execution.entity';
import { IConfigureSimInput, IExecuteWorkflowInput, ISimIntegrationSettings } from './interfaces';
import { SimEventType } from './dto/event-mapping.dto';
export declare class SimService {
    private readonly configService;
    private readonly integrationService;
    private readonly integrationTenantService;
    private readonly simClientFactory;
    private readonly simRepositoryService;
    private readonly logger;
    constructor(configService: ConfigService, integrationService: IntegrationService, integrationTenantService: IntegrationTenantService, simClientFactory: SimClientFactory, simRepositoryService: SimRepositoryService);
    /**
     * Get API key for SIM API calls.
     * Looks for a tenant-specific API key in the database first, then falls back to global config.
     * @param integrationTenantId - The integration tenant ID (not the base integration ID)
     */
    getApiKey(integrationTenantId?: string): Promise<string>;
    /**
     * Configure SIM integration for the current tenant.
     */
    configureIntegration(input: IConfigureSimInput): Promise<{
        integrationTenantId: string;
    }>;
    /**
     * Execute a SIM workflow for the current tenant.
     */
    executeWorkflow(input: IExecuteWorkflowInput): Promise<WorkflowExecutionResult | AsyncExecutionResult>;
    /**
     * Get async job status.
     */
    getJobStatus(taskId: string): Promise<any>;
    /**
     * Validate a workflow is deployed and ready.
     */
    validateWorkflow(workflowId: string): Promise<boolean>;
    /**
     * Get integration settings (sanitized, no API key exposed).
     */
    getIntegrationSettings(): Promise<ISimIntegrationSettings>;
    /**
     * Get execution history for the current tenant.
     */
    getExecutionHistory(options?: {
        workflowId?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        data: SimWorkflowExecution[];
        total: number;
    }>;
    /**
     * Check if SIM integration is enabled for a given integration tenant.
     */
    isIntegrationEnabled(integrationTenantId: string): Promise<boolean>;
    /**
     * Set an event-to-workflow mapping for the current tenant.
     * When the specified Gauzy event fires, the mapped SIM workflow will be triggered automatically.
     */
    setEventMapping(event: SimEventType, workflowId: string): Promise<void>;
    /**
     * Remove an event-to-workflow mapping for the current tenant.
     */
    removeEventMapping(event: SimEventType): Promise<void>;
    /**
     * Get all event-to-workflow mappings for the current tenant.
     */
    getEventMappings(): Promise<{
        event: string;
        workflowId: string;
    }[]>;
    /**
     * Get the list of supported event types for workflow triggers.
     */
    getSupportedEvents(): {
        event: string;
        description: string;
    }[];
    /**
     * Trigger a workflow from an internal Gauzy event.
     */
    triggerEventWorkflow(params: {
        event: string;
        data: any;
        tenantId: string;
        organizationId?: string;
    }): Promise<void>;
    /**
     * Map a SIM API execution result onto a SimWorkflowExecution entity.
     * Handles both sync and async response shapes.
     */
    private mapExecutionResult;
    /**
     * Parse a setting value that may be stored as a boolean or a JSON-encoded string into a boolean.
     */
    private parseEnabledSetting;
    /**
     * Get integration tenant information (with sensitive settings redacted).
     */
    getIntegrationTenant(integrationTenantId: string): Promise<IIntegrationTenant>;
}
