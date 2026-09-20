import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ID, ITag, PermissionsEnum } from '@gauzy/contracts';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentBulkAction, IDocumentBulkResultItem } from '../../models/docs-api.model';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
/** The one popover the bar may have open at a time. */
export type DocumentBulkPanel = 'tags' | 'more';
/**
 * Floating bulk action bar, shown while the selection is non-empty. Actions map
 * 1:1 to `POST /documents/bulk` (≤ 200 ids). The result toast summarizes
 * succeeded/failed; the expandable panel lists up to 10 per-id errors with a
 * "Copy full report" action for the complete list.
 */
export declare class BulkBarComponent extends TranslationBaseComponent implements OnChanges {
    readonly translateService: TranslateService;
    private readonly documentsService;
    private readonly toastrService;
    private readonly dialogService;
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
    selectedIds: ID[];
    /** Review-queue mode: only approve/reject (DOCS_REVIEW). */
    reviewMode: boolean;
    completed: EventEmitter<{
        destructive: boolean;
    }>;
    cleared: EventEmitter<void>;
    busy: boolean;
    errors: IDocumentBulkResultItem[];
    errorsExpanded: boolean;
    /**
     * Tags for the add/remove actions, picked with the platform tag control.
     *
     * 🛑 The bulk endpoint takes **tag ids**, and this used to be a free-text box
     * whose comma-separated words were sent as `tagIds` — every id was bogus, so
     * the call either no-opped or failed per id. Ids can only come from a real
     * picker.
     */
    tags: ITag[];
    /** Which popover is open, if any. Only one at a time. */
    openPanel: DocumentBulkPanel | null;
    readonly permissions: typeof PermissionsEnum;
    readonly maxIds = 200;
    readonly maxInlineErrors = 10;
    constructor(translateService: TranslateService, documentsService: DocumentsService, toastrService: ToastrService, dialogService: NbDialogService);
    /**
     * The bar hides itself with `*ngIf="count > 0"` INSIDE its own template, so an
     * emptied selection does not destroy the component — without this reset the open
     * popover, the picked tags and the previous errors would all come back with the
     * next selection.
     */
    ngOnChanges(changes: SimpleChanges): void;
    get count(): number;
    get overLimit(): boolean;
    get inlineErrors(): IDocumentBulkResultItem[];
    /** Add/remove tags act on the picker's selection. */
    get hasTagSelection(): boolean;
    togglePanel(panel: DocumentBulkPanel): void;
    closePanel(): void;
    /** Esc closes the open popover. */
    onEscape(): void;
    clear(): void;
    run(action: DocumentBulkAction, extra?: Partial<Parameters<DocumentsService['bulk']>[0]>): Promise<void>;
    /** Bulk reject: optional reason via the shared reject dialog (same `reason` field as single). */
    reject(): Promise<void>;
    move(): Promise<void>;
    /**
     * Bulk "Set categories" (`R-BLK-01`). The dialog carries the REPLACE warning;
     * an empty array is a deliberate "clear them all", so only a cancelled dialog
     * (`null`) skips the call.
     */
    setCategories(): Promise<void>;
    addTags(): void;
    removeTags(): void;
    copyReport(): Promise<void>;
    private selectedTagIds;
    static ɵfac: i0.ɵɵFactoryDeclaration<BulkBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BulkBarComponent, "gz-docs-bulk-bar", never, { "selectedIds": { "alias": "selectedIds"; "required": false; }; "reviewMode": { "alias": "reviewMode"; "required": false; }; }, { "completed": "completed"; "cleared": "cleared"; }, never, never, false, never>;
}
