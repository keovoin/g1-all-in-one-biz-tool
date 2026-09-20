/**
 * Supported Gauzy event types that can trigger SIM workflows.
 */
export declare const SIM_SUPPORTED_EVENTS: readonly ["timer.started", "timer.stopped", "timer.status_updated", "task.created", "task.updated", "task.deleted", "screenshot.created", "screenshot.updated", "screenshot.deleted", "integration.created", "integration.updated", "integration.deleted", "account.registered", "account.verified"];
export type SimEventType = (typeof SIM_SUPPORTED_EVENTS)[number];
/**
 * Constant map of SIM event names for use in handlers.
 * Avoids hardcoded string literals that can drift out of sync with SIM_SUPPORTED_EVENTS.
 */
export declare const SimEventName: {
    readonly TIMER_STARTED: "timer.started";
    readonly TIMER_STOPPED: "timer.stopped";
    readonly TIMER_STATUS_UPDATED: "timer.status_updated";
    readonly TASK_CREATED: "task.created";
    readonly TASK_UPDATED: "task.updated";
    readonly TASK_DELETED: "task.deleted";
    readonly SCREENSHOT_CREATED: "screenshot.created";
    readonly SCREENSHOT_UPDATED: "screenshot.updated";
    readonly SCREENSHOT_DELETED: "screenshot.deleted";
    readonly INTEGRATION_CREATED: "integration.created";
    readonly INTEGRATION_UPDATED: "integration.updated";
    readonly INTEGRATION_DELETED: "integration.deleted";
    readonly ACCOUNT_REGISTERED: "account.registered";
    readonly ACCOUNT_VERIFIED: "account.verified";
};
/**
 * Event descriptions map for use in the service layer.
 */
export declare const SIM_EVENT_DESCRIPTIONS: Record<SimEventType, string>;
export declare class EventMappingDto {
    event: SimEventType;
    workflowId: string;
}
