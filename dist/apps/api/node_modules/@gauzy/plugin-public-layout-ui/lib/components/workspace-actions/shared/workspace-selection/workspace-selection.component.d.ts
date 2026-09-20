import { EventEmitter } from '@angular/core';
import { IWorkspaceResponse } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * Shared workspace selection component.
 * Used by workspace-signin and workspace-find components to display available workspaces.
 */
export declare class WorkspaceSelectionComponent {
    workspaces: IWorkspaceResponse[];
    confirmedEmail: string;
    totalWorkspaces: number;
    showCreateButton: boolean;
    welcomeTitle: string;
    descriptionText: string;
    selectWorkspaceText: string;
    createButtonText: string;
    readonly workspaceSelected: EventEmitter<IWorkspaceResponse>;
    readonly createWorkspace: EventEmitter<void>;
    /**
     * Handle workspace selection
     */
    onWorkspaceSelect(workspace: IWorkspaceResponse): void;
    /**
     * Handle create new workspace button click
     */
    onCreateWorkspace(): void;
    setDefaultLogo(event: Event): void;
    /**
     * Track by function for workspace lists
     */
    trackByWorkspaceId: (_: number, w: IWorkspaceResponse) => string;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspaceSelectionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkspaceSelectionComponent, "ga-workspace-selection", never, { "workspaces": { "alias": "workspaces"; "required": false; }; "confirmedEmail": { "alias": "confirmedEmail"; "required": false; }; "totalWorkspaces": { "alias": "totalWorkspaces"; "required": false; }; "showCreateButton": { "alias": "showCreateButton"; "required": false; }; "welcomeTitle": { "alias": "welcomeTitle"; "required": false; }; "descriptionText": { "alias": "descriptionText"; "required": false; }; "selectWorkspaceText": { "alias": "selectWorkspaceText"; "required": false; }; "createButtonText": { "alias": "createButtonText"; "required": false; }; }, { "workspaceSelected": "workspaceSelected"; "createWorkspace": "createWorkspace"; }, never, never, false, never>;
}
