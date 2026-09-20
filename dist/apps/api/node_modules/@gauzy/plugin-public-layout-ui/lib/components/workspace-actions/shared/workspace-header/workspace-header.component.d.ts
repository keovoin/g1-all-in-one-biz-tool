import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Shared header component for workspace action pages.
 * Contains the logo and close button that appears in all workspace action templates.
 */
export declare class WorkspaceHeaderComponent {
    title: string;
    subtitle: string;
    showCloseButton: boolean;
    readonly close: EventEmitter<void>;
    /**
     * Handle close button click
     */
    onClose(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkspaceHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkspaceHeaderComponent, "ga-workspace-header", never, { "title": { "alias": "title"; "required": false; }; "subtitle": { "alias": "subtitle"; "required": false; }; "showCloseButton": { "alias": "showCloseButton"; "required": false; }; }, { "close": "close"; }, never, never, false, never>;
}
