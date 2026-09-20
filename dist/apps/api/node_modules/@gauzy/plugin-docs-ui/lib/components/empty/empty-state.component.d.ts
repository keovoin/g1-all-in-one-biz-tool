import { EventEmitter } from '@angular/core';
import { PermissionsEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export type DocsEmptyVariant = 'first-run' | 'empty-folder' | 'no-results' | 'review-empty' | 'error';
/**
 * Variant-driven empty/error states per `01-ux-spec.md` §13.
 */
export declare class EmptyStateComponent {
    variant: DocsEmptyVariant;
    primaryAction: EventEmitter<string>;
    readonly permissions: typeof PermissionsEnum;
    /**
     * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
     * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
     * makes ngx-permissions re-validate forever and wedges the main thread.
     */
    readonly docsPermissions: Readonly<{
        read: PermissionsEnum[];
        create: PermissionsEnum[];
        update: PermissionsEnum[];
        delete: PermissionsEnum[];
        manage: PermissionsEnum[];
        review: PermissionsEnum[];
        aiImport: PermissionsEnum[];
    }>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmptyStateComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmptyStateComponent, "gz-docs-empty-state", never, { "variant": { "alias": "variant"; "required": false; }; }, { "primaryAction": "primaryAction"; }, never, never, false, never>;
}
