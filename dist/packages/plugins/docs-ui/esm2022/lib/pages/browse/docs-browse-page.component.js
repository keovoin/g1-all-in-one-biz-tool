import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbMenuService, NbToastrService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions } from '@ngneat/effects-ng';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, take, tap } from 'rxjs/operators';
import { ComponentLayoutStyleEnum, DocumentKindEnum, DocumentReviewStatusEnum, PermissionsEnum } from '@gauzy/contracts';
import { ComponentEnum, distinctUntilChange } from '@gauzy/ui-core/common';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { PaginationFilterBaseComponent } from '@gauzy/ui-core/shared';
import { DocumentsActions } from '../../+state/documents.actions';
import { DocumentsQuery } from '../../+state/documents.query';
import { DocumentsStore } from '../../+state/documents.store';
import { DOCS_CARDS_PAGE_SIZE, DOCS_DEFAULT_PAGE_SIZE, DOCS_PREVIEW_DIALOG_CONFIG, DOCS_REVIEW_TOAST_DURATION_MS, DOCS_SEARCH_DEBOUNCE_MS, DOCS_UPLOAD_ACCEPT } from '../../docs.constants';
import { DocsPreviewModalComponent } from '../../components/preview/docs-preview-modal.component';
import { DocsStatsLineComponent } from '../../components/stats/docs-stats-line.component';
import { ClassificationDialogComponent } from '../../dialogs/classification-dialog.component';
import { CreateDialogComponent } from '../../dialogs/create-dialog.component';
import { createInitialDocsFilterState, hasActiveFilters, parseDocsFilterFromParams } from '../../models/docs-filter.model';
import { humanizeBytes } from '../../models/docs-format.util';
import { DocumentTreeStore } from '../../services/document-tree.store';
import { DocumentsService } from '../../services/documents.service';
import { UploadQueueService } from '../../services/upload-queue.service';
import { toDocsBreadcrumb } from './docs-breadcrumb.util';
import { DOCS_BROWSE_OVERLAY_SELECTOR, DOCS_SEARCH_INPUT_ID, docsBrowseShortcutOf } from './docs-browse-shortcuts';
import { DOCS_PERMISSIONS } from '../../docs-permission-groups';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@angular/router";
import * as i3 from "@ngneat/effects-ng";
import * as i4 from "../../+state/documents.store";
import * as i5 from "../../+state/documents.query";
import * as i6 from "../../services/documents.service";
import * as i7 from "../../services/document-tree.store";
import * as i8 from "../../services/upload-queue.service";
import * as i9 from "@nebular/theme";
import * as i10 from "@gauzy/ui-core/core";
import * as i11 from "@angular/common";
import * as i12 from "ngx-permissions";
import * as i13 from "@gauzy/ui-core/shared";
import * as i14 from "../../components/table/docs-table.component";
import * as i15 from "../../components/cards/docs-cards.component";
import * as i16 from "../../components/filter-bar/docs-filter-bar.component";
import * as i17 from "../../components/stats/docs-stats-line.component";
import * as i18 from "../../components/upload/docs-drop-strip.component";
import * as i19 from "../../components/upload/upload-dropzone.directive";
import * as i20 from "../../components/upload/upload-progress.component";
import * as i21 from "../../components/bulk/bulk-bar.component";
import * as i22 from "../../components/empty/empty-state.component";
/**
 * Browse page orchestrator: owns URL restore, the table ↔ cards view toggle
 * (persisted via `ComponentEnum.DOCUMENTS_HUB`, `?view=` overrides for one load),
 * the location breadcrumb + "Load more" paging, the create menu (`New ▾`), the
 * preview modal, the upload flow (`?upload=1` / `?newPage=1` / `?newFolder=1`
 * one-shot deep links), selection, the keyboard shortcut map and the processing
 * poll wiring.
 */
