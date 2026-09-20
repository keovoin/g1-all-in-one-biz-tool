/**
 * DTO for querying execution history.
 */
export declare class WorkflowExecutionQueryDto {
    workflowId?: string;
    status?: string;
    limit?: number;
    offset?: number;
}
