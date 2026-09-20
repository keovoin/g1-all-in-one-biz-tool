import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NbDialogService, NbMenuItem, NbMenuService, NbToastrService } from '@nebular/theme';
import { Actions } from '@ngneat/effects-ng';
import { TranslateService } from '@ngx-translate/core';
import { ComponentLayoutStyleEnum, ID, IDocument, PermissionsEnum } from '@gauzy/contracts';
import { ComponentEnum } from '@gauzy/ui-core/common';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { PaginationFilterBaseComponent } from '@gauzy/ui-core/shared';
import { DocumentsQuery } from '../../+state/documents.query';
import { DocumentsStore } from '../../+state/documents.store';
import { IDocsCardsCrumb } from '../../components/cards/docs-cards.component';
import { DocsStatsLineComponent } from '../../components/stats/docs-stats-line.component';
import { DocsFilterState } from '../../models/docs-filter.model';
import { DocsEmptyVariant } from '../../components/empty/empty-state.component';
import { DocumentTreeStore } from '../../services/document-tree.store';
import { DocumentsService } from '../../services/documents.service';
import { UploadQueueService } from '../../services/upload-queue.service';
import * as i0 from "@angular/core";
/**
 * Browse page orchestrator: owns URL restore, the table ↔ cards view toggle
 * (persisted via `ComponentEnum.DOCUMENTS_HUB`, `?view=` overrides for one load),
 * the location breadcrumb + "Load more" paging, the create menu (`New ▾`), the
 * preview modal, the upload flow (`?upload=1` / `?newPage=1` / `?newFolder=1`
 * one-shot deep links), selection, the keyboard shortcut map and the processing
 * poll wiring.
 */
