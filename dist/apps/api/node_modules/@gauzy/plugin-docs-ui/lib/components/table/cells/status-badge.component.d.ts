import { DocumentStatusEnum, IDocument, PermissionsEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * Processing status badge. UPLOADED folds into the "Processing" style with an
 * inline spinner; FAILED renders a red dot with the statusMessage tooltip and
 * an inline Retry link for DOCS_UPDATE holders.
 */
export declare class StatusBadgeComponent {
    rowData: IDocument;
    value: DocumentStatusEnum;
    /** Set by the table's onComponentInitFunction to route Retry clicks. */
    retryHandler?: (document: IDocument) => void;
    readonly statusEnum: typeof DocumentStatusEnum;
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
    get status(): DocumentStatusEnum;
    get isProcessing(): boolean;
    get cssClass(): string;
    get labelKey(): string;
    get tooltip(): string;
    onRetry(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StatusBadgeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StatusBadgeComponent, "gz-docs-status-badge", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
