import { Injectable } from '@angular/core';
import { WORKSPACE_OPERATIONS } from './types/workspace-sync-type';
import * as i0 from "@angular/core";
/**
 * Service for synchronizing workspace operations across multiple browser tabs.
 * Uses Broadcast Channel API to communicate workspace changes between tabs.
 */
export class WorkspaceSyncService {
    constructor() {
        this.CHANNEL_NAME = 'gauzy-workspace-sync';
        this.broadcastChannel = null;
        this.tabIdCache = null;
        /**
         * Reload the current tab to reflect workspace changes
         */
        this.reloadTimer = null;
        this.initializeBroadcastChannel();
    }
    /**
     * Initialize the Broadcast Channel for cross-tab communication
     */
    initializeBroadcastChannel() {
        // Check if Broadcast Channel API is supported
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                this.broadcastChannel = new BroadcastChannel(this.CHANNEL_NAME);
                this.setupMessageListener();
            }
            catch (error) {
                console.warn('Failed to initialize Broadcast Channel:', error);
            }
        }
        else {
            console.warn('Broadcast Channel API is not supported in this browser');
        }
    }
    /**
     * Setup listener for incoming messages from other tabs
     */
    setupMessageListener() {
        if (!this.broadcastChannel)
            return;
        this.broadcastChannel.onmessage = (event) => {
            this.handleIncomingMessage(event.data);
        };
    }
    /**
     * Handle incoming messages from other tabs
     */
    handleIncomingMessage(data) {
        // Ignore malformed messages and messages from the same tab
        if (!data || data.tabId === this.getTabId()) {
            return;
        }
        // Handle workspace operation messages
        if (Object.values(WORKSPACE_OPERATIONS).includes(data.type)) {
            this.reloadCurrentTab();
        }
    }
    /**
     * Broadcast a workspace operation to other tabs
     */
    broadcastWorkspaceOperation(operation, payload = {}) {
        if (!this.broadcastChannel) {
            return;
        }
        const message = {
            type: operation,
            payload,
            timestamp: Date.now(),
            tabId: this.getTabId()
        };
        try {
            this.broadcastChannel.postMessage(message);
        }
        catch (error) {
            console.warn('Failed to broadcast workspace operation (payload must be structured-cloneable):', error);
        }
    }
    /**
     * Broadcast workspace creation event
     */
    broadcastWorkspaceCreated(workspaceData) {
        this.broadcastWorkspaceOperation(WORKSPACE_OPERATIONS.CREATED, workspaceData);
    }
    /**
     * Broadcast workspace switch event
     */
    broadcastWorkspaceSwitched(workspaceData) {
        this.broadcastWorkspaceOperation(WORKSPACE_OPERATIONS.SWITCHED, workspaceData);
    }
    /**
     * Broadcast workspace signin event
     */
    broadcastWorkspaceSignin(workspaceData) {
        this.broadcastWorkspaceOperation(WORKSPACE_OPERATIONS.SIGNIN, workspaceData);
    }
    /**
     * Broadcast workspace update event
     */
    broadcastWorkspaceUpdated(workspaceData) {
        this.broadcastWorkspaceOperation(WORKSPACE_OPERATIONS.UPDATED, workspaceData);
    }
    /**
     * Broadcast workspace deletion event
     */
    broadcastWorkspaceDeleted(workspaceData) {
        this.broadcastWorkspaceOperation(WORKSPACE_OPERATIONS.DELETED, workspaceData);
    }
    reloadCurrentTab() {
        if (this.reloadTimer) {
            clearTimeout(this.reloadTimer);
            this.reloadTimer = null;
        }
        if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
            this.reloadTimer = setTimeout(() => window.location.reload(), 150);
        }
    }
    /**
     * Generate a unique tab identifier
     */
    getTabId() {
        // Memoize to ensure stability even if sessionStorage is unavailable
        if (this.tabIdCache) {
            return this.tabIdCache;
        }
        try {
            if (typeof sessionStorage !== 'undefined') {
                let tabId = sessionStorage.getItem('gauzy-tab-id');
                if (!tabId) {
                    tabId = this.generateTabId();
                    sessionStorage.setItem('gauzy-tab-id', tabId);
                }
                this.tabIdCache = tabId;
                return tabId;
            }
        }
        catch {
            // ignore and fallback
        }
        this.tabIdCache = this.generateTabId();
        return this.tabIdCache;
    }
    /**
     * Check if Broadcast Channel is supported and available
     */
    isSupported() {
        const hasAPI = typeof BroadcastChannel !== 'undefined';
        if (hasAPI && !this.broadcastChannel) {
            this.initializeBroadcastChannel();
        }
        return hasAPI && !!this.broadcastChannel;
    }
    generateTabId() {
        return typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? `tab-${crypto.randomUUID()}`
            : `tab-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    }
    /**
     * Cleanup resources when service is destroyed
     */
    ngOnDestroy() {
        if (this.reloadTimer !== null) {
            clearTimeout(this.reloadTimer);
            this.reloadTimer = null;
        }
        if (this.broadcastChannel) {
            this.broadcastChannel.close();
            this.broadcastChannel = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceSyncService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceSyncService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceSyncService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=workspace-sync.service.js.map