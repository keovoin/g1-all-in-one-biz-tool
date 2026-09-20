import { SimService } from './sim.service';
import { ConfigureSimIntegrationDto, ExecuteWorkflowDto, WorkflowExecutionQueryDto, EventMappingDto } from './dto';
export declare class SimController {
    private readonly simService;
    private readonly logger;
    constructor(simService: SimService);
    /**
     * Configure SIM integration for the current tenant.
     */
    setupIntegration(body: ConfigureSimIntegrationDto, organizationId?: string): Promise<{
        integrationTenantId: string;
    }>;
    /**
     * Get SIM integration settings (sanitized).
     */
    getSettings(): Promise<import("./interfaces").ISimIntegrationSettings>;
    /**
     * Execute a SIM workflow.
     */
    executeWorkflow(workflowId: string, body: ExecuteWorkflowDto): Promise<import("simstudio-ts-sdk").WorkflowExecutionResult | import("simstudio-ts-sdk").AsyncExecutionResult>;
    /**
     * Validate a workflow is deployed and ready.
     */
    validateWorkflow(workflowId: string): Promise<{
        workflowId: string;
        isDeployed: boolean;
    }>;
    /**
     * Get async job status.
     */
    getJobStatus(taskId: string): Promise<any>;
    /**
     * Get execution history.
     */
    getExecutionHistory(query: WorkflowExecutionQueryDto): Promise<{
        data: import("./sim-workflow-execution.entity").SimWorkflowExecution[];
        total: number;
    }>;
    /**
     * Check if SIM integration is enabled.
     */
    getIntegrationStatus(integrationTenantId: string): Promise<{
        enabled: boolean;
    }>;
    /**
     * Get integration tenant information (with sensitive settings redacted).
     */
    getIntegrationTenant(integrationTenantId: string): Promise<import("@gauzy/contracts").IIntegrationTenant>;
    /**
     * Get supported event types for workflow triggers.
     */
    getSupportedEvents(): {
        event: string;
        description: string;
    }[];
    /**
     * Get all event-to-workflow mappings for the current tenant.
     */
    getEventMappings(): Promise<{
        event: string;
        workflowId: string;
    }[]>;
    /**
     * Set an event-to-workflow mapping.
     */
    setEventMapping(body: EventMappingDto): Promise<{
        event: "timer.started" | "timer.stopped" | "timer.status_updated" | "task.created" | "task.updated" | "task.deleted" | "screenshot.created" | "screenshot.updated" | "screenshot.deleted" | "integration.created" | "integration.updated" | "integration.deleted" | "account.registered" | "account.verified";
        workflowId: string;
    }>;
    /**
     * Remove an event-to-workflow mapping.
     */
    removeEventMapping(event: string): Promise<{
        removed: boolean;
        event: string;
    }>;
}
