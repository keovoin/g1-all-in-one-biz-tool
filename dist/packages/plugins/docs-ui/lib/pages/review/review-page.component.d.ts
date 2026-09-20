import { OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Actions } from '@ngneat/effects-ng';
import { BehaviorSubject } from 'rxjs';
import { DocumentKindEnum, ID, IDocument, PermissionsEnum } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
/**
 * Review queue (`01-ux-spec.md` §11): PENDING documents with reason badges,
 * single approve/reject (reject with an optional reason), row selection and
 * bulk approve/reject through the bulk bar (`DOCS_REVIEW` only — the route is
 * additionally permission-guarded), plus per-row Details and Preview.
 */
export declare class ReviewPageComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly documentsService;
    private readonly toastrService;
    private readonly dialogService;
    private readonly actions;
    private readonly store;
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
    rows$: BehaviorSubject<IDocument[]>;
    loading: boolean;
    error: boolean;
    selectedIds: ID[];
    readonly permissions: typeof PermissionsEnum;
    readonly kindEnum: typeof DocumentKindEnum;
    constructor(translateService: TranslateService, documentsService: DocumentsService, toastrService: ToastrService, dialogService: NbDialogService, actions: Actions, store: Store);
    ngOnInit(): void;
    load(): Promise<void>;
    isSelected(row: IDocument): boolean;
    toggleSelected(row: IDocument, checked: boolean): void;
    get allSelected(): boolean;
    toggleSelectAll(checked: boolean): void;
    onClearSelection(): void;
    approve(document: IDocument): Promise<void>;
    /** Reject with an OPTIONAL reason (same `reason` field as bulk rejection). */
    reject(document: IDocument): Promise<void>;
    /** Opens the detail side panel (`?id=` on the review URL — the shell hosts it). */
    openDetails(document: IDocument): void;
    openPreview(document: IDocument): void;
    onBulkCompleted(): void;
    reasonKey(document: IDocument): string;
    reasonStatus(document: IDocument): string;
    confidencePercent(document: IDocument): string;
    trackById(_: number, row: IDocument): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReviewPageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ReviewPageComponent, "gz-docs-review-page", never, {}, {}, never, never, false, never>;
}