let DocsBrowsePageComponent = class DocsBrowsePageComponent extends PaginationFilterBaseComponent {
    constructor(translateService, route, router, actions, documentsStore, documentsQuery, documentsService, documentTreeStore, uploadQueue, dialogService, nbMenuService, toastrService, 
    // Only the review handoff toast needs the raw Nebular service — see
    // `notifyIfNeedsReview()`; everything else goes through `toastrService`.
    nbToastrService, store) {
        super(translateService);
        this.translateService = translateService;
        this.route = route;
        this.router = router;
        this.actions = actions;
        this.documentsStore = documentsStore;
        this.documentsQuery = documentsQuery;
        this.documentsService = documentsService;
        this.documentTreeStore = documentTreeStore;
        this.uploadQueue = uploadQueue;
        this.dialogService = dialogService;
        this.nbMenuService = nbMenuService;
        this.toastrService = toastrService;
        this.nbToastrService = nbToastrService;
        this.store = store;
        /**
         * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
         * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
         * makes ngx-permissions re-validate forever and wedges the main thread.
         */
        this.docsPermissions = DOCS_PERMISSIONS;
        this.query = this.documentsQuery;
        this.uploadAccept = DOCS_UPLOAD_ACCEPT;
        this.permissions = PermissionsEnum;
        this.layoutStyles = ComponentLayoutStyleEnum;
        this.dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
        this.dropActive = false;
        this.canManage = false;
        /** `DOCS_CREATE` — gates the `u` (upload) and `n` (New ▾) shortcuts. */
        this.canCreate = false;
        /** Ancestor chain of the current tree location, rendered in the page header. */
        this.breadcrumb = [];
        /** Live query params, handed to the saved-views control (UX spec §5). */
        this.urlParams = {};
        /** Nebular menu tag of the `New ▾` split menu. */
        this.newMenuTag = 'docs-browse-new';
        /** `New ▾` items — Folder, then Page (`01-ux-spec.md` §2). Rebuilt on language change. */
        this.newMenu = [];
        this.search$ = new Subject();
        this.pendingUploadFolder = null;
        /** The layout store emits its current value immediately — the first emission is not a switch. */
        this.viewInitialized = false;
        this.setView();
    }
    ngOnInit() {
        // 1) Restore state from the URL (single source of truth for shareable state).
        this.restoreFromUrl();
        // 2) Search input debounces 500 ms before it becomes a filter change.
        this.search$
            .pipe(debounceTime(DOCS_SEARCH_DEBOUNCE_MS), distinctUntilChanged(), untilDestroyed(this))
            .subscribe((q) => this.actions.dispatch(DocumentsActions.filterChanged({ q })));
        // 3) Pagination component → store.
        this.pagination$
            .pipe(distinctUntilChange(), untilDestroyed(this))
            .subscribe(({ activePage, itemsPerPage }) => {
            const current = this.documentsQuery.pagination;
            if (current.page !== activePage || current.pageSize !== itemsPerPage) {
                this.actions.dispatch(DocumentsActions.paginationChanged({ page: activePage, pageSize: itemsPerPage }));
            }
        });
        // 4) Keep the pagination component in sync with the total count.
        this.documentsQuery.totalCount$.pipe(untilDestroyed(this)).subscribe((totalCount) => {
            this.setPagination({ ...this.getPagination(), totalItems: totalCount });
        });
        // 5) Org switches reload everything.
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), distinctUntilChange(), tap(() => this.actions.dispatch(DocumentsActions.loadDocuments())), untilDestroyed(this))
            .subscribe();
        // 6) Cards breadcrumb follows the tree location.
        this.documentsQuery.folderId$
            .pipe(distinctUntilChanged(), tap((folderId) => void this.refreshBreadcrumb(folderId)), untilDestroyed(this))
            .subscribe();
        // 7) Mirror the live query string for the saved-views control, and consume the
        //    one-shot action deep links off the SAME stream.
        //
        //    🛑 Not the initial snapshot: `DocsRowActionsService.uploadHere()` and the tree's
        //    empty-state buttons merge `?upload=1` / `?newPage=1` / `?newFolder=1` into the URL
        //    while this page is already mounted, and a snapshot-only read (which is what
        //    `restoreFromUrl()` did) never saw them — so "Upload here" did nothing whenever the
        //    hub was the current route, which is every time it is raised from the sidebar.
        this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
            this.urlParams = params ?? {};
            this.consumeOneShotParams(this.urlParams);
        });
        // 8) Server-side upload rejections get a readable toast. The per-file row
        //    already shows the failure; the toast exists because a quota rejection
        //    is not retryable and the user must go free space or raise the quota.
        this.uploadQueue.rejections$.pipe(untilDestroyed(this)).subscribe((rejection) => {
            switch (rejection.reason) {
                case 'quota-exceeded':
                    this.toastrService.danger(rejection.message || this.getTranslation('DOCS.ERRORS.QUOTA_EXCEEDED'), this.getTranslation('DOCS.ERRORS.QUOTA_EXCEEDED'));
                    break;
                case 'too-large':
                    this.toastrService.warning(this.getTranslation('DOCS.UPLOAD.FILE_TOO_LARGE', {
                        name: rejection.file.name,
                        max: humanizeBytes(this.uploadQueue.maxFileSizeBytes)
                    }));
                    break;
                case 'type-not-allowed':
                    this.toastrService.warning(this.getTranslation('DOCS.UPLOAD.TYPE_NOT_ALLOWED', { name: rejection.file.name }));
                    break;
                default:
                    // Generic failures are already visible on the queue row with a
                    // Retry button — a toast per file would be pure noise.
                    break;
            }
        });
        // 8b) A single upload that finishes READY but PENDING review gets an actionable
        //     toast straight to the review queue (§7.3).
        this.uploadQueue.documentReady$.pipe(untilDestroyed(this)).subscribe((document) => {
            this.notifyIfNeedsReview(document);
        });
        // 8c) EVERY settled upload moves the stats tiles — a document that settles
        //     FAILED moves the Failed count just as a READY one moves Ready, so this
        //     rides the outcome-agnostic stream, not the READY-only one above.
        this.uploadQueue.documentSettled$.pipe(untilDestroyed(this)).subscribe(() => {
            this.statsLine?.reload();
        });
        this.canManage = this.store.hasPermission(PermissionsEnum.DOCS_MANAGE);
        this.canCreate = this.store.hasPermission(PermissionsEnum.DOCS_CREATE);
        // 9) Header menus: build them, keep them translated, and act on their clicks.
        this.buildHeaderMenus();
        this.translateService.onLangChange.pipe(untilDestroyed(this)).subscribe(() => this.buildHeaderMenus());
        this.nbMenuService
            .onItemClick()
            .pipe(filter(({ tag }) => tag === this.newMenuTag), untilDestroyed(this))
            .subscribe(({ item }) => {
            const action = item.data?.action;
            // A menu click cannot be awaited; every branch owns its own failure path.
            switch (action) {
                case 'new-folder':
                    void this.openNewFolderDialog();
                    break;
                case 'new-page':
                    void this.openNewPageDialog();
                    break;
            }
        });
    }
    ngOnDestroy() {
        // UntilDestroy handles subscriptions.
    }
    // ─── Keyboard shortcuts (`01-ux-spec.md` §16/§17) ────────────
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
    onDocumentKeydown(event) {
        const shortcut = docsBrowseShortcutOf(event);
        if (!shortcut)
            return;
        if (document.querySelector(DOCS_BROWSE_OVERLAY_SELECTOR))
            return;
        switch (shortcut) {
            case 'search':
                this.focusSearch();
                break;
            case 'upload':
                if (!this.canCreate)
                    return;
                this.openUploadFlow();
                break;
            case 'new':
                if (!this.canCreate)
                    return;
                // `[nbContextMenu]` has no imperative open handle — clicking the trigger is
                // the directive's own entry point, so the menu opens anchored exactly as it
                // does on a pointer click.
                this.newMenuTrigger?.nativeElement?.click();
                break;
            case 'toggle-view':
                this.setLayout(this.isCardsView ? ComponentLayoutStyleEnum.TABLE : ComponentLayoutStyleEnum.CARDS_GRID);
                break;
            case 'dismiss':
                // Selection first: `Esc` on a multi-select is "never mind", and closing the
                // panel out from under a pending bulk action would be the wrong undo.
                if (this.documentsQuery.selectedIds.length) {
                    this.onClearSelection();
                }
                else if (this.documentsQuery.detailId) {
                    this.actions.dispatch(DocumentsActions.detailClosed());
                }
                else {
                    return;
                }
                break;
        }
        event.preventDefault();
    }
    /** `/` — the filter bar owns the input; the page only moves focus into it. */
    focusSearch() {
        const input = document.getElementById(DOCS_SEARCH_INPUT_ID);
        input?.focus();
        input?.select?.();
    }
    // ─── View toggle (ComponentEnum.DOCUMENTS_HUB) ───────────────
    setView() {
        this.viewComponentName = ComponentEnum.DOCUMENTS_HUB;
        this.store
            .componentLayout$(this.viewComponentName)
            .pipe(distinctUntilChange(), tap((componentLayout) => {
            this.dataLayoutStyle = componentLayout ?? ComponentLayoutStyleEnum.TABLE;
            this.actions.dispatch(DocumentsActions.viewChanged(this.dataLayoutStyle === ComponentLayoutStyleEnum.CARDS_GRID ? 'cards' : 'table'));
            // The first emission is the restored preference — `restoreFromUrl()`
            // issues that load. Only a real switch re-queries.
            if (this.viewInitialized) {
                this.actions.dispatch(DocumentsActions.loadDocuments());
            }
            this.viewInitialized = true;
        }), untilDestroyed(this))
            .subscribe();
    }
    /** Header toggle click — persists through the standard layout mechanism. */
    setLayout(style) {
        if (this.dataLayoutStyle === style)
            return;
        this.store.setLayoutForComponent(this.viewComponentName, style);
    }
    get isCardsView() {
        return this.dataLayoutStyle === ComponentLayoutStyleEnum.CARDS_GRID;
    }
    // ─── Cards view ──────────────────────────────────────────────
    /**
     * Search results and every non-All preset are flat (`01-ux-spec.md` §4.2):
     * the backend drops the `parentId` scope for a search, so folder cards would
     * misrepresent the result set.
     */
    isFlat(filter) {
        return !!(filter?.q || filter?.preset);
    }
    onLoadMore() {
        this.actions.dispatch(DocumentsActions.loadMore());
    }
    onDrillIn(folderId) {
        this.actions.dispatch(DocumentsActions.folderChanged(folderId));
    }
    /**
     * Breadcrumb segment click. A redacted ancestor carries no id — the template
     * already disables it, and this second guard keeps a stray dispatch from
     * scoping the list to `null` (i.e. silently jumping to the root).
     */
    onCrumbClick(crumb) {
        if (!crumb || crumb.restricted || !crumb.id)
            return;
        this.onDrillIn(crumb.id);
    }
    openPreview(document) {
        this.dialogService.open(DocsPreviewModalComponent, { ...DOCS_PREVIEW_DIALOG_CONFIG, context: { document } });
    }
    openEditor(document) {
        this.router.navigate(['page', document.id], { relativeTo: this.route });
    }
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
    async refreshBreadcrumb(folderId) {
        if (!folderId) {
            this.breadcrumb = [];
            return;
        }
        const serverPath = await this.resolveServerBreadcrumb(folderId);
        if (serverPath) {
            this.breadcrumb = serverPath;
            return;
        }
        const path = this.documentTreeStore.pathOf(folderId);
        if (path.length) {
            this.breadcrumb = path.map((node) => ({ id: node.id, name: node.name }));
            return;
        }
        try {
            const document = await firstValueFrom(this.documentsService.getById(folderId, ['parent']));
            // The `?.` below used to sit next to a bare `document.id`/`document.name`: the
            // guard admitted a nullish response and the very next line dereferenced it, so an
            // empty body threw a TypeError that only the catch made look intentional.
            if (!document) {
                this.breadcrumb = [];
                return;
            }
            const parent = document.parent;
            this.breadcrumb = [
                ...(parent ? [{ id: parent.id, name: parent.name }] : []),
                { id: document.id, name: document.name }
            ];
        }
        catch {
            this.breadcrumb = [];
        }
    }
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
    async resolveServerBreadcrumb(folderId) {
        try {
            const segments = await firstValueFrom(this.documentsService.getPath(folderId));
            return toDocsBreadcrumb(segments, folderId, (id) => this.documentTreeStore.getNode(id)?.name);
        }
        catch {
            // 404 on a deployment that predates the route, or a transient failure —
            // either way the local chain is a better answer than no breadcrumb.
            return null;
        }
    }
    // ─── URL restore ─────────────────────────────────────────────
    restoreFromUrl() {
        // The one-shot action params are consumed off the live `queryParams` stream
        // (ngOnInit step 7), which replays the current snapshot on subscribe — so the
        // cold-load case is still covered, and a param merged in later works too.
        this.applyStateFromParams(this.route.snapshot.queryParams);
    }
    /**
     * One-shot action deep links (`?upload=1` / `?newPage=1` / `?newFolder=1`):
     * consume, strip with a `replaceUrl` write, then run the action.
     *
     * The strip is what makes this safe to run on every emission — the follow-up
     * emission carries the nulled params and matches nothing. Actions are deferred a
     * tick so the dialog opens after the current navigation has settled.
     */
    consumeOneShotParams(params) {
        if (params['upload'] === '1') {
            // `?upload=1&folder=` uploads into the folder the LINK named, which is not
            // necessarily the one the list is scoped to — the tree's "Upload here" raises
            // this for an arbitrary node without moving the list.
            const folder = typeof params['folder'] === 'string' && params['folder'] ? params['folder'] : null;
            this.pendingUploadFolder = folder ?? this.documentsQuery.folderId;
            this.stripOneShotParams();
            setTimeout(() => this.openUploadFlow());
        }
        else if (params['newPage'] === '1') {
            this.stripOneShotParams();
            setTimeout(() => void this.openNewPageDialog());
        }
        else if (params['newFolder'] === '1') {
            this.stripOneShotParams();
            setTimeout(() => void this.openNewFolderDialog());
        }
    }
    /**
     * Rebuilds the whole browse state from a query-param set and reloads.
     * Shared by the cold-load restore and by applying a saved view — both are
     * "the URL changed wholesale, re-derive everything from it" (§5.1).
     */
    applyStateFromParams(params) {
        const filterState = parseDocsFilterFromParams(params);
        const folderId = typeof params['folder'] === 'string' && params['folder'] ? params['folder'] : null;
        const page = Math.max(1, parseInt(params['page'], 10) || 1);
        // `?view=` wins over the persisted layout for this load only; with no
        // param the layout subscription's value (already applied) stands.
        const urlView = this.parseViewParam(params['view']);
        const view = urlView ?? this.documentsQuery.view;
        if (urlView) {
            // Render the requested view without writing it to the persisted layout.
            this.dataLayoutStyle =
                urlView === 'cards' ? ComponentLayoutStyleEnum.CARDS_GRID : ComponentLayoutStyleEnum.TABLE;
        }
        const defaultPageSize = view === 'cards' ? DOCS_CARDS_PAGE_SIZE : DOCS_DEFAULT_PAGE_SIZE;
        const pageSize = Math.max(1, parseInt(params['pageSize'], 10) || defaultPageSize);
        this.documentsStore.update({
            filter: filterState,
            folderId,
            pagination: { page, pageSize },
            view,
            selectedIds: []
        });
        // Seed the pagination base with the restored values. `pagination$` is a
        // BehaviorSubject holding the class defaults (page 1 / 10 rows): without
        // this write its very next emission — the replay to the subscription set up
        // right after this call — would dispatch those defaults straight back over
        // the deep link, so `?page=` / `?pageSize=` never survived and the cards
        // view always asked for 10 rows instead of 24.
        this.setPagination({ ...this.getPagination(), activePage: page, itemsPerPage: pageSize });
        this.actions.dispatch(DocumentsActions.loadDocuments());
    }
    /** `?view=` carries only the two canonical layout ids; anything else means "no override". */
    parseViewParam(value) {
        if (value === 'cards')
            return 'cards';
        if (value === 'table')
            return 'table';
        return null;
    }
    /**
     * Applies a saved filter view: merge-write its params (the patch already
     * nulls every view-owned param it does not carry, so nothing leaks from the
     * previous view), then re-derive state from the resulting URL.
     */
    async onApplySavedView(patch) {
        await this.router.navigate([], {
            relativeTo: this.route,
            queryParams: patch,
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
        this.applyStateFromParams(this.route.snapshot.queryParams);
    }
    stripOneShotParams() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { upload: null, newPage: null, newFolder: null },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
    // ─── Filter bar events ───────────────────────────────────────
    onFilterChange(partial) {
        this.actions.dispatch(DocumentsActions.filterChanged(partial));
    }
    onSearchChange(q) {
        this.search$.next(q ?? '');
    }
    onPresetToggled(preset) {
        this.actions.dispatch(DocumentsActions.presetToggled(preset));
    }
    onClearAll() {
        this.actions.dispatch(DocumentsActions.filterChanged(createInitialDocsFilterState()));
    }
    onSortChanged(sort) {
        this.actions.dispatch(DocumentsActions.filterChanged({ sort }));
    }
    // ─── Table events ────────────────────────────────────────────
    onRowClicked(document) {
        this.actions.dispatch(DocumentsActions.detailOpened(document.id));
    }
    onFolderOpened(document) {
        this.actions.dispatch(DocumentsActions.folderChanged(document.id));
    }
    onSelectionChanged(ids) {
        this.actions.dispatch(DocumentsActions.selectionChanged(ids));
    }
    async onRetryRequested(document) {
        try {
            const updated = await firstValueFrom(this.documentsService.reprocess(document.id));
            this.actions.dispatch(DocumentsActions.rowChanged(updated));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    onBulkCompleted(event) {
        this.actions.dispatch(DocumentsActions.bulkCompleted({ destructive: event.destructive }));
        // Archive/delete/review bulk actions move the tile counts.
        this.statsLine?.reload();
    }
    onClearSelection() {
        this.actions.dispatch(DocumentsActions.selectionChanged([]));
    }
    // ─── Upload flow ─────────────────────────────────────────────
    openUploadFlow() {
        this.fileInput?.nativeElement?.click();
    }
    onDropActiveChange(active) {
        this.dropActive = active;
    }
    async onFilesPicked(fileList) {
        const files = Array.from(fileList ?? []);
        if (this.fileInput?.nativeElement)
            this.fileInput.nativeElement.value = '';
        if (!files.length)
            return;
        if (files.length > this.uploadQueue.maxFilesPerUpload) {
            this.toastrService.warning(this.getTranslation('DOCS.UPLOAD.TOO_MANY_FILES', { max: this.uploadQueue.maxFilesPerUpload }));
            return;
        }
        // Upload & classify dialog (§7.2). It owns the batch from here: the user can
        // drop individual files in it, so the *dialog's* list is what gets enqueued —
        // never the originally picked one.
        const result = await firstValueFrom(this.dialogService.open(ClassificationDialogComponent, {
            context: { files, parentId: this.pendingUploadFolder ?? this.documentsQuery.folderId }
        }).onClose);
        this.pendingUploadFolder = null;
        if (!result?.files?.length)
            return;
        this.uploadQueue.enqueue(result.files, result.options);
        this.toastrService.info(this.getTranslation('DOCS.TOASTS.UPLOAD_STARTED'), '');
    }
    /**
     * Single-file upload that lands READY but PENDING review (`01-ux-spec.md` §7.3).
     *
     * The toast IS the action — clicking it opens the review queue — which is why it
     * goes through `NbToastrService` directly: the shared `ToastrService` wrapper
     * returns void and drops the `NbToastRef` this needs. Restricted to single-file
     * batches so a ten-file drop cannot raise ten toasts.
     */
    notifyIfNeedsReview(document) {
        if (document?.reviewStatus !== DocumentReviewStatusEnum.PENDING)
            return;
        if (!this.uploadQueue.isSingleFileUpload(document.id))
            return;
        const toastRef = this.nbToastrService.warning(this.getTranslation('DOCS.TOASTS.UPLOADED_NEEDS_REVIEW'), this.getTranslation('DOCS.TOASTS.UPLOADED_NEEDS_REVIEW_ACTION'), { duration: DOCS_REVIEW_TOAST_DURATION_MS, destroyByClick: true });
        toastRef
            .onClick()
            .pipe(take(1), untilDestroyed(this))
            .subscribe(() => this.goToReviewQueue());
    }
    async openNewPageDialog() {
        const folderId = this.documentsQuery.folderId;
        const created = await firstValueFrom(this.dialogService.open(CreateDialogComponent, {
            context: { kind: DocumentKindEnum.PAGE, parentId: folderId }
        }).onClose);
        if (!created)
            return;
        // The sidebar branch the page landed in still holds its pre-create memo; the
        // tree outlives this navigation (it lives in the shell), so it has to be told.
        this.documentTreeStore.invalidate(folderId);
        this.router.navigate(['page', created.id], { relativeTo: this.route });
    }
    /**
     * New folder at the current tree location (`00-product-spec.md` §5.2 E-2).
     *
     * Unlike a page, a folder is created **in place**: there is nothing to open, so
     * the list re-queries and the sidebar branch drops its memo instead of
     * navigating. Before this existed the only folder-create affordance was a node's
     * context menu — which needs a node — so a brand-new organization, whose tree is
     * empty by definition, could never create its first folder.
     */
    async openNewFolderDialog() {
        const folderId = this.documentsQuery.folderId;
        const created = await firstValueFrom(this.dialogService.open(CreateDialogComponent, {
            context: { kind: DocumentKindEnum.FOLDER, parentId: folderId }
        }).onClose);
        if (!created)
            return;
        this.documentTreeStore.invalidate(folderId);
        this.actions.dispatch(DocumentsActions.loadDocuments());
    }
    goToReviewQueue() {
        this.router.navigate(['review'], { relativeTo: this.route });
    }
    // ─── Header menus ────────────────────────────────────────────
    /**
     * `New ▾`. Kept in a method (rather than a getter bound in the template) so
     * the labels re-translate on a language switch without handing
     * `[nbContextMenu]` a new array reference on every change-detection pass.
     */
    buildHeaderMenus() {
        this.newMenu = [
            {
                title: this.getTranslation('DOCS.TREE.NEW_FOLDER'),
                icon: 'folder-add-outline',
                data: { action: 'new-folder' }
            },
            {
                title: this.getTranslation('DOCS.TREE.NEW_PAGE'),
                icon: 'file-add-outline',
                data: { action: 'new-page' }
            }
        ];
    }
    // ─── Empty state ─────────────────────────────────────────────
    emptyVariant(rows, error) {
        if (error)
            return 'error';
        if (hasActiveFilters(this.documentsQuery.filter))
            return 'no-results';
        if (this.documentsQuery.folderId)
            return 'empty-folder';
        return 'first-run';
    }
    onEmptyAction(action) {
        switch (action) {
            case 'upload':
                this.openUploadFlow();
                break;
            case 'new-page':
                void this.openNewPageDialog();
                break;
            case 'new-folder':
                void this.openNewFolderDialog();
                break;
            case 'clear-filters':
                this.onClearAll();
                break;
            case 'retry':
                this.actions.dispatch(DocumentsActions.loadDocuments());
                break;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsBrowsePageComponent, deps: [{ token: i1.TranslateService }, { token: i2.ActivatedRoute }, { token: i2.Router }, { token: i3.Actions }, { token: i4.DocumentsStore }, { token: i5.DocumentsQuery }, { token: i6.DocumentsService }, { token: i7.DocumentTreeStore }, { token: i8.UploadQueueService }, { token: i9.NbDialogService }, { token: i9.NbMenuService }, { token: i10.ToastrService }, { token: i9.NbToastrService }, { token: i10.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsBrowsePageComponent, isStandalone: false, selector: "gz-docs-browse-page", host: { listeners: { "document:keydown": "onDocumentKeydown($event)" } }, viewQueries: [{ propertyName: "fileInput", first: true, predicate: ["fileInput"], descendants: true }, { propertyName: "newMenuTrigger", first: true, predicate: ["newMenuTrigger"], descendants: true, read: ElementRef }, { propertyName: "statsLine", first: true, predicate: ["statsLine"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"docs-browse\" gzDocsUploadDropzone (filesDropped)=\"onFilesPicked($event)\" (dragActiveChange)=\"onDropActiveChange($event)\">\n\t<!-- Page-wide drop overlay -->\n\t<div class=\"docs-drop-overlay\" *ngIf=\"dropActive\">\n\t\t<nb-icon icon=\"cloud-upload-outline\"></nb-icon>\n\t\t<span>{{ 'DOCS.UPLOAD.DROP_HINT' | translate }}</span>\n\t</div>\n\n\t<!-- Hidden multi file input -->\n\t<input\n\t\t#fileInput\n\t\tid=\"docs-browse-file-input\"\n\t\ttype=\"file\"\n\t\tmultiple\n\t\thidden\n\t\t[accept]=\"uploadAccept\"\n\t\t[attr.aria-label]=\"'DOCS.UPLOAD.BUTTON' | translate\"\n\t\t(change)=\"onFilesPicked(fileInput.files)\"\n\t/>\n\n\t<!-- Header -->\n\t<div class=\"docs-browse-header\">\n\t\t<h4 class=\"docs-browse-title\">{{ 'DOCS.TITLE' | translate }}</h4>\n\t\t<div class=\"docs-browse-actions\">\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.review\">\n\t\t\t\t<button nbButton size=\"small\" appearance=\"ghost\" (click)=\"goToReviewQueue()\">\n\t\t\t\t\t<nb-icon icon=\"checkmark-circle-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.REVIEW.QUEUE_TITLE' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<!-- View toggle \u2014 persisted via ComponentEnum.DOCUMENTS_HUB.\n\t\t\t     `<fieldset>` is the semantic grouping element (implicit `group` role); the inline\n\t\t\t     rules only neutralize the user-agent fieldset chrome so the layout is unchanged. -->\n\t\t\t<fieldset\n\t\t\t\tclass=\"docs-view-toggle\"\n\t\t\t\tstyle=\"border: 0; padding: 0; margin-inline: 0; min-inline-size: 0\"\n\t\t\t\t[attr.aria-label]=\"'DOCS.VIEWS.TOGGLE_LABEL' | translate\"\n\t\t\t>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[status]=\"isCardsView ? 'basic' : 'primary'\"\n\t\t\t\t\t[appearance]=\"isCardsView ? 'outline' : 'filled'\"\n\t\t\t\t\t[attr.aria-pressed]=\"!isCardsView\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.VIEWS.TABLE' | translate\"\n\t\t\t\t\t(click)=\"setLayout(layoutStyles.TABLE)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"list-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[status]=\"isCardsView ? 'primary' : 'basic'\"\n\t\t\t\t\t[appearance]=\"isCardsView ? 'filled' : 'outline'\"\n\t\t\t\t\t[attr.aria-pressed]=\"isCardsView\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.VIEWS.CARDS' | translate\"\n\t\t\t\t\t(click)=\"setLayout(layoutStyles.CARDS_GRID)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"grid-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</fieldset>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.create\">\n\t\t\t\t<!-- `New \u25BE` (`01-ux-spec.md` \u00A72): Folder | Page. A folder was previously\n\t\t\t\t     unreachable from here, so a brand-new organization \u2014 whose tree is empty and\n\t\t\t\t     whose only other create affordance is a node context menu that needs an\n\t\t\t\t     existing node \u2014 had no way to create its first folder at all. -->\n\t\t\t\t<button\n\t\t\t\t\t#newMenuTrigger\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tappearance=\"outline\"\n\t\t\t\t\t[nbContextMenu]=\"newMenu\"\n\t\t\t\t\t[nbContextMenuTag]=\"newMenuTag\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.NEW_MENU' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.TREE.NEW' | translate }}\n\t\t\t\t\t<nb-icon icon=\"chevron-down-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button nbButton size=\"small\" status=\"primary\" (click)=\"openUploadFlow()\">\n\t\t\t\t\t<nb-icon icon=\"upload-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.UPLOAD.BUTTON' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t</div>\n\t</div>\n\n\t<!-- Location breadcrumb (`00-product-spec.md` \u00A76.9 R-TRE-01 / `01-ux-spec.md` \u00A72).\n\t     Page-level on purpose: it used to live inside `gz-docs-cards`, which meant it\n\t     vanished in the table layout (the default) and on an empty folder \u2014 both of\n\t     which render below the `rows.length` switch \u2014 leaving a drilled-in user with no\n\t     indication of where they were and no way back to the root.\n\t     Hidden in flat-results mode: a search drops the folder scope server-side, so a\n\t     path would misrepresent the rows (same rule the cards row applied). -->\n\t<nav\n\t\tclass=\"docs-browse-breadcrumb\"\n\t\t*ngIf=\"!isFlat(query.filter$ | async)\"\n\t\t[attr.aria-label]=\"'DOCS.A11Y.BREADCRUMB' | translate\"\n\t>\n\t\t<button nbButton ghost size=\"tiny\" [disabled]=\"!breadcrumb.length\" (click)=\"onDrillIn(null)\">\n\t\t\t<span class=\"docs-crumb-label\">{{ 'DOCS.CARDS.BREADCRUMB_ROOT' | translate }}</span>\n\t\t</button>\n\t\t<ng-container *ngFor=\"let crumb of breadcrumb; let last = last\">\n\t\t\t<nb-icon icon=\"chevron-right-outline\" class=\"docs-crumb-sep\"></nb-icon>\n\t\t\t<!-- A redacted ancestor keeps the depth of the path but never its name, and\n\t\t\t     is not navigable \u2014 the caller has no read access to it. -->\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"tiny\"\n\t\t\t\t[disabled]=\"last || crumb.restricted || !crumb.id\"\n\t\t\t\t[class.docs-crumb-restricted]=\"crumb.restricted\"\n\t\t\t\t[nbTooltip]=\"crumb.restricted ? ('DOCS.BREADCRUMB.RESTRICTED' | translate) : crumb.name\"\n\t\t\t\t(click)=\"onCrumbClick(crumb)\"\n\t\t\t>\n\t\t\t\t<span class=\"docs-crumb-label\">\n\t\t\t\t\t{{ crumb.restricted ? ('DOCS.BREADCRUMB.RESTRICTED' | translate) : crumb.name }}\n\t\t\t\t</span>\n\t\t\t</button>\n\t\t</ng-container>\n\t</nav>\n\n\t<!-- Stats tiles \u2014 org-global on purpose (the preset chips' counts are the\n\t     filter-relative numbers); hides itself when the endpoint is unavailable. -->\n\t<gz-docs-stats-line #statsLine></gz-docs-stats-line>\n\n\t<div class=\"docs-browse-toolbar\">\n\t\t<gz-docs-filter-bar\n\t\t\t[facets]=\"query.facets$ | async\"\n\t\t\t[value]=\"query.filter$ | async\"\n\t\t\t[urlParams]=\"urlParams\"\n\t\t\t[presetCounts]=\"query.presetCounts$ | async\"\n\t\t\t(filterChange)=\"onFilterChange($event)\"\n\t\t\t(searchChange)=\"onSearchChange($event)\"\n\t\t\t(clearAll)=\"onClearAll()\"\n\t\t\t(applyView)=\"onApplySavedView($event)\"\n\t\t\t(presetToggled)=\"onPresetToggled($event)\"\n\t\t></gz-docs-filter-bar>\n\t</div>\n\n\t<!-- Always-visible drop strip. VISUAL-ONLY: the page-root gzDocsUploadDropzone\n\t     owns every drop (a second directive instance would double-fire); the strip\n\t     mirrors its drag state and clicks through to the same upload flow. -->\n\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.create\">\n\t\t<gz-docs-drop-strip\n\t\t\t[active]=\"dropActive\"\n\t\t\t[maxFileSizeBytes]=\"uploadQueue.maxFileSizeBytes\"\n\t\t\t[maxFiles]=\"uploadQueue.maxFilesPerUpload\"\n\t\t\t[accept]=\"uploadAccept\"\n\t\t\t(browse)=\"openUploadFlow()\"\n\t\t></gz-docs-drop-strip>\n\t</ng-template>\n\n\t<!-- Upload progress -->\n\t<gz-docs-upload-progress\n\t\t[items]=\"uploadQueue.items$ | async\"\n\t\t(retry)=\"uploadQueue.retry($event)\"\n\t\t(dismiss)=\"uploadQueue.dismiss($event)\"\n\t\t(clearFinished)=\"uploadQueue.clearFinished()\"\n\t></gz-docs-upload-progress>\n\n\t<!-- Content -->\n\t<ng-container *ngIf=\"query.rows$ | async as rows\">\n\t\t<ng-container *ngIf=\"rows.length; else emptyState\">\n\t\t\t<!-- Cards view -->\n\t\t\t<gz-docs-cards\n\t\t\t\t*ngIf=\"isCardsView; else tableView\"\n\t\t\t\t[rows]=\"rows\"\n\t\t\t\t[totalCount]=\"(query.totalCount$ | async) || 0\"\n\t\t\t\t[loading]=\"(query.loading$ | async) === true\"\n\t\t\t\t[flat]=\"isFlat(query.filter$ | async)\"\n\t\t\t\t[activeId]=\"query.detailId$ | async\"\n\t\t\t\t(open)=\"onRowClicked($event)\"\n\t\t\t\t(preview)=\"openPreview($event)\"\n\t\t\t\t(openEditor)=\"openEditor($event)\"\n\t\t\t\t(drillIn)=\"onDrillIn($event)\"\n\t\t\t\t(loadMore)=\"onLoadMore()\"\n\t\t\t></gz-docs-cards>\n\n\t\t\t<!-- Table view -->\n\t\t\t<ng-template #tableView>\n\t\t\t\t<gz-docs-table\n\t\t\t\t\t[rows]=\"rows\"\n\t\t\t\t\t[loading]=\"(query.loading$ | async) === true\"\n\t\t\t\t\t[selectable]=\"canManage\"\n\t\t\t\t\t(rowClicked)=\"onRowClicked($event)\"\n\t\t\t\t\t(folderOpened)=\"onFolderOpened($event)\"\n\t\t\t\t\t(selectionChanged)=\"onSelectionChanged($event)\"\n\t\t\t\t\t(sortChanged)=\"onSortChanged($event)\"\n\t\t\t\t\t(retryRequested)=\"onRetryRequested($event)\"\n\t\t\t\t\t(previewRequested)=\"openPreview($event)\"\n\t\t\t\t\t(editorRequested)=\"openEditor($event)\"\n\t\t\t\t></gz-docs-table>\n\n\t\t\t\t<div class=\"pagination-container\">\n\t\t\t\t\t<ga-pagination\n\t\t\t\t\t\t[totalItems]=\"pagination?.totalItems\"\n\t\t\t\t\t\t[activePage]=\"pagination?.activePage\"\n\t\t\t\t\t\t[itemsPerPage]=\"pagination?.itemsPerPage\"\n\t\t\t\t\t\t[doEmit]=\"false\"\n\t\t\t\t\t\t(selectedOption)=\"onUpdateOption($event)\"\n\t\t\t\t\t\t(selectedPage)=\"onPageChange($event)\"\n\t\t\t\t\t></ga-pagination>\n\t\t\t\t</div>\n\t\t\t</ng-template>\n\t\t</ng-container>\n\n\t\t<ng-template #emptyState>\n\t\t\t<div [nbSpinner]=\"(query.loading$ | async) === true\" nbSpinnerStatus=\"primary\" class=\"docs-empty-host\">\n\t\t\t\t<gz-docs-empty-state\n\t\t\t\t\t*ngIf=\"(query.loading$ | async) !== true\"\n\t\t\t\t\t[variant]=\"emptyVariant(rows, (query.error$ | async) === true)\"\n\t\t\t\t\t(primaryAction)=\"onEmptyAction($event)\"\n\t\t\t\t></gz-docs-empty-state>\n\t\t\t</div>\n\t\t</ng-template>\n\t</ng-container>\n\n\t<!-- Bulk bar -->\n\t<gz-docs-bulk-bar\n\t\t[selectedIds]=\"(query.selection$ | async) || []\"\n\t\t(completed)=\"onBulkCompleted($event)\"\n\t\t(cleared)=\"onClearSelection()\"\n\t></gz-docs-bulk-bar>\n</div>\n", styles: [".docs-browse{position:relative;display:flex;flex-direction:column;gap:var(--docs-section-gap, 1rem);padding:var(--docs-page-padding, 1.25rem);min-height:100%;color:var(--docs-text, var(--text-basic-color))}.docs-drop-overlay{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;border:2px dashed var(--color-primary-default);border-radius:var(--docs-radius-lg, .5rem);background:var(--color-primary-transparent-100, rgba(51, 102, 255, .08));color:var(--color-primary-default);font-size:var(--docs-body-size, .8125rem);font-weight:600;pointer-events:none}.docs-drop-overlay nb-icon{font-size:2.25rem}.docs-browse-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem 1rem;flex-wrap:wrap;min-height:2rem}.docs-browse-header .docs-browse-title{flex:1 1 12rem;min-width:0;margin:0;font-size:.9375rem;font-weight:var(--docs-title-weight, 600);line-height:1.375rem;letter-spacing:var(--gauzy-page-title-letter-spacing, -.01em);color:var(--docs-text, var(--text-basic-color));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-browse-header .docs-browse-actions{display:flex;align-items:center;flex-wrap:wrap;gap:.375rem}.docs-browse-actions button[nbButton]{display:inline-flex;align-items:center;justify-content:center;gap:.375rem;height:var(--docs-control-height-sm, 1.75rem);min-height:var(--docs-control-height-sm, 1.75rem);font-size:var(--docs-meta-size, .75rem);font-weight:500;line-height:1;white-space:nowrap}.docs-browse-actions button[nbButton] nb-icon{margin:0;font-size:.875rem;line-height:1}.docs-view-toggle{display:inline-flex;align-items:center;gap:.25rem}.docs-view-toggle button[nbButton]{width:var(--docs-control-height-sm, 1.75rem)}.docs-browse .docs-browse-actions button[nbButton],.docs-browse .docs-browse-breadcrumb button[nbButton]{padding-block:0}.docs-browse .docs-browse-actions button[nbButton]{padding-inline:.5625rem}.docs-browse .docs-browse-breadcrumb button[nbButton]{padding-inline:.375rem}.docs-browse .docs-browse-actions button[nbButton].icon-start.icon-end{padding-block:0;padding-inline:.5625rem}.docs-browse .docs-view-toggle button[nbButton].icon-start.icon-end{padding:0}.docs-browse-breadcrumb{display:flex;align-items:center;flex-wrap:wrap;gap:.125rem;margin-top:-.25rem;font-size:var(--docs-meta-size, .75rem)}.docs-browse-breadcrumb button[nbButton]{display:inline-flex;align-items:center;justify-content:center;height:1.5rem;min-height:1.5rem;max-width:14rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem);font-weight:500;line-height:1;color:var(--docs-text-muted, var(--text-hint-color))}.docs-browse-breadcrumb button[nbButton] .docs-crumb-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-browse-breadcrumb button[nbButton][disabled]{color:var(--docs-text, var(--text-basic-color));opacity:1}.docs-browse-breadcrumb .docs-crumb-sep{flex:0 0 auto;display:inline-flex;align-items:center;font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color));opacity:.7}.docs-browse-breadcrumb .docs-crumb-restricted,.docs-browse-breadcrumb button[nbButton].docs-crumb-restricted[disabled]{font-style:italic;color:var(--docs-text-muted, var(--text-hint-color))}.docs-browse-toolbar{display:flex;flex-direction:column;gap:.625rem}.pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}.docs-empty-host{display:block;min-height:14rem;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))}@media(max-width:767px){.docs-browse-header{align-items:flex-start}.docs-browse-header .docs-browse-actions{width:100%}.docs-browse-actions button[nbButton]{flex:0 1 auto}.docs-browse-toolbar{padding:.625rem}.pagination-container{justify-content:center}}.docs-browse .pagination-container ::ng-deep ga-pagination nav{margin-top:0!important;gap:.75rem}.docs-browse .pagination-container ::ng-deep ga-pagination .pagination{gap:.125rem;font-size:var(--docs-meta-size, .75rem)}.docs-browse .pagination-container ::ng-deep ga-pagination li a,.docs-browse .pagination-container ::ng-deep ga-pagination li span{margin:0}.docs-browse .pagination-container ::ng-deep ga-pagination li span{display:flex;align-items:center;justify-content:center;min-width:var(--docs-control-height-sm, 1.75rem);height:var(--docs-control-height-sm, 1.75rem);padding:0 .375rem;font-size:var(--docs-meta-size, .75rem);line-height:1;border-radius:var(--docs-radius, .375rem)}.docs-browse .pagination-container ::ng-deep ga-pagination li span.icon{padding:0;background:var(--docs-hover, rgba(126, 126, 143, .12));box-shadow:none}.docs-browse .pagination-container ::ng-deep ga-pagination li span.icon nb-icon{font-size:.875rem}.docs-browse .pagination-container ::ng-deep ga-pagination li:hover span.icon{background:var(--docs-active, rgba(126, 126, 143, .2))}.docs-browse .pagination-container ::ng-deep ga-pagination li.disabled{opacity:.4;pointer-events:none}.docs-browse .pagination-container ::ng-deep ga-pagination li.active span{background:var(--docs-active, rgba(126, 126, 143, .2));color:var(--docs-text, var(--text-basic-color));font-weight:600}.docs-browse .pagination-container ::ng-deep ga-pagination>nav>div{gap:.5rem;font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-browse .pagination-container ::ng-deep ga-pagination nb-select .select-button{min-width:4rem;height:var(--docs-control-height-sm, 1.75rem);padding:0 .5rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}\n"], dependencies: [{ kind: "directive", type: i11.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i11.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i12.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i9.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i9.NbContextMenuDirective, selector: "[nbContextMenu]", inputs: ["nbContextMenuPlacement", "nbContextMenuAdjustment", "nbContextMenuTag", "nbContextMenu", "nbContextMenuTrigger", "nbContextMenuClass"] }, { kind: "component", type: i9.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i9.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i9.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i13.PaginationComponent, selector: "ga-pagination", inputs: ["totalItems", "activePage", "itemsPerPage", "doEmit"], outputs: ["selectedPage", "selectedOption"] }, { kind: "component", type: i14.DocsTableComponent, selector: "gz-docs-table", inputs: ["rows", "loading", "selectable", "reviewMode"], outputs: ["rowClicked", "folderOpened", "selectionChanged", "sortChanged", "retryRequested", "previewRequested", "editorRequested"] }, { kind: "component", type: i15.DocsCardsComponent, selector: "gz-docs-cards", inputs: ["rows", "totalCount", "loading", "flat", "breadcrumb", "activeId"], outputs: ["open", "preview", "openEditor", "drillIn", "loadMore"] }, { kind: "component", type: i16.DocsFilterBarComponent, selector: "gz-docs-filter-bar", inputs: ["facets", "value", "urlParams", "presetCounts"], outputs: ["filterChange", "searchChange", "clearAll", "applyView", "presetToggled"] }, { kind: "component", type: i17.DocsStatsLineComponent, selector: "gz-docs-stats-line" }, { kind: "component", type: i18.DocsDropStripComponent, selector: "gz-docs-drop-strip", inputs: ["active", "maxFileSizeBytes", "maxFiles", "accept"], outputs: ["browse"] }, { kind: "directive", type: i19.UploadDropzoneDirective, selector: "[gzDocsUploadDropzone]", outputs: ["filesDropped", "dragActiveChange"] }, { kind: "component", type: i20.UploadProgressComponent, selector: "gz-docs-upload-progress", inputs: ["items"], outputs: ["retry", "dismiss", "clearFinished"] }, { kind: "component", type: i21.BulkBarComponent, selector: "gz-docs-bulk-bar", inputs: ["selectedIds", "reviewMode"], outputs: ["completed", "cleared"] }, { kind: "component", type: i22.EmptyStateComponent, selector: "gz-docs-empty-state", inputs: ["variant"], outputs: ["primaryAction"] }, { kind: "pipe", type: i11.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
DocsBrowsePageComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        ActivatedRoute,
        Router,
        Actions,
        DocumentsStore,
        DocumentsQuery,
        DocumentsService,
        DocumentTreeStore,
        UploadQueueService,
        NbDialogService,
        NbMenuService,
        ToastrService,
        NbToastrService,
        Store])
], DocsBrowsePageComponent);
export { DocsBrowsePageComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsBrowsePageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-browse-page', standalone: false, template: "<div class=\"docs-browse\" gzDocsUploadDropzone (filesDropped)=\"onFilesPicked($event)\" (dragActiveChange)=\"onDropActiveChange($event)\">\n\t<!-- Page-wide drop overlay -->\n\t<div class=\"docs-drop-overlay\" *ngIf=\"dropActive\">\n\t\t<nb-icon icon=\"cloud-upload-outline\"></nb-icon>\n\t\t<span>{{ 'DOCS.UPLOAD.DROP_HINT' | translate }}</span>\n\t</div>\n\n\t<!-- Hidden multi file input -->\n\t<input\n\t\t#fileInput\n\t\tid=\"docs-browse-file-input\"\n\t\ttype=\"file\"\n\t\tmultiple\n\t\thidden\n\t\t[accept]=\"uploadAccept\"\n\t\t[attr.aria-label]=\"'DOCS.UPLOAD.BUTTON' | translate\"\n\t\t(change)=\"onFilesPicked(fileInput.files)\"\n\t/>\n\n\t<!-- Header -->\n\t<div class=\"docs-browse-header\">\n\t\t<h4 class=\"docs-browse-title\">{{ 'DOCS.TITLE' | translate }}</h4>\n\t\t<div class=\"docs-browse-actions\">\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.review\">\n\t\t\t\t<button nbButton size=\"small\" appearance=\"ghost\" (click)=\"goToReviewQueue()\">\n\t\t\t\t\t<nb-icon icon=\"checkmark-circle-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.REVIEW.QUEUE_TITLE' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t\t<!-- View toggle \u2014 persisted via ComponentEnum.DOCUMENTS_HUB.\n\t\t\t     `<fieldset>` is the semantic grouping element (implicit `group` role); the inline\n\t\t\t     rules only neutralize the user-agent fieldset chrome so the layout is unchanged. -->\n\t\t\t<fieldset\n\t\t\t\tclass=\"docs-view-toggle\"\n\t\t\t\tstyle=\"border: 0; padding: 0; margin-inline: 0; min-inline-size: 0\"\n\t\t\t\t[attr.aria-label]=\"'DOCS.VIEWS.TOGGLE_LABEL' | translate\"\n\t\t\t>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[status]=\"isCardsView ? 'basic' : 'primary'\"\n\t\t\t\t\t[appearance]=\"isCardsView ? 'outline' : 'filled'\"\n\t\t\t\t\t[attr.aria-pressed]=\"!isCardsView\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.VIEWS.TABLE' | translate\"\n\t\t\t\t\t(click)=\"setLayout(layoutStyles.TABLE)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"list-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[status]=\"isCardsView ? 'primary' : 'basic'\"\n\t\t\t\t\t[appearance]=\"isCardsView ? 'filled' : 'outline'\"\n\t\t\t\t\t[attr.aria-pressed]=\"isCardsView\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.VIEWS.CARDS' | translate\"\n\t\t\t\t\t(click)=\"setLayout(layoutStyles.CARDS_GRID)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"grid-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</fieldset>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.create\">\n\t\t\t\t<!-- `New \u25BE` (`01-ux-spec.md` \u00A72): Folder | Page. A folder was previously\n\t\t\t\t     unreachable from here, so a brand-new organization \u2014 whose tree is empty and\n\t\t\t\t     whose only other create affordance is a node context menu that needs an\n\t\t\t\t     existing node \u2014 had no way to create its first folder at all. -->\n\t\t\t\t<button\n\t\t\t\t\t#newMenuTrigger\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tappearance=\"outline\"\n\t\t\t\t\t[nbContextMenu]=\"newMenu\"\n\t\t\t\t\t[nbContextMenuTag]=\"newMenuTag\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.NEW_MENU' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.TREE.NEW' | translate }}\n\t\t\t\t\t<nb-icon icon=\"chevron-down-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button nbButton size=\"small\" status=\"primary\" (click)=\"openUploadFlow()\">\n\t\t\t\t\t<nb-icon icon=\"upload-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.UPLOAD.BUTTON' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t</div>\n\t</div>\n\n\t<!-- Location breadcrumb (`00-product-spec.md` \u00A76.9 R-TRE-01 / `01-ux-spec.md` \u00A72).\n\t     Page-level on purpose: it used to live inside `gz-docs-cards`, which meant it\n\t     vanished in the table layout (the default) and on an empty folder \u2014 both of\n\t     which render below the `rows.length` switch \u2014 leaving a drilled-in user with no\n\t     indication of where they were and no way back to the root.\n\t     Hidden in flat-results mode: a search drops the folder scope server-side, so a\n\t     path would misrepresent the rows (same rule the cards row applied). -->\n\t<nav\n\t\tclass=\"docs-browse-breadcrumb\"\n\t\t*ngIf=\"!isFlat(query.filter$ | async)\"\n\t\t[attr.aria-label]=\"'DOCS.A11Y.BREADCRUMB' | translate\"\n\t>\n\t\t<button nbButton ghost size=\"tiny\" [disabled]=\"!breadcrumb.length\" (click)=\"onDrillIn(null)\">\n\t\t\t<span class=\"docs-crumb-label\">{{ 'DOCS.CARDS.BREADCRUMB_ROOT' | translate }}</span>\n\t\t</button>\n\t\t<ng-container *ngFor=\"let crumb of breadcrumb; let last = last\">\n\t\t\t<nb-icon icon=\"chevron-right-outline\" class=\"docs-crumb-sep\"></nb-icon>\n\t\t\t<!-- A redacted ancestor keeps the depth of the path but never its name, and\n\t\t\t     is not navigable \u2014 the caller has no read access to it. -->\n\t\t\t<button\n\t\t\t\tnbButton\n\t\t\t\tghost\n\t\t\t\tsize=\"tiny\"\n\t\t\t\t[disabled]=\"last || crumb.restricted || !crumb.id\"\n\t\t\t\t[class.docs-crumb-restricted]=\"crumb.restricted\"\n\t\t\t\t[nbTooltip]=\"crumb.restricted ? ('DOCS.BREADCRUMB.RESTRICTED' | translate) : crumb.name\"\n\t\t\t\t(click)=\"onCrumbClick(crumb)\"\n\t\t\t>\n\t\t\t\t<span class=\"docs-crumb-label\">\n\t\t\t\t\t{{ crumb.restricted ? ('DOCS.BREADCRUMB.RESTRICTED' | translate) : crumb.name }}\n\t\t\t\t</span>\n\t\t\t</button>\n\t\t</ng-container>\n\t</nav>\n\n\t<!-- Stats tiles \u2014 org-global on purpose (the preset chips' counts are the\n\t     filter-relative numbers); hides itself when the endpoint is unavailable. -->\n\t<gz-docs-stats-line #statsLine></gz-docs-stats-line>\n\n\t<div class=\"docs-browse-toolbar\">\n\t\t<gz-docs-filter-bar\n\t\t\t[facets]=\"query.facets$ | async\"\n\t\t\t[value]=\"query.filter$ | async\"\n\t\t\t[urlParams]=\"urlParams\"\n\t\t\t[presetCounts]=\"query.presetCounts$ | async\"\n\t\t\t(filterChange)=\"onFilterChange($event)\"\n\t\t\t(searchChange)=\"onSearchChange($event)\"\n\t\t\t(clearAll)=\"onClearAll()\"\n\t\t\t(applyView)=\"onApplySavedView($event)\"\n\t\t\t(presetToggled)=\"onPresetToggled($event)\"\n\t\t></gz-docs-filter-bar>\n\t</div>\n\n\t<!-- Always-visible drop strip. VISUAL-ONLY: the page-root gzDocsUploadDropzone\n\t     owns every drop (a second directive instance would double-fire); the strip\n\t     mirrors its drag state and clicks through to the same upload flow. -->\n\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.create\">\n\t\t<gz-docs-drop-strip\n\t\t\t[active]=\"dropActive\"\n\t\t\t[maxFileSizeBytes]=\"uploadQueue.maxFileSizeBytes\"\n\t\t\t[maxFiles]=\"uploadQueue.maxFilesPerUpload\"\n\t\t\t[accept]=\"uploadAccept\"\n\t\t\t(browse)=\"openUploadFlow()\"\n\t\t></gz-docs-drop-strip>\n\t</ng-template>\n\n\t<!-- Upload progress -->\n\t<gz-docs-upload-progress\n\t\t[items]=\"uploadQueue.items$ | async\"\n\t\t(retry)=\"uploadQueue.retry($event)\"\n\t\t(dismiss)=\"uploadQueue.dismiss($event)\"\n\t\t(clearFinished)=\"uploadQueue.clearFinished()\"\n\t></gz-docs-upload-progress>\n\n\t<!-- Content -->\n\t<ng-container *ngIf=\"query.rows$ | async as rows\">\n\t\t<ng-container *ngIf=\"rows.length; else emptyState\">\n\t\t\t<!-- Cards view -->\n\t\t\t<gz-docs-cards\n\t\t\t\t*ngIf=\"isCardsView; else tableView\"\n\t\t\t\t[rows]=\"rows\"\n\t\t\t\t[totalCount]=\"(query.totalCount$ | async) || 0\"\n\t\t\t\t[loading]=\"(query.loading$ | async) === true\"\n\t\t\t\t[flat]=\"isFlat(query.filter$ | async)\"\n\t\t\t\t[activeId]=\"query.detailId$ | async\"\n\t\t\t\t(open)=\"onRowClicked($event)\"\n\t\t\t\t(preview)=\"openPreview($event)\"\n\t\t\t\t(openEditor)=\"openEditor($event)\"\n\t\t\t\t(drillIn)=\"onDrillIn($event)\"\n\t\t\t\t(loadMore)=\"onLoadMore()\"\n\t\t\t></gz-docs-cards>\n\n\t\t\t<!-- Table view -->\n\t\t\t<ng-template #tableView>\n\t\t\t\t<gz-docs-table\n\t\t\t\t\t[rows]=\"rows\"\n\t\t\t\t\t[loading]=\"(query.loading$ | async) === true\"\n\t\t\t\t\t[selectable]=\"canManage\"\n\t\t\t\t\t(rowClicked)=\"onRowClicked($event)\"\n\t\t\t\t\t(folderOpened)=\"onFolderOpened($event)\"\n\t\t\t\t\t(selectionChanged)=\"onSelectionChanged($event)\"\n\t\t\t\t\t(sortChanged)=\"onSortChanged($event)\"\n\t\t\t\t\t(retryRequested)=\"onRetryRequested($event)\"\n\t\t\t\t\t(previewRequested)=\"openPreview($event)\"\n\t\t\t\t\t(editorRequested)=\"openEditor($event)\"\n\t\t\t\t></gz-docs-table>\n\n\t\t\t\t<div class=\"pagination-container\">\n\t\t\t\t\t<ga-pagination\n\t\t\t\t\t\t[totalItems]=\"pagination?.totalItems\"\n\t\t\t\t\t\t[activePage]=\"pagination?.activePage\"\n\t\t\t\t\t\t[itemsPerPage]=\"pagination?.itemsPerPage\"\n\t\t\t\t\t\t[doEmit]=\"false\"\n\t\t\t\t\t\t(selectedOption)=\"onUpdateOption($event)\"\n\t\t\t\t\t\t(selectedPage)=\"onPageChange($event)\"\n\t\t\t\t\t></ga-pagination>\n\t\t\t\t</div>\n\t\t\t</ng-template>\n\t\t</ng-container>\n\n\t\t<ng-template #emptyState>\n\t\t\t<div [nbSpinner]=\"(query.loading$ | async) === true\" nbSpinnerStatus=\"primary\" class=\"docs-empty-host\">\n\t\t\t\t<gz-docs-empty-state\n\t\t\t\t\t*ngIf=\"(query.loading$ | async) !== true\"\n\t\t\t\t\t[variant]=\"emptyVariant(rows, (query.error$ | async) === true)\"\n\t\t\t\t\t(primaryAction)=\"onEmptyAction($event)\"\n\t\t\t\t></gz-docs-empty-state>\n\t\t\t</div>\n\t\t</ng-template>\n\t</ng-container>\n\n\t<!-- Bulk bar -->\n\t<gz-docs-bulk-bar\n\t\t[selectedIds]=\"(query.selection$ | async) || []\"\n\t\t(completed)=\"onBulkCompleted($event)\"\n\t\t(cleared)=\"onClearSelection()\"\n\t></gz-docs-bulk-bar>\n</div>\n", styles: [".docs-browse{position:relative;display:flex;flex-direction:column;gap:var(--docs-section-gap, 1rem);padding:var(--docs-page-padding, 1.25rem);min-height:100%;color:var(--docs-text, var(--text-basic-color))}.docs-drop-overlay{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;border:2px dashed var(--color-primary-default);border-radius:var(--docs-radius-lg, .5rem);background:var(--color-primary-transparent-100, rgba(51, 102, 255, .08));color:var(--color-primary-default);font-size:var(--docs-body-size, .8125rem);font-weight:600;pointer-events:none}.docs-drop-overlay nb-icon{font-size:2.25rem}.docs-browse-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem 1rem;flex-wrap:wrap;min-height:2rem}.docs-browse-header .docs-browse-title{flex:1 1 12rem;min-width:0;margin:0;font-size:.9375rem;font-weight:var(--docs-title-weight, 600);line-height:1.375rem;letter-spacing:var(--gauzy-page-title-letter-spacing, -.01em);color:var(--docs-text, var(--text-basic-color));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-browse-header .docs-browse-actions{display:flex;align-items:center;flex-wrap:wrap;gap:.375rem}.docs-browse-actions button[nbButton]{display:inline-flex;align-items:center;justify-content:center;gap:.375rem;height:var(--docs-control-height-sm, 1.75rem);min-height:var(--docs-control-height-sm, 1.75rem);font-size:var(--docs-meta-size, .75rem);font-weight:500;line-height:1;white-space:nowrap}.docs-browse-actions button[nbButton] nb-icon{margin:0;font-size:.875rem;line-height:1}.docs-view-toggle{display:inline-flex;align-items:center;gap:.25rem}.docs-view-toggle button[nbButton]{width:var(--docs-control-height-sm, 1.75rem)}.docs-browse .docs-browse-actions button[nbButton],.docs-browse .docs-browse-breadcrumb button[nbButton]{padding-block:0}.docs-browse .docs-browse-actions button[nbButton]{padding-inline:.5625rem}.docs-browse .docs-browse-breadcrumb button[nbButton]{padding-inline:.375rem}.docs-browse .docs-browse-actions button[nbButton].icon-start.icon-end{padding-block:0;padding-inline:.5625rem}.docs-browse .docs-view-toggle button[nbButton].icon-start.icon-end{padding:0}.docs-browse-breadcrumb{display:flex;align-items:center;flex-wrap:wrap;gap:.125rem;margin-top:-.25rem;font-size:var(--docs-meta-size, .75rem)}.docs-browse-breadcrumb button[nbButton]{display:inline-flex;align-items:center;justify-content:center;height:1.5rem;min-height:1.5rem;max-width:14rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem);font-weight:500;line-height:1;color:var(--docs-text-muted, var(--text-hint-color))}.docs-browse-breadcrumb button[nbButton] .docs-crumb-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-browse-breadcrumb button[nbButton][disabled]{color:var(--docs-text, var(--text-basic-color));opacity:1}.docs-browse-breadcrumb .docs-crumb-sep{flex:0 0 auto;display:inline-flex;align-items:center;font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color));opacity:.7}.docs-browse-breadcrumb .docs-crumb-restricted,.docs-browse-breadcrumb button[nbButton].docs-crumb-restricted[disabled]{font-style:italic;color:var(--docs-text-muted, var(--text-hint-color))}.docs-browse-toolbar{display:flex;flex-direction:column;gap:.625rem}.pagination-container{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:.5rem;margin-top:.25rem}.docs-empty-host{display:block;min-height:14rem;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))}@media(max-width:767px){.docs-browse-header{align-items:flex-start}.docs-browse-header .docs-browse-actions{width:100%}.docs-browse-actions button[nbButton]{flex:0 1 auto}.docs-browse-toolbar{padding:.625rem}.pagination-container{justify-content:center}}.docs-browse .pagination-container ::ng-deep ga-pagination nav{margin-top:0!important;gap:.75rem}.docs-browse .pagination-container ::ng-deep ga-pagination .pagination{gap:.125rem;font-size:var(--docs-meta-size, .75rem)}.docs-browse .pagination-container ::ng-deep ga-pagination li a,.docs-browse .pagination-container ::ng-deep ga-pagination li span{margin:0}.docs-browse .pagination-container ::ng-deep ga-pagination li span{display:flex;align-items:center;justify-content:center;min-width:var(--docs-control-height-sm, 1.75rem);height:var(--docs-control-height-sm, 1.75rem);padding:0 .375rem;font-size:var(--docs-meta-size, .75rem);line-height:1;border-radius:var(--docs-radius, .375rem)}.docs-browse .pagination-container ::ng-deep ga-pagination li span.icon{padding:0;background:var(--docs-hover, rgba(126, 126, 143, .12));box-shadow:none}.docs-browse .pagination-container ::ng-deep ga-pagination li span.icon nb-icon{font-size:.875rem}.docs-browse .pagination-container ::ng-deep ga-pagination li:hover span.icon{background:var(--docs-active, rgba(126, 126, 143, .2))}.docs-browse .pagination-container ::ng-deep ga-pagination li.disabled{opacity:.4;pointer-events:none}.docs-browse .pagination-container ::ng-deep ga-pagination li.active span{background:var(--docs-active, rgba(126, 126, 143, .2));color:var(--docs-text, var(--text-basic-color));font-weight:600}.docs-browse .pagination-container ::ng-deep ga-pagination>nav>div{gap:.5rem;font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-browse .pagination-container ::ng-deep ga-pagination nb-select .select-button{min-width:4rem;height:var(--docs-control-height-sm, 1.75rem);padding:0 .5rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.Actions }, { type: i4.DocumentsStore }, { type: i5.DocumentsQuery }, { type: i6.DocumentsService }, { type: i7.DocumentTreeStore }, { type: i8.UploadQueueService }, { type: i9.NbDialogService }, { type: i9.NbMenuService }, { type: i10.ToastrService }, { type: i9.NbToastrService }, { type: i10.Store }], propDecorators: { fileInput: [{
                type: ViewChild,
                args: ['fileInput']
            }], newMenuTrigger: [{
                type: ViewChild,
                args: ['newMenuTrigger', { read: ElementRef }]
            }], statsLine: [{
                type: ViewChild,
                args: ['statsLine']
            }], onDocumentKeydown: [{
                type: HostListener,
                args: ['document:keydown', ['$event']]
            }] } });
//# sourceMappingURL=docs-browse-page.component.js.map