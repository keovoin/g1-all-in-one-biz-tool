export declare const WORKSPACE_OPERATIONS: {
    readonly CREATED: "workspace-created";
    readonly SWITCHED: "workspace-switched";
    readonly SIGNIN: "workspace-signin";
    readonly UPDATED: "workspace-updated";
    readonly DELETED: "workspace-deleted";
};
/**
 * Union type of workspace operations derived from the constants
 */
export type WorkspaceOperation = (typeof WORKSPACE_OPERATIONS)[keyof typeof WORKSPACE_OPERATIONS];
export type WorkspaceSyncPayload = Record<string, unknown>;
export interface WorkspaceSyncMessage {
    readonly type: WorkspaceOperation;
    readonly payload: WorkspaceSyncPayload;
    readonly timestamp: number;
    readonly tabId: string;
}
