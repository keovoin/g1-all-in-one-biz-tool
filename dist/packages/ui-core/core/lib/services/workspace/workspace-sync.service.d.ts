import { OnDestroy } from '@angular/core';
import { WorkspaceOperation, WorkspaceSyncPayload } from './types/workspace-sync-type';
import * as i0 from "@angular/core";
/**
 * Service for synchronizing workspace operations across multiple browser tabs.
 * Uses Broadcast Channel API to communicate workspace changes between tabs.
 */
export declare class WorkspaceSyncService implements OnDestroy {
    private readonly CHANNEL_NAME;
    private broadcastChannel;
    private tabIdCache;
    constructor();
    /**
     * Initialize the Broadcast Channel for cross-tab communication
     */
    private initializeBroadcastChannel;
    /**
     * Setup listener for incoming messages from other tabs
     */
    private setupMessageListener;
    /**
     * Handle incoming messages from other tabs
     */
    private handleIncomingMessage;
    /**
     * Broadcast a workspace operation to other tabs
     */
    broadcastWorkspaceOperation(operation: WorkspaceOperation, payload?: WorkspaceSyncPayload): void;
    /**
     * Broadcast workspace creation event
     */
    broadcastWorkspaceCreated(workspaceData?: WorkspaceSyncPayload): void;
    /**
     * Broadcast workspace switch event
     */
    broadcastWorkspaceSwitched(workspaceData?: WorkspaceSyncPayload): void;
    /**
     * Broadcast workspace signin event
     */
    broadcastWorkspaceSignin(workspaceData?: WorkspaceSyncPayload): void;
    /**
     * Broadcast workspace update event
     */
    broadcastWorkspaceUpdated(workspaceData?: WorkspaceSyncPayload): void;
    /**
     * Broadcast workspace deletion event
     */
    broadcastWorkspaceDeleted(workspaceData?: WorkspaceSyncPayload): void;
    /**
     * Reload the current tab to reflect workspace changes
     */
    private reloadTimer;
    private reloadCurrentTab;
    /**
     * Generate a unique tab identifier
     */
    private getTabId;
    /**
     * Check if Broadcast Channel is supported and available
     */
    isSupported(): boolean;
    private generateTabId;
    /**
     * Cleanup resources when service is destroyed
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspaceSyncService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WorkspaceSyncService>;
}