export declare class DocsBrowsePageComponent extends PaginationFilterBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly route;
    private readonly router;
    private readonly actions;
    private readonly documentsStore;
    private readonly documentsQuery;
    private readonly documentsService;
    private readonly documentTreeStore;
    readonly uploadQueue: UploadQueueService;
    private readonly dialogService;
    private readonly nbMenuService;
    private readonly toastrService;
    private readonly nbToastrService;
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
    fileInput: ElementRef<HTMLInputElement>;
    /** `New ▾` trigger — the `n` shortcut opens the menu by clicking it. */
    newMenuTrigger: ElementRef<HTMLElement>;
    /** Stats tiles — re-pulled when uploads/bulk actions change the counts. */
    statsLine?: DocsStatsLineComponent;
    readonly query: DocumentsQuery;
    readonly uploadAccept = ".pdf,.docx,.xlsx,.pptx,.odt,.ods,.csv,.txt,.md,.html,.png,.jpg,.jpeg,.webp,.gif";
    readonly permissions: typeof PermissionsEnum;
    readonly layoutStyles: typeof ComponentLayoutStyleEnum;
    dataLayoutStyle: ComponentLayoutStyleEnum;
    dropActive: boolean;
    canManage: boolean;
    /** `DOCS_CREATE` — gates the `u` (upload) and `n` (New ▾) shortcuts. */
    canCreate: boolean;
    /** Ancestor chain of the current tree location, rendered in the page header. */
    breadcrumb: IDocsCardsCrumb[];
    /** Live query params, handed to the saved-views control (UX spec §5). */
    urlParams: Params;
    /** Nebular menu tag of the `New ▾` split menu. */
    readonly newMenuTag = "docs-browse-new";
    /** `New ▾` items — Folder, then Page (`01-ux-spec.md` §2). Rebuilt on language change. */
    newMenu: NbMenuItem[];
    private readonly search$;
    private pendingUploadFolder;
    /** The layout store emits its current value immediately — the first emission is not a switch. */
    private viewInitialized;
    constructor(translateService: TranslateService, route: ActivatedRoute, router: Router, actions: Actions, documentsStore: DocumentsStore, documentsQuery: DocumentsQuery, documentsService: DocumentsService, documentTreeStore: DocumentTreeStore, uploadQueue: UploadQueueService, dialogService: NbDialogService, nbMenuService: NbMenuService, toastrService: ToastrService, nbToastrService: NbToastrService, store: Store);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Document-level shortcut map: `/` search, `u` upload, `n` New ▾, `v` layout
     * toggle, `Esc` clear selection → close the detail panel.
     *
     * Bound on `document` rather than the host because the surface the shortcuts act
     * on spans three sibling components (the sidebar tree, this page and the detail
     * panel) and the user is rarely focused inside this component's subtree.
     * {@link docsBrowseShortcutOf} owns every "keep your hands off this key" rule;
     * the open-overlay probe below is the one guard it cannot make, because a
     * context menu does not move focus and so never shows up on `event.target`.
     */
    onDocumentKeydown(event: KeyboardEvent): void;
    /** `/` — the filter bar owns the input; the page only moves focus into it. */
    private focusSearch;
    setView(): void;
    viewComponentName: ComponentEnum;
    /** Header toggle click — persists through the standard layout mechanism. */
    setLayout(style: ComponentLayoutStyleEnum): void;
    get isCardsView(): boolean;
    /**
     * Search results and every non-All preset are flat (`01-ux-spec.md` §4.2):
     * the backend drops the `parentId` scope for a search, so folder cards would
     * misrepresent the result set.
     */
    isFlat(filter: DocsFilterState | null): boolean;
    onLoadMore(): void;
    onDrillIn(folderId: ID | null): void;
    /**
     * Breadcrumb segment click. A redacted ancestor carries no id — the template
     * already disables it, and this second guard keeps a stray dispatch from
     * scoping the list to `null` (i.e. silently jumping to the root).
     */
    onCrumbClick(crumb: IDocsCardsCrumb): void;
    openPreview(document: IDocument): void;
    openEditor(document: IDocument): void;
    /**
     * Resolves the breadcrumb for the current tree location.
     *
     * Preferred source is `GET /documents/:id/path`: it is the only one that can say
     * an ancestor exists but is *unreadable* (`08-permissions-security.md` §3.2) —
     * a client-side walk simply loses that folder and silently shortens the path.
     * Falls back to the shared node cache and then to the document plus its `parent`
     * relation, so a deployment without the route (or a transient failure) still
     * renders a usable trail. Unresolvable ancestors are not invented — the root
     * crumb always gets back out.
     */
    private refreshBreadcrumb;
    /**
     * Server-resolved crumbs, or `null` when the route could not answer.
     *
     * `null` (not `[]`) is the "fall back" signal — an empty array is a legitimate
     * answer for a root-level folder and must not send the caller down the local
     * path, which would produce a different (shorter) trail.
     *
     * Deliberately tolerant of both plausible server contracts: the response is
     * expected to end at the folder itself, and when it carries ancestors only, the
     * current folder is appended from the node cache so the trail still shows where
     * the user is standing.
     */
    private resolveServerBreadcrumb;
    private restoreFromUrl;
    /**
     * One-shot action deep links (`?upload=1` / `?newPage=1` / `?newFolder=1`):
     * consume, strip with a `replaceUrl` write, then run the action.
     *
     * The strip is what makes this safe to run on every emission — the follow-up
     * emission carries the nulled params and matches nothing. Actions are deferred a
     * tick so the dialog opens after the current navigation has settled.
     */
    private consumeOneShotParams;
    /**
     * Rebuilds the whole browse state from a query-param set and reloads.
     * Shared by the cold-load restore and by applying a saved view — both are
     * "the URL changed wholesale, re-derive everything from it" (§5.1).
     */
    private applyStateFromParams;
    /** `?view=` carries only the two canonical layout ids; anything else means "no override". */
    private parseViewParam;
    /**
     * Applies a saved filter view: merge-write its params (the patch already
     * nulls every view-owned param it does not carry, so nothing leaks from the
     * previous view), then re-derive state from the resulting URL.
     */
    onApplySavedView(patch: Params): Promise<void>;
    private stripOneShotParams;
    onFilterChange(partial: Partial<DocsFilterState>): void;
    onSearchChange(q: string): void;
    onPresetToggled(preset: DocsFilterState['preset']): void;
    onClearAll(): void;
    onSortChanged(sort: {
        field: string;
        order: 'ASC' | 'DESC';
    }): void;
    onRowClicked(document: IDocument): void;
    onFolderOpened(document: IDocument): void;
    onSelectionChanged(ids: ID[]): void;
    onRetryRequested(document: IDocument): Promise<void>;
    onBulkCompleted(event: {
        destructive: boolean;
    }): void;
    onClearSelection(): void;
    openUploadFlow(): void;
    onDropActiveChange(active: boolean): void;
    onFilesPicked(fileList: FileList | File[] | null): Promise<void>;
    /**
     * Single-file upload that lands READY but PENDING review (`01-ux-spec.md` §7.3).
     *
     * The toast IS the action — clicking it opens the review queue — which is why it
     * goes through `NbToastrService` directly: the shared `ToastrService` wrapper
     * returns void and drops the `NbToastRef` this needs. Restricted to single-file
     * batches so a ten-file drop cannot raise ten toasts.
     */
    private notifyIfNeedsReview;
    openNewPageDialog(): Promise<void>;
    /**
     * New folder at the current tree location (`00-product-spec.md` §5.2 E-2).
     *
     * Unlike a page, a folder is created **in place**: there is nothing to open, so
     * the list re-queries and the sidebar branch drops its memo instead of
     * navigating. Before this existed the only folder-create affordance was a node's
     * context menu — which needs a node — so a brand-new organization, whose tree is
     * empty by definition, could never create its first folder.
     */
    openNewFolderDialog(): Promise<void>;
    goToReviewQueue(): void;
    /**
     * `New ▾`. Kept in a method (rather than a getter bound in the template) so
     * the labels re-translate on a language switch without handing
     * `[nbContextMenu]` a new array reference on every change-detection pass.
     */
    private buildHeaderMenus;
    emptyVariant(rows: IDocument[], error: boolean): DocsEmptyVariant;
    onEmptyAction(action: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsBrowsePageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsBrowsePageComponent, "gz-docs-browse-page", never, {}, {}, never, never, false, never>;
}
