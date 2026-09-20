import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, HostListener, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbDialogService, NbIconModule, NbInputModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Actions } from '@ngneat/effects-ng';
import { NgxPermissionsModule } from 'ngx-permissions';
import { distinctUntilChanged, filter, firstValueFrom, map } from 'rxjs';
import { BaseEntityEnum, DocumentKindEnum, DocumentReviewStatusEnum, PermissionsEnum } from '@gauzy/contracts';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { FavoriteToggleModule } from '@gauzy/ui-core/shared';
import { DocumentsActions } from '../../+state/documents.actions';
import { BlockCommentThreadComponent } from '../../editor/comments/block-comment-thread.component';
import { DocumentEditorComponent } from '../../editor/document-editor.component';
import { DOCS_EDITOR_SCHEMA_VERSION } from '../../editor/editor.constants';
import { DocumentStaticViewComponent } from '../../editor/read-only/document-static-view.component';
import { VersionHistoryPanelComponent } from '../../editor/version-history/version-history-panel.component';
import { MoveDialogComponent } from '../../dialogs/move-dialog.component';
import { RequestReviewDialogComponent } from '../../dialogs/request-review-dialog.component';
import { DocumentShareDialogComponent } from '../../dialogs/share-dialog.component';
import { DocsExportService } from '../../services/docs-export.service';
import { DocumentPermissionService } from '../../services/document-permission.service';
import { DocumentTreeStore } from '../../services/document-tree.store';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "ngx-permissions";
import * as i4 from "@nebular/theme";
import * as i5 from "@gauzy/ui-core/shared";
import * as i6 from "@ngx-translate/core";
/** How long to keep retrying a `?block=` deep link while the editor paints (spec 05 §8). */
const BLOCK_ANCHOR_RETRIES = 10;
const BLOCK_ANCHOR_RETRY_MS = 150;
/**
 * Page editor chrome (UX spec §10 / spec 04 §4.8) hosting `gz-document-editor`:
 * breadcrumbs, icon + inline title, favorite star, lock toggle, autosave pill,
 * overflow menu (full width, copy link/markdown, save version now, invisibles,
 * duplicate, move, archive, version history), ToC + Info right rail, conflict /
 * locked / read-only banners. Lazily loaded — the whole editor stack is one
 * chunk behind this route (spec 05 §12).
 */
export class DocumentPageComponent {
    constructor() {
        this.route = inject(ActivatedRoute);
        this.router = inject(Router);
        this.documentsService = inject(DocumentsService);
        this.exportService = inject(DocsExportService);
        this.treeStore = inject(DocumentTreeStore);
        this.documentPermission = inject(DocumentPermissionService);
        this.dialogService = inject(NbDialogService);
        this.toastrService = inject(ToastrService);
        this.translate = inject(TranslateService);
        this.store = inject(Store);
        this.actions = inject(Actions);
        this.cdr = inject(ChangeDetectorRef);
        this.destroyRef = inject(DestroyRef);
        this.favoriteEntity = BaseEntityEnum.Document;
        this.PermissionsEnum = PermissionsEnum;
        this.document = null;
        this.loading = false;
        this.loadError = false;
        this.saveState = 'idle';
        this.stats = null;
        this.tocAnchors = [];
        this.breadcrumbs = [];
        this.railTab = 'toc';
        this.railOpen = true;
        this.versionsOpen = false;
        this.menuOpen = false;
        this.iconPickerOpen = false;
        this.fullWidth = false;
        this.titleDraft = '';
        this.iconDraft = '';
        // ─── Block comments (spec 05 §8) ─────────────────────────────
        /** The block whose thread the Comments rail is showing; `null` lists them all. */
        this.commentBlockId = null;
        /** `blockId`s the editor currently holds — lets the rail flag detached threads. */
        this.knownBlockIds = [];
        /** A `?block=` deep link waiting for the editor to paint. */
        this.pendingBlockAnchor = null;
        /** `metadata.schemaVersion` of the loaded content — drives the "newer format" banner. */
        this.contentSchemaVersion = null;
    }
    get canUpdate() {
        return this.store.hasAnyPermission(PermissionsEnum.DOCS_UPDATE);
    }
    /**
     * Row-level ownership scope of the open document (`08-permissions-security.md` §1.7):
     * `DOCS_MANAGE` holder or its creator.
     */
    get canMutate() {
        return this.documentPermission.canMutate(this.document);
    }
    /**
     * Both halves of the server's write rule — `DOCS_UPDATE` **and** the ownership scope.
     *
     * 🛑 The permission alone is not enough: `assertCanWrite()` (`plugins/docs/.../
     * document.service.ts`) answers `403 DOCS_WRITE_FORBIDDEN` for a non-creator without
     * `DOCS_MANAGE`, so gating the chrome on `canUpdate` alone opened a fully live editor whose
     * every autosave failed. This is what the read-only banner and the write controls read.
     */
    get canWrite() {
        return this.canUpdate && this.canMutate;
    }
    get isLocked() {
        return !!this.document?.isLocked || this.saveState === 'locked';
    }
    get editable() {
        return this.canWrite && !this.isLocked && this.saveState !== 'conflict' && !this.document?.archivedAt;
    }
    get isPage() {
        return this.document?.kind === DocumentKindEnum.PAGE;
    }
    get isPendingReview() {
        return this.document?.reviewStatus === DocumentReviewStatusEnum.PENDING;
    }
    /**
     * A manual review request is what makes the queue reachable with AI off, so
     * the editor offers it too — but never while the document is already PENDING
     * (the menu shows that state instead; the backend would no-op) nor once it is
     * archived.
     */
    get canRequestReview() {
        return !!this.document && !this.isPendingReview && !this.document.archivedAt;
    }
    ngOnInit() {
        // The route parameter is the single trigger for loading. Angular reuses this
        // component instance across `page/:id` navigations (duplicate, breadcrumb, a
        // mention link), so anything that navigates only has to navigate — the old
        // `setTimeout(() => load())` hacks raced the router and are gone.
        this.route.paramMap
            .pipe(map((params) => params.get('id')), filter((id) => !!id), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe((id) => void this.load(id));
        // `?block=` deep link (spec 05 §8): scroll to the block, flash it, and open its
        // thread. Tracked separately from `:id` so a link to another block of the SAME
        // document still fires (the `:id` stream is `distinctUntilChanged`).
        this.route.queryParamMap
            .pipe(map((params) => params.get('block')), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe((blockId) => {
            this.pendingBlockAnchor = blockId;
            if (!blockId)
                return;
            this.openCommentsFor(blockId);
            // Also fire here, not only from `load()`: a link to another block of the SAME
            // document leaves `:id` untouched, so nothing would reload and the scroll
            // would never run. Bounded retries, and the first one to succeed clears the
            // pending anchor, so the two chains cannot fight.
            this.applyPendingBlockAnchor();
        });
    }
    ngOnDestroy() {
        // Best-effort flush of pending edits when leaving the route. The route's
        // `canDeactivate` guard is what actually *waits* for it — this only covers the
        // paths that bypass the router (see `docs-unsaved-changes.guard.ts`).
        void this.editorComponent?.flush();
    }
    // ─── Unsaved-changes guard API (spec 04 §3.3 / spec 05 §9.2) ──
    /** True while the editor holds edits the server has not acknowledged. */
    get hasUnsavedChanges() {
        return !!this.editorComponent?.autosave.isDirty;
    }
    /**
     * Flushes pending edits and reports whether they landed.
     *
     * `false` means the guard must ask before discarding — a 409 conflict freeze, a 423
     * lock, or an offline backoff all leave the content only in the browser.
     */
    flushPendingChanges() {
        return this.editorComponent ? this.editorComponent.flush() : Promise.resolve(true);
    }
    /** Flush while dirty on tab close (spec 05 §9.2 beforeunload guard). */
    onBeforeUnload(event) {
        if (this.editorComponent?.autosave.isDirty) {
            void this.editorComponent.flush();
            event.preventDefault();
        }
    }
    onVisibilityChange() {
        if (document.visibilityState === 'hidden')
            void this.editorComponent?.flush();
    }
    // ─── Loading ─────────────────────────────────────────────────
    async load(id = this.route.snapshot.paramMap.get('id')) {
        if (!id)
            return;
        const switching = !!this.document && String(this.document.id) !== String(id);
        // Pending edits belong to the document being left — save them while the
        // editor still holds it, never after the input has been swapped.
        if (switching)
            await this.editorComponent?.flush();
        this.loading = true;
        this.loadError = false;
        if (switching) {
            // Per-document chrome must not survive the swap.
            this.saveState = 'idle';
            this.stats = null;
            this.tocAnchors = [];
            this.breadcrumbs = [];
            this.versionsOpen = false;
            this.menuOpen = false;
            this.commentBlockId = null;
            this.knownBlockIds = [];
        }
        try {
            const loaded = await firstValueFrom(this.documentsService.getById(id, ['categories', 'tags']));
            // A 200 whose body is not a document (an API-side error serialised as `{ message }`)
            // must NOT become an "Untitled" editor whose every save PUTs to `/documents/undefined`.
            if (!loaded?.id) {
                throw new Error(`Document ${id} could not be loaded: response carries no id`);
            }
            this.document = loaded;
            this.titleDraft = this.document?.name ?? '';
            this.iconDraft = this.document?.icon ?? '';
            await this.loadBreadcrumbs();
        }
        catch (error) {
            // Every failure mode lands on the same banner — an org-scope 400, a 403, a genuine
            // 404 and a 500 are indistinguishable to the user. Keep the HttpErrorResponse in the
            // console so the actual cause stays diagnosable instead of masquerading as a bundle
            // failure.
            console.error('Document load failed', error);
            // When SWITCHING documents the route already points at the NEW id: never leave the
            // previous document behind as `this.document`, or the chrome actions (rename, lock,
            // archive…) would hit it. A failed same-id reload (Retry, a move) keeps what is loaded.
            if (switching) {
                this.document = null;
                this.titleDraft = '';
                this.iconDraft = '';
            }
            this.loadError = true;
        }
        finally {
            this.loading = false;
            this.cdr.markForCheck();
            this.applyPendingBlockAnchor();
        }
    }
    async loadBreadcrumbs() {
        if (!this.document)
            return;
        try {
            // Walk ancestors into the tree store cache so pathOf resolves.
            await this.treeStore.loadRoots();
            let parentId = this.document.parentId ?? null;
            const guard = new Set();
            while (parentId && !guard.has(String(parentId))) {
                guard.add(String(parentId));
                const node = this.treeStore.getNode(parentId);
                await this.treeStore.loadChildren(parentId);
                parentId = node?.parentId ?? null;
            }
            this.breadcrumbs = this.document.parentId ? this.treeStore.pathOf(this.document.parentId) : [];
        }
        catch {
            this.breadcrumbs = [];
        }
    }
    // ─── Editor events ───────────────────────────────────────────
    onSaveStateChanged(state) {
        this.saveState = state;
        this.cdr.markForCheck();
    }
    onStatsChanged(stats) {
        this.stats = stats;
        this.cdr.markForCheck();
    }
    onTocChanged(anchors) {
        this.tocAnchors = anchors;
        this.cdr.markForCheck();
    }
    /**
     * The loaded content's `metadata.schemaVersion` (spec 05 §9.1). `null` = saved before the
     * stamp existed, which is older than v1, never newer.
     */
    onSchemaVersionChanged(version) {
        this.contentSchemaVersion = version;
        this.cdr.markForCheck();
    }
    /**
     * True when this build's extension set is OLDER than the one that wrote the content.
     *
     * 🛑 Saving here would round-trip the JSON through a schema that does not know the newer
     * node types and quietly drop them (spec 05 §9.1: "unknown node types throw on JSON load
     * — never ship a schema change without a loader shim"). The banner is the warning; the
     * shim itself belongs to whichever release bumps the version.
     */
    get schemaAhead() {
        return (this.contentSchemaVersion ?? 0) > DOCS_EDITOR_SCHEMA_VERSION;
    }
    scrollToAnchor(anchor) {
        anchor.dom?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // ─── Comments rail (spec 01 §10.5 / spec 05 §8) ──────────────
    /** Opens the Comments tab. Without a block in focus it lists every anchored thread. */
    openCommentsTab() {
        this.railTab = 'comments';
        this.railOpen = true;
        this.versionsOpen = false;
        this.commentBlockId = null;
        this.refreshKnownBlocks();
    }
    /** The bubble menu's comment action, a gutter marker, or a `?block=` deep link. */
    openCommentsFor(blockId) {
        this.railTab = 'comments';
        this.railOpen = true;
        this.versionsOpen = false;
        this.commentBlockId = blockId;
        this.refreshKnownBlocks();
        this.cdr.markForCheck();
    }
    /**
     * The rail reports which blocks still have an open thread; the editor turns them into
     * gutter markers. One fetch, one source of truth — the editor never queries comments.
     */
    onOpenCommentBlocks(blockIds) {
        this.editorComponent?.setCommentedBlocks(blockIds);
    }
    /** A thread header was clicked — jump to its block in the canvas. */
    onCommentBlockFocused(blockId) {
        this.editorComponent?.highlightBlock(blockId);
    }
    /**
     * Re-reads the editor's block ids so the rail can tell a live thread from one whose
     * block was deleted. Cheap (a single doc walk) and only run when the rail is opened.
     */
    refreshKnownBlocks() {
        this.knownBlockIds = this.editorComponent?.getBlockIds() ?? [];
    }
    /**
     * Retries the `?block=` scroll until the editor has painted the block.
     *
     * The editor is constructed in `afterNextRender` and the document JSON only reaches it
     * once `load()` resolves, so the element a deep link points at does not exist when the
     * query param arrives. Bounded retries, then give up quietly — a stale link to a deleted
     * block must not spin.
     */
    applyPendingBlockAnchor(attempt = 0) {
        const blockId = this.pendingBlockAnchor;
        if (!blockId || !this.isPage)
            return;
        if (this.editorComponent?.highlightBlock(blockId)) {
            this.pendingBlockAnchor = null;
            return;
        }
        if (attempt >= BLOCK_ANCHOR_RETRIES) {
            this.pendingBlockAnchor = null;
            return;
        }
        setTimeout(() => this.applyPendingBlockAnchor(attempt + 1), BLOCK_ANCHOR_RETRY_MS);
    }
    // ─── Title / icon (autosaved separately from content — rename never bumps content versions) ──
    async saveTitle() {
        const name = this.titleDraft.trim();
        if (!this.document || !name || name === this.document.name) {
            this.titleDraft = this.document?.name ?? '';
            return;
        }
        try {
            this.document = await firstValueFrom(this.documentsService.update(this.document.id, { name }));
            this.treeStore.invalidate(this.document.parentId ?? null);
            this.toastrService.success(this.translate.instant('DOCS.TOASTS.RENAMED'));
        }
        catch {
            this.titleDraft = this.document?.name ?? '';
            this.toastrService.danger(this.translate.instant('DOCS.ERRORS.GENERIC_RETRY'));
        }
        this.cdr.markForCheck();
    }
    async saveIcon() {
        this.iconPickerOpen = false;
        const icon = this.iconDraft.trim();
        if (!this.document || icon === (this.document.icon ?? ''))
            return;
        try {
            this.document = await firstValueFrom(this.documentsService.update(this.document.id, { icon }));
            this.treeStore.invalidate(this.document.parentId ?? null);
        }
        catch {
            this.iconDraft = this.document?.icon ?? '';
        }
        this.cdr.markForCheck();
    }
    // ─── Actions (⋯ menu) ────────────────────────────────────────
    async toggleLock() {
        if (!this.document)
            return;
        this.menuOpen = false;
        try {
            this.document = await firstValueFrom(
            // `isLocked` is accepted by the metadata update endpoint (UpdateDocumentDTO).
            this.documentsService.update(this.document.id, { isLocked: !this.document.isLocked }));
            // A save that hit the lock froze autosave with a 423; releasing the lock
            // here is the only thing short of a reload that can thaw it.
            if (!this.document?.isLocked)
                this.editorComponent?.lockReleased(this.document);
            this.toastrService.success(this.translate.instant('DOCS.TOASTS.UPDATED'));
        }
        catch {
            this.toastrService.danger(this.translate.instant('DOCS.ERRORS.GENERIC_RETRY'));
        }
        this.cdr.markForCheck();
    }
    async copyLink() {
        this.menuOpen = false;
        await navigator.clipboard.writeText(window.location.href);
        this.toastrService.success(this.translate.instant('DOCS.TOASTS.LINK_COPIED'));
    }
    /**
     * Copy / download / print all share one resolution path
     * (`DocsExportService`), fed the live editor output when an editor is
     * mounted. Handing it `markdown`/`html` from the editor keeps the export
     * byte-identical to what the user is looking at — including edits that have
     * not been autosaved yet — and skips the refetch + static re-render entirely.
     */
    exportSource() {
        return this.isPage
            ? { markdown: this.editorComponent?.getMarkdown(), html: this.editorComponent?.getHTML() }
            : {};
    }
    async copyMarkdown() {
        this.menuOpen = false;
        if (!this.document)
            return;
        const copied = await this.exportService.copyMarkdown(this.document, this.exportSource());
        this.toastrService.success(this.translate.instant(copied ? 'DOCS.TOASTS.MARKDOWN_COPIED' : 'DOCS.EXPORT.NOTHING_TO_EXPORT'));
    }
    /** Downloads the page as a `.md` file (spec 01 §10.9 "Export (Markdown now)"). */
    async exportMarkdown() {
        this.menuOpen = false;
        if (!this.document)
            return;
        const written = await this.exportService.downloadMarkdown(this.document, this.exportSource());
        if (!written)
            this.toastrService.warning(this.translate.instant('DOCS.EXPORT.NOTHING_TO_EXPORT'));
    }
    /** Print-CSS PDF path (spec 05 §9.1 tier 3 — the browser's "Save as PDF"). */
    async print() {
        this.menuOpen = false;
        if (!this.document)
            return;
        const printed = await this.exportService.print(this.document, this.exportSource());
        if (!printed)
            this.toastrService.warning(this.translate.instant('DOCS.EXPORT.NOTHING_TO_EXPORT'));
    }
    /** Share overlay + visibility toggle (spec 08 §3). */
    openShareDialog() {
        if (!this.document)
            return;
        this.menuOpen = false;
        this.dialogService
            .open(DocumentShareDialogComponent, { context: { document: this.document } })
            .onClose.subscribe((updated) => {
            if (updated) {
                this.document = { ...this.document, ...updated };
                this.cdr.markForCheck();
            }
        });
    }
    async saveVersionNow() {
        this.menuOpen = false;
        await this.editorComponent?.flush({ forceSnapshot: true });
    }
    toggleInvisibles() {
        this.menuOpen = false;
        this.editorComponent?.toggleInvisibleCharacters();
    }
    toggleFullWidth() {
        this.menuOpen = false;
        this.fullWidth = !this.fullWidth;
    }
    async duplicate() {
        if (!this.document)
            return;
        this.menuOpen = false;
        try {
            const copy = await firstValueFrom(this.documentsService.duplicate(this.document.id));
            this.treeStore.invalidate(this.document.parentId ?? null);
            this.toastrService.success(this.translate.instant('DOCS.TOASTS.DUPLICATED'));
            // The ':id' change is what reloads — see `ngOnInit`.
            void this.router.navigate(['..', copy.id], { relativeTo: this.route });
        }
        catch {
            this.toastrService.danger(this.translate.instant('DOCS.ERRORS.GENERIC_RETRY'));
        }
    }
    openMoveDialog() {
        if (!this.document)
            return;
        this.menuOpen = false;
        this.dialogService
            .open(MoveDialogComponent, { context: { documentIds: [this.document.id] } })
            .onClose.subscribe((moved) => {
            if (moved)
                void this.load();
        });
    }
    /**
     * Flags the page for a human review (`reviewReason='manual'`, optional reason)
     * — spec 01 §11. Patches the browse row and re-counts the facets so the
     * "Needs review" preset and the queue pick it up without a reload.
     */
    async requestReview() {
        if (!this.canRequestReview || !this.document)
            return;
        this.menuOpen = false;
        const result = await firstValueFrom(this.dialogService.open(RequestReviewDialogComponent).onClose);
        if (!result)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.requestReview(this.document.id, { reason: result.reason }));
            this.document = { ...this.document, ...document };
            this.toastrService.success(this.translate.instant('DOCS.TOASTS.REVIEW_REQUESTED'));
            this.actions.dispatch(DocumentsActions.rowChanged(this.document));
            this.actions.dispatch(DocumentsActions.refreshFacets());
        }
        catch {
            this.toastrService.danger(this.translate.instant('DOCS.ERRORS.GENERIC_RETRY'));
        }
        this.cdr.markForCheck();
    }
    async archive() {
        if (!this.document)
            return;
        this.menuOpen = false;
        try {
            await firstValueFrom(this.documentsService.archive(this.document.id));
            this.treeStore.invalidate(this.document.parentId ?? null);
            this.toastrService.success(this.translate.instant('DOCS.TOASTS.ARCHIVED'));
            this.back();
        }
        catch {
            this.toastrService.danger(this.translate.instant('DOCS.ERRORS.GENERIC_RETRY'));
        }
    }
    openVersions() {
        this.menuOpen = false;
        this.versionsOpen = true;
        this.railOpen = true;
    }
    onVersionRestored(document) {
        this.document = { ...this.document, ...document };
        this.editorComponent?.applyRemoteContent(document);
        // The restored revision has a different set of blocks, so every anchored thread's
        // "detached" verdict has to be re-derived (spec 05 §8).
        this.refreshKnownBlocks();
        this.cdr.markForCheck();
    }
    // ─── Conflict resolution (spec 05 §9.2 — no silent merge in v1) ──
    async conflictReload() {
        if (!this.document)
            return;
        try {
            const fresh = await firstValueFrom(this.documentsService.getById(this.document.id));
            this.document = fresh;
            this.editorComponent?.applyRemoteContent(fresh);
            // Someone else's edit may have deleted a commented block — re-derive the
            // anchors and re-read the thread rather than leaving a stale verdict.
            this.refreshKnownBlocks();
            void this.commentsPanel?.reload();
        }
        catch {
            this.toastrService.danger(this.translate.instant('DOCS.ERRORS.GENERIC_RETRY'));
        }
        this.cdr.markForCheck();
    }
    /** Duplicates the local (unsaved) content as a new PAGE sibling, then reloads. */
    async conflictKeepCopy() {
        if (!this.document || !this.editorComponent)
            return;
        try {
            const { id: organizationId, tenantId } = this.store.selectedOrganization ?? {};
            // The copy is created for its side effect only — the editor stays on this
            // document and reloads the server's version below.
            await firstValueFrom(this.documentsService.create({
                kind: DocumentKindEnum.PAGE,
                name: `${this.document.name} (${this.translate.instant('DOCS.EDITOR.CONFLICT_COPY_SUFFIX')})`,
                parentId: this.document.parentId ?? undefined,
                contentJson: this.editorComponent.getJSON() ?? undefined,
                contentHtml: this.editorComponent.getHTML(),
                organizationId,
                tenantId
            }));
            this.treeStore.invalidate(this.document.parentId ?? null);
            this.toastrService.success(this.translate.instant('DOCS.TOASTS.CREATED'));
            await this.conflictReload();
        }
        catch {
            this.toastrService.danger(this.translate.instant('DOCS.ERRORS.GENERIC_RETRY'));
        }
    }
    back() {
        void this.router.navigate(['..', '..'], { relativeTo: this.route });
    }
    openBreadcrumb(node) {
        if (node.kind === DocumentKindEnum.PAGE) {
            // The ':id' change is what reloads — see `ngOnInit`.
            void this.router.navigate(['..', node.id], { relativeTo: this.route });
        }
        else {
            void this.router.navigate(['../..'], { relativeTo: this.route, queryParams: { folder: node.id } });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentPageComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocumentPageComponent, isStandalone: true, selector: "gz-docs-page", host: { listeners: { "window:beforeunload": "onBeforeUnload($event)", "document:visibilitychange": "onVisibilityChange()" } }, viewQueries: [{ propertyName: "editorComponent", first: true, predicate: DocumentEditorComponent, descendants: true }, { propertyName: "commentsPanel", first: true, predicate: BlockCommentThreadComponent, descendants: true }], ngImport: i0, template: "<nb-card class=\"gz-page-editor\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- \u2500\u2500\u2500 Header: breadcrumbs \u00B7 autosave pill \u00B7 actions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t<nb-card-header class=\"gz-page-header\">\n\t\t<div class=\"gz-page-header-top\">\n\t\t\t<nav class=\"gz-breadcrumbs\" [attr.aria-label]=\"'DOCS.TITLE' | translate\">\n\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"back()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.CARDS.BREADCRUMB_ROOT' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<ng-container *ngFor=\"let crumb of breadcrumbs; let i = index\">\n\t\t\t\t\t<!-- Middle segments collapse beyond 4 levels (UX spec \u00A710.2) -->\n\t\t\t\t\t<ng-container *ngIf=\"breadcrumbs.length <= 4 || i === 0 || i >= breadcrumbs.length - 2; else ellipsis\">\n\t\t\t\t\t\t<span class=\"gz-breadcrumb-sep\">/</span>\n\t\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"openBreadcrumb(crumb)\">\n\t\t\t\t\t\t\t{{ crumb.name }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</ng-container>\n\t\t\t\t\t<ng-template #ellipsis>\n\t\t\t\t\t\t<ng-container *ngIf=\"i === 1\"><span class=\"gz-breadcrumb-sep\">/ \u2026</span></ng-container>\n\t\t\t\t\t</ng-template>\n\t\t\t\t</ng-container>\n\t\t\t</nav>\n\n\t\t\t<div class=\"gz-page-header-actions\">\n\t\t\t\t<!-- Autosave pill (UX spec \u00A710.6). `<output>` carries the implicit `status`\n\t\t\t\t     role, so no explicit `role` attribute is needed. -->\n\t\t\t\t<output\n\t\t\t\t\tclass=\"gz-save-pill\"\n\t\t\t\t\t[class.warning]=\"saveState === 'offline'\"\n\t\t\t\t\t[class.danger]=\"saveState === 'error' || saveState === 'conflict'\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.AUTOSAVE_STATUS' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<ng-container [ngSwitch]=\"saveState\">\n\t\t\t\t\t\t<ng-container *ngSwitchCase=\"'saving'\">\n\t\t\t\t\t\t\t<nb-icon icon=\"loader-outline\" class=\"gz-spin\"></nb-icon> {{ 'DOCS.EDITOR.SAVING' | translate }}\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngSwitchCase=\"'dirty'\">\n\t\t\t\t\t\t\t<nb-icon icon=\"loader-outline\"></nb-icon> {{ 'DOCS.EDITOR.SAVING' | translate }}\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngSwitchCase=\"'offline'\">\n\t\t\t\t\t\t\t<nb-icon icon=\"wifi-off-outline\"></nb-icon> {{ 'DOCS.EDITOR.OFFLINE_RETRYING' | translate }}\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngSwitchCase=\"'error'\">\n\t\t\t\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon> {{ 'DOCS.EDITOR.SAVE_FAILED' | translate }}\n\t\t\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"editorComponent?.autosave?.retryNow()\">\n\t\t\t\t\t\t\t\t{{ 'DOCS.EDITOR.RETRY_SAVE' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngSwitchDefault>\n\t\t\t\t\t\t\t<nb-icon icon=\"checkmark-outline\"></nb-icon> {{ 'DOCS.EDITOR.SAVED' | translate }}\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</output>\n\n\t\t\t\t<ngx-favorite-toggle\n\t\t\t\t\t*ngIf=\"document\"\n\t\t\t\t\t[entityType]=\"favoriteEntity\"\n\t\t\t\t\t[entityId]=\"document.id\"\n\t\t\t\t\t[entityName]=\"document.name\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tspacing=\"list\"\n\t\t\t\t></ngx-favorite-toggle>\n\n\t\t\t\t<!-- Lock/unlock is **own**-scoped below ADMIN (spec 08 \u00A71.8), so the permission\n\t\t\t\t     gate carries the ownership half with it. -->\n\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_UPDATE\">\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"canMutate\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t[nbTooltip]=\"(isLocked ? 'DOCS.EDITOR.UNLOCK' : 'DOCS.EDITOR.LOCK') | translate\"\n\t\t\t\t\t\t(click)=\"toggleLock()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon [icon]=\"isLocked ? 'lock' : 'unlock-outline'\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[nbTooltip]=\"railOpen ? ('DOCS.TREE.COLLAPSE' | translate) : ('DOCS.TREE.EXPAND' | translate)\"\n\t\t\t\t\t(click)=\"railOpen = !railOpen\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"layout-outline\"></nb-icon>\n\t\t\t\t</button>\n\n\t\t\t\t<!-- \u22EF overflow menu (UX spec \u00A710.9) -->\n\t\t\t\t<div class=\"gz-overflow\">\n\t\t\t\t\t<button nbButton ghost size=\"small\" type=\"button\" [class.active]=\"menuOpen\" (click)=\"menuOpen = !menuOpen\">\n\t\t\t\t\t\t<nb-icon icon=\"more-horizontal-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t\t<div class=\"gz-overflow-panel\" *ngIf=\"menuOpen\" role=\"menu\">\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"toggleFullWidth()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"expand-outline\"></nb-icon>{{ 'DOCS.EDITOR.FULL_WIDTH' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"copyLink()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"link-2-outline\"></nb-icon>{{ 'DOCS.TREE.COPY_LINK' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"!isPage\" (click)=\"copyMarkdown()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>{{ 'DOCS.EDITOR.COPY_MARKDOWN' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<!-- Export (spec 01 \u00A710.9): Markdown file now, print-CSS PDF via the browser. -->\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"!isPage\" (click)=\"exportMarkdown()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>{{ 'DOCS.EXPORT.MARKDOWN' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"print()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"printer-outline\"></nb-icon>{{ 'DOCS.EXPORT.PRINT' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<!-- Administering shares is creator-or-DOCS_MANAGE only (spec 08 \u00A73.3 / \u00A71.5). -->\n\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_UPDATE\">\n\t\t\t\t\t\t\t<button *ngIf=\"canMutate\" type=\"button\" role=\"menuitem\" (click)=\"openShareDialog()\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"share-outline\"></nb-icon>{{ 'DOCS.SHARE.ACTION' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_UPDATE\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"canMutate\">\n\t\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"!editable\" (click)=\"saveVersionNow()\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"save-outline\"></nb-icon>{{ 'DOCS.EDITOR.SAVE_VERSION_NOW' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"!editable\" (click)=\"toggleInvisibles()\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>{{ 'DOCS.EDITOR.INVISIBLES' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<hr />\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"openVersions()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"clock-outline\"></nb-icon>{{ 'DOCS.EDITOR.VERSION_HISTORY' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_CREATE\">\n\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"duplicate()\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"copy-outline\"></nb-icon>{{ 'DOCS.TREE.DUPLICATE' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<!-- Move / request review / archive are all **own**-scoped below ADMIN (\u00A71.8). -->\n\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_UPDATE\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"canMutate\">\n\t\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"isLocked\" (click)=\"openMoveDialog()\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"corner-down-right-outline\"></nb-icon>{{ 'DOCS.TREE.MOVE' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<!-- Manual review request (spec 01 \u00A711) \u2014 the only route into the\n\t\t\t\t\t\t\t\t     review queue when AI is disabled. Already-PENDING shows the\n\t\t\t\t\t\t\t\t     state instead of an action the backend would no-op. -->\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t*ngIf=\"canRequestReview; else pendingReviewItem\"\n\t\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t\trole=\"menuitem\"\n\t\t\t\t\t\t\t\t\t(click)=\"requestReview()\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon>{{ 'DOCS.REVIEW.REQUEST' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<ng-template #pendingReviewItem>\n\t\t\t\t\t\t\t\t\t<button *ngIf=\"isPendingReview\" type=\"button\" role=\"menuitem\" disabled>\n\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon>{{ 'DOCS.REVIEW.PENDING' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" class=\"danger\" (click)=\"archive()\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"archive-outline\"></nb-icon>{{ 'DOCS.TREE.ARCHIVE' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<!-- \u2500\u2500\u2500 Icon + inline title row (UX spec \u00A710.1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<div class=\"gz-title-row\" *ngIf=\"document\">\n\t\t\t<div class=\"gz-icon-picker\">\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"gz-doc-icon\"\n\t\t\t\t\t[disabled]=\"!canWrite\"\n\t\t\t\t\t(click)=\"iconPickerOpen = !iconPickerOpen\"\n\t\t\t\t>\n\t\t\t\t\t<span *ngIf=\"document.icon; else defaultIcon\">{{ document.icon }}</span>\n\t\t\t\t\t<ng-template #defaultIcon><nb-icon icon=\"file-text-outline\"></nb-icon></ng-template>\n\t\t\t\t</button>\n\t\t\t\t<div class=\"gz-icon-panel\" *ngIf=\"iconPickerOpen\">\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\t\tmaxlength=\"4\"\n\t\t\t\t\t\tid=\"gz-doc-icon-input\"\n\t\t\t\t\t\t[placeholder]=\"'DOCS.EDITOR.ICON_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.EDITOR.ICON_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t[(ngModel)]=\"iconDraft\"\n\t\t\t\t\t\t(keydown.enter)=\"saveIcon()\"\n\t\t\t\t\t/>\n\t\t\t\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"saveIcon()\">\n\t\t\t\t\t\t{{ 'DOCS.DIALOGS.CREATE_CONFIRM' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<input\n\t\t\t\tclass=\"gz-title-input\"\n\t\t\t\tid=\"gz-doc-title-input\"\n\t\t\t\t[placeholder]=\"'DOCS.EDITOR.UNTITLED' | translate\"\n\t\t\t\t[attr.aria-label]=\"'DOCS.TABLE.COLUMNS.NAME' | translate\"\n\t\t\t\t[(ngModel)]=\"titleDraft\"\n\t\t\t\t[disabled]=\"!canWrite || isLocked\"\n\t\t\t\t(blur)=\"saveTitle()\"\n\t\t\t\t(keydown.enter)=\"saveTitle()\"\n\t\t\t/>\n\t\t</div>\n\t</nb-card-header>\n\n\t<nb-card-body class=\"gz-page-body\">\n\t\t<!-- \u2500\u2500\u2500 Banners \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<div class=\"gz-banner gz-banner-error\" *ngIf=\"loadError\">\n\t\t\t{{ 'DOCS.ERRORS.EDITOR_LOAD' | translate }}\n\t\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"load()\">\n\t\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t\t</button>\n\t\t\t<button nbButton size=\"tiny\" ghost type=\"button\" (click)=\"back()\">\n\t\t\t\t{{ 'DOCS.CARDS.BREADCRUMB_ROOT' | translate }}\n\t\t\t</button>\n\t\t</div>\n\n\t\t<div class=\"gz-banner gz-banner-conflict\" *ngIf=\"saveState === 'conflict'\" role=\"alert\">\n\t\t\t{{ 'DOCS.EDITOR.SAVE.CONFLICT' | translate }}\n\t\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"conflictReload()\">\n\t\t\t\t{{ 'DOCS.EDITOR.SAVE.CONFLICT_RELOAD' | translate }}\n\t\t\t</button>\n\t\t\t<button nbButton size=\"tiny\" ghost type=\"button\" (click)=\"conflictKeepCopy()\">\n\t\t\t\t{{ 'DOCS.EDITOR.SAVE.CONFLICT_KEEP_COPY' | translate }}\n\t\t\t</button>\n\t\t</div>\n\n\t\t<div class=\"gz-banner gz-banner-locked\" *ngIf=\"isLocked && !loadError\">\n\t\t\t<nb-icon icon=\"lock-outline\"></nb-icon>\n\t\t\t{{ 'DOCS.EDITOR.LOCKED_BANNER' | translate }}\n\t\t</div>\n\n\t\t<!-- Read-only covers both halves of the write rule: no DOCS_UPDATE, or DOCS_UPDATE on\n\t\t     someone else's document without DOCS_MANAGE (spec 08 \u00A71.7). -->\n\t\t<div class=\"gz-banner gz-banner-readonly\" *ngIf=\"!canWrite && !loadError && document\">\n\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t{{ 'DOCS.EDITOR.READ_ONLY_BANNER' | translate }}\n\t\t</div>\n\n\t\t<!-- Content written by a newer extension set (spec 05 \u00A79.1 `metadata.schemaVersion`):\n\t\t     saving from this build would silently drop node types it does not know. -->\n\t\t<div class=\"gz-banner gz-banner-conflict\" *ngIf=\"schemaAhead\" role=\"alert\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\"></nb-icon>\n\t\t\t{{ 'DOCS.EDITOR.SCHEMA_AHEAD' | translate }}\n\t\t</div>\n\n\t\t<!-- \u2500\u2500\u2500 Editor canvas + right rail \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<div class=\"gz-page-layout\" *ngIf=\"document && !loadError\">\n\t\t\t<div class=\"gz-editor-canvas\" [class.full-width]=\"fullWidth\">\n\t\t\t\t<!-- PAGE: live editor (read-only when locked / no permission) -->\n\t\t\t\t<gz-document-editor\n\t\t\t\t\t*ngIf=\"isPage\"\n\t\t\t\t\t[document]=\"document\"\n\t\t\t\t\t[editable]=\"editable\"\n\t\t\t\t\t(saveStateChanged)=\"onSaveStateChanged($event)\"\n\t\t\t\t\t(statsChanged)=\"onStatsChanged($event)\"\n\t\t\t\t\t(tocChanged)=\"onTocChanged($event)\"\n\t\t\t\t\t(commentRequested)=\"openCommentsFor($event)\"\n\t\t\t\t\t(schemaVersionChanged)=\"onSchemaVersionChanged($event)\"\n\t\t\t\t></gz-document-editor>\n\n\t\t\t\t<!-- FILE: static extracted-text preview (spec 05 \u00A79.1) -->\n\t\t\t\t<gz-document-static-view\n\t\t\t\t\t*ngIf=\"!isPage\"\n\t\t\t\t\t[markdown]=\"document.extractedText ?? null\"\n\t\t\t\t\t[contentHtml]=\"document.contentHtml ?? null\"\n\t\t\t\t></gz-document-static-view>\n\t\t\t</div>\n\n\t\t\t<aside class=\"gz-right-rail\" *ngIf=\"railOpen\">\n\t\t\t\t<ng-container *ngIf=\"versionsOpen; else railTabs\">\n\t\t\t\t\t<gz-docs-version-history\n\t\t\t\t\t\t[documentId]=\"document.id\"\n\t\t\t\t\t\t(closed)=\"versionsOpen = false\"\n\t\t\t\t\t\t(restored)=\"onVersionRestored($event)\"\n\t\t\t\t\t></gz-docs-version-history>\n\t\t\t\t</ng-container>\n\t\t\t\t<ng-template #railTabs>\n\t\t\t\t\t<div class=\"gz-rail-tabs\" role=\"tablist\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\trole=\"tab\"\n\t\t\t\t\t\t\t[attr.aria-selected]=\"railTab === 'toc'\"\n\t\t\t\t\t\t\t[class.active]=\"railTab === 'toc'\"\n\t\t\t\t\t\t\t(click)=\"railTab = 'toc'\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'DOCS.EDITOR.TOC' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\trole=\"tab\"\n\t\t\t\t\t\t\t[attr.aria-selected]=\"railTab === 'info'\"\n\t\t\t\t\t\t\t[class.active]=\"railTab === 'info'\"\n\t\t\t\t\t\t\t(click)=\"railTab = 'info'\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'DOCS.EDITOR.INFO' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<!-- Block-anchored comment threads (spec 01 \u00A710.5 / spec 05 \u00A78).\n\t\t\t\t\t\t     PAGE only: a FILE has no editor blocks to anchor to. -->\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t*ngIf=\"isPage\"\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\trole=\"tab\"\n\t\t\t\t\t\t\t[attr.aria-selected]=\"railTab === 'comments'\"\n\t\t\t\t\t\t\t[class.active]=\"railTab === 'comments'\"\n\t\t\t\t\t\t\t(click)=\"openCommentsTab()\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'DOCS.COMMENTS.TITLE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- ToC panel (UX spec \u00A710.3) -->\n\t\t\t\t\t<div class=\"gz-rail-panel\" *ngIf=\"railTab === 'toc'\">\n\t\t\t\t\t\t<div class=\"gz-toc-empty\" *ngIf=\"!tocAnchors.length\">\n\t\t\t\t\t\t\t{{ 'DOCS.EDITOR.TOC_EMPTY' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<ul class=\"gz-toc-list\">\n\t\t\t\t\t\t\t<li *ngFor=\"let anchor of tocAnchors\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t\t[class.active]=\"anchor.isActive\"\n\t\t\t\t\t\t\t\t\t[style.padding-left.rem]=\"0.5 + (anchor.level - 1) * 0.75\"\n\t\t\t\t\t\t\t\t\t(click)=\"scrollToAnchor(anchor)\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{{ anchor.textContent }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- Info panel (UX spec \u00A710.4) -->\n\t\t\t\t\t<div class=\"gz-rail-panel gz-info-panel\" *ngIf=\"railTab === 'info'\">\n\t\t\t\t\t\t<dl>\n\t\t\t\t\t\t\t<ng-container *ngIf=\"stats\">\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.EDITOR.WORD_COUNT' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>{{ stats.words | number }}</dd>\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.EDITOR.CHAR_COUNT' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>{{ stats.characters | number }}</dd>\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.EDITOR.READ_TIME' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>{{ 'DOCS.EDITOR.READ_TIME_VALUE' | translate : { minutes: stats.readTimeMinutes } }}</dd>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<dt>{{ 'DOCS.TABLE.COLUMNS.UPDATED' | translate }}</dt>\n\t\t\t\t\t\t\t<dd>{{ document.updatedAt | date : 'medium' }}</dd>\n\t\t\t\t\t\t\t<dt>{{ 'DOCS.FILTERS.CREATED_RANGE' | translate }}</dt>\n\t\t\t\t\t\t\t<dd>{{ document.createdAt | date : 'medium' }}</dd>\n\t\t\t\t\t\t</dl>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- Comments panel (spec 05 \u00A78). Standalone component, so the page can\n\t\t\t\t\t     mount it without touching the module's declarations.\n\n\t\t\t\t\t     \uD83D\uDED1 `[hidden]`, not `*ngIf`, on the tab condition: this panel owns the\n\t\t\t\t\t     only comment fetch, and its `openBlocksChanged` is what draws the\n\t\t\t\t\t     editor's gutter markers. Behind an `*ngIf` the markers would not\n\t\t\t\t\t     appear until the user happened to open this tab. -->\n\t\t\t\t\t<div class=\"gz-rail-panel\" *ngIf=\"isPage\" [hidden]=\"railTab !== 'comments'\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t*ngIf=\"commentBlockId\"\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tclass=\"gz-comments-all\"\n\t\t\t\t\t\t\t(click)=\"openCommentsTab()\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'DOCS.COMMENTS.ALL_THREADS' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<gz-docs-block-comments\n\t\t\t\t\t\t\t[documentId]=\"document.id\"\n\t\t\t\t\t\t\t[documentName]=\"document.name\"\n\t\t\t\t\t\t\t[blockId]=\"commentBlockId\"\n\t\t\t\t\t\t\t[knownBlockIds]=\"knownBlockIds\"\n\t\t\t\t\t\t\t(openBlocksChanged)=\"onOpenCommentBlocks($event)\"\n\t\t\t\t\t\t\t(blockFocused)=\"onCommentBlockFocused($event)\"\n\t\t\t\t\t\t></gz-docs-block-comments>\n\t\t\t\t\t</div>\n\t\t\t\t</ng-template>\n\t\t\t</aside>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n", styles: [":host{display:block;height:100%}.gz-page-editor{height:100%;display:flex;flex-direction:column;margin:0}.gz-page-header{display:flex;flex-direction:column;gap:.5rem}.gz-page-header-top{display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap}.gz-breadcrumbs{display:flex;align-items:center;gap:.125rem;flex-wrap:wrap;min-width:0}.gz-breadcrumbs .gz-breadcrumb-sep{color:var(--text-hint-color);font-size:.75rem}.gz-page-header-actions{display:flex;align-items:center;gap:.25rem}.gz-save-pill{display:inline-flex;align-items:center;gap:.25rem;font-size:.75rem;color:var(--text-hint-color);border:1px solid var(--border-basic-color-3);border-radius:1rem;padding:.125rem .625rem;white-space:nowrap}.gz-save-pill.warning{color:var(--color-warning-default);border-color:var(--color-warning-transparent-500)}.gz-save-pill.danger{color:var(--color-danger-default);border-color:var(--color-danger-transparent-500)}.gz-save-pill .gz-spin{animation:gz-rotate 1s linear infinite}@keyframes gz-rotate{to{transform:rotate(360deg)}}.gz-overflow{position:relative}.gz-overflow .gz-overflow-panel{position:absolute;top:calc(100% + .25rem);right:0;z-index:100;min-width:13rem;display:flex;flex-direction:column;padding:.25rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1);box-shadow:var(--shadow)}.gz-overflow .gz-overflow-panel button{display:flex;align-items:center;gap:.5rem;border:none;background:transparent;text-align:left;padding:.375rem .5rem;border-radius:.25rem;cursor:pointer;color:var(--text-basic-color);font-size:.875rem}.gz-overflow .gz-overflow-panel button nb-icon{font-size:1rem;color:var(--text-hint-color)}.gz-overflow .gz-overflow-panel button:hover:not(:disabled){background:var(--background-basic-color-2)}.gz-overflow .gz-overflow-panel button:disabled{opacity:.4;cursor:default}.gz-overflow .gz-overflow-panel button.danger{color:var(--color-danger-default)}.gz-overflow .gz-overflow-panel hr{border:none;border-top:1px solid var(--border-basic-color-3);margin:.25rem 0}.gz-title-row{display:flex;align-items:center;gap:.5rem}.gz-icon-picker{position:relative}.gz-icon-picker .gz-doc-icon{font-size:1.25rem}.gz-icon-picker .gz-icon-panel{position:absolute;top:calc(100% + .25rem);left:0;z-index:100;display:flex;gap:.25rem;padding:.375rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1);box-shadow:var(--shadow)}.gz-icon-picker .gz-icon-panel input{width:5rem}.gz-title-input{flex:1;min-width:0;border:none;background:transparent;color:var(--text-basic-color);font-size:1.5rem;font-weight:700;padding:.125rem .25rem;border-radius:.25rem}.gz-title-input:focus{outline:2px solid var(--color-primary-transparent-300)}.gz-title-input::placeholder{color:var(--text-hint-color)}.gz-title-input:disabled{opacity:.8}.gz-page-body{flex:1;display:flex;flex-direction:column;gap:.5rem;overflow:hidden}.gz-banner{display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;border-radius:var(--border-radius);font-size:.875rem}.gz-banner.gz-banner-error,.gz-banner.gz-banner-conflict{background:var(--color-danger-transparent-100);color:var(--color-danger-default)}.gz-banner.gz-banner-locked{background:var(--color-warning-transparent-100);color:var(--color-warning-default)}.gz-banner.gz-banner-readonly{background:var(--background-basic-color-2);color:var(--text-hint-color)}.gz-page-layout{flex:1;display:flex;gap:1rem;min-height:0;overflow:hidden}.gz-editor-canvas{flex:1;min-width:0;overflow-y:auto}.gz-editor-canvas gz-document-editor,.gz-editor-canvas gz-document-static-view{display:block;max-width:52rem;margin:0 auto}.gz-editor-canvas.full-width gz-document-editor,.gz-editor-canvas.full-width gz-document-static-view{max-width:none}.gz-right-rail{flex:0 0 17rem;border-left:1px solid var(--border-basic-color-3);padding-left:.75rem;overflow-y:auto;display:flex;flex-direction:column;gap:.5rem}@media(max-width:767px){.gz-right-rail{display:none}}.gz-rail-tabs{display:flex;gap:.25rem}.gz-rail-tabs button.active{background:var(--color-primary-transparent-100)}.gz-rail-panel{flex:1;min-height:0;overflow-y:auto}.gz-toc-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}.gz-toc-list button{width:100%;text-align:left;border:none;background:transparent;padding:.25rem .5rem;border-radius:.25rem;cursor:pointer;color:var(--text-basic-color);font-size:.8125rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-toc-list button:hover{background:var(--background-basic-color-2)}.gz-toc-list button.active{color:var(--color-primary-default);background:var(--color-primary-transparent-100)}.gz-toc-empty{font-size:.8125rem;color:var(--text-hint-color);padding:.5rem}.gz-info-panel dl{display:grid;grid-template-columns:auto 1fr;gap:.25rem .75rem;margin:0;font-size:.8125rem}.gz-info-panel dl dt{color:var(--text-hint-color)}.gz-info-panel dl dd{margin:0;text-align:right}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i1.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: ["maxlength"] }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: RouterModule }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NgxPermissionsModule }, { kind: "directive", type: i3.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i4.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i4.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i4.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i4.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i4.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbInputModule }, { kind: "directive", type: i4.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "ngmodule", type: NbSpinnerModule }, { kind: "directive", type: i4.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "ngmodule", type: NbTooltipModule }, { kind: "directive", type: i4.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "ngmodule", type: FavoriteToggleModule }, { kind: "component", type: i5.FavoriteToggleComponent, selector: "ngx-favorite-toggle", inputs: ["entityType", "entityId", "entityName", "size", "status", "disabled", "showLabel", "spacing"], outputs: ["favoriteToggled"] }, { kind: "component", type: BlockCommentThreadComponent, selector: "gz-docs-block-comments", inputs: ["documentId", "documentName", "blockId", "knownBlockIds"], outputs: ["openBlocksChanged", "blockFocused"] }, { kind: "component", type: DocumentEditorComponent, selector: "gz-document-editor", inputs: ["document", "editable"], outputs: ["contentChanged", "saveStateChanged", "tocChanged", "statsChanged", "created", "commentRequested", "schemaVersionChanged"] }, { kind: "component", type: DocumentStaticViewComponent, selector: "gz-document-static-view", inputs: ["contentJson", "contentHtml", "markdown"] }, { kind: "component", type: VersionHistoryPanelComponent, selector: "gz-docs-version-history", inputs: ["documentId"], outputs: ["closed", "restored"] }, { kind: "pipe", type: i1.DecimalPipe, name: "number" }, { kind: "pipe", type: i1.DatePipe, name: "date" }, { kind: "pipe", type: i6.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentPageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-page', standalone: true, imports: [
                        CommonModule,
                        FormsModule,
                        RouterModule,
                        TranslateModule,
                        NgxPermissionsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbInputModule,
                        NbSpinnerModule,
                        NbTooltipModule,
                        FavoriteToggleModule,
                        BlockCommentThreadComponent,
                        DocumentEditorComponent,
                        DocumentStaticViewComponent,
                        VersionHistoryPanelComponent
                    ], template: "<nb-card class=\"gz-page-editor\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- \u2500\u2500\u2500 Header: breadcrumbs \u00B7 autosave pill \u00B7 actions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t<nb-card-header class=\"gz-page-header\">\n\t\t<div class=\"gz-page-header-top\">\n\t\t\t<nav class=\"gz-breadcrumbs\" [attr.aria-label]=\"'DOCS.TITLE' | translate\">\n\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"back()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.CARDS.BREADCRUMB_ROOT' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<ng-container *ngFor=\"let crumb of breadcrumbs; let i = index\">\n\t\t\t\t\t<!-- Middle segments collapse beyond 4 levels (UX spec \u00A710.2) -->\n\t\t\t\t\t<ng-container *ngIf=\"breadcrumbs.length <= 4 || i === 0 || i >= breadcrumbs.length - 2; else ellipsis\">\n\t\t\t\t\t\t<span class=\"gz-breadcrumb-sep\">/</span>\n\t\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"openBreadcrumb(crumb)\">\n\t\t\t\t\t\t\t{{ crumb.name }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</ng-container>\n\t\t\t\t\t<ng-template #ellipsis>\n\t\t\t\t\t\t<ng-container *ngIf=\"i === 1\"><span class=\"gz-breadcrumb-sep\">/ \u2026</span></ng-container>\n\t\t\t\t\t</ng-template>\n\t\t\t\t</ng-container>\n\t\t\t</nav>\n\n\t\t\t<div class=\"gz-page-header-actions\">\n\t\t\t\t<!-- Autosave pill (UX spec \u00A710.6). `<output>` carries the implicit `status`\n\t\t\t\t     role, so no explicit `role` attribute is needed. -->\n\t\t\t\t<output\n\t\t\t\t\tclass=\"gz-save-pill\"\n\t\t\t\t\t[class.warning]=\"saveState === 'offline'\"\n\t\t\t\t\t[class.danger]=\"saveState === 'error' || saveState === 'conflict'\"\n\t\t\t\t\t[attr.aria-label]=\"'DOCS.A11Y.AUTOSAVE_STATUS' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<ng-container [ngSwitch]=\"saveState\">\n\t\t\t\t\t\t<ng-container *ngSwitchCase=\"'saving'\">\n\t\t\t\t\t\t\t<nb-icon icon=\"loader-outline\" class=\"gz-spin\"></nb-icon> {{ 'DOCS.EDITOR.SAVING' | translate }}\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngSwitchCase=\"'dirty'\">\n\t\t\t\t\t\t\t<nb-icon icon=\"loader-outline\"></nb-icon> {{ 'DOCS.EDITOR.SAVING' | translate }}\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngSwitchCase=\"'offline'\">\n\t\t\t\t\t\t\t<nb-icon icon=\"wifi-off-outline\"></nb-icon> {{ 'DOCS.EDITOR.OFFLINE_RETRYING' | translate }}\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngSwitchCase=\"'error'\">\n\t\t\t\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon> {{ 'DOCS.EDITOR.SAVE_FAILED' | translate }}\n\t\t\t\t\t\t\t<button nbButton ghost size=\"tiny\" type=\"button\" (click)=\"editorComponent?.autosave?.retryNow()\">\n\t\t\t\t\t\t\t\t{{ 'DOCS.EDITOR.RETRY_SAVE' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngSwitchDefault>\n\t\t\t\t\t\t\t<nb-icon icon=\"checkmark-outline\"></nb-icon> {{ 'DOCS.EDITOR.SAVED' | translate }}\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</output>\n\n\t\t\t\t<ngx-favorite-toggle\n\t\t\t\t\t*ngIf=\"document\"\n\t\t\t\t\t[entityType]=\"favoriteEntity\"\n\t\t\t\t\t[entityId]=\"document.id\"\n\t\t\t\t\t[entityName]=\"document.name\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tspacing=\"list\"\n\t\t\t\t></ngx-favorite-toggle>\n\n\t\t\t\t<!-- Lock/unlock is **own**-scoped below ADMIN (spec 08 \u00A71.8), so the permission\n\t\t\t\t     gate carries the ownership half with it. -->\n\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_UPDATE\">\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"canMutate\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t[nbTooltip]=\"(isLocked ? 'DOCS.EDITOR.UNLOCK' : 'DOCS.EDITOR.LOCK') | translate\"\n\t\t\t\t\t\t(click)=\"toggleLock()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon [icon]=\"isLocked ? 'lock' : 'unlock-outline'\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t[nbTooltip]=\"railOpen ? ('DOCS.TREE.COLLAPSE' | translate) : ('DOCS.TREE.EXPAND' | translate)\"\n\t\t\t\t\t(click)=\"railOpen = !railOpen\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"layout-outline\"></nb-icon>\n\t\t\t\t</button>\n\n\t\t\t\t<!-- \u22EF overflow menu (UX spec \u00A710.9) -->\n\t\t\t\t<div class=\"gz-overflow\">\n\t\t\t\t\t<button nbButton ghost size=\"small\" type=\"button\" [class.active]=\"menuOpen\" (click)=\"menuOpen = !menuOpen\">\n\t\t\t\t\t\t<nb-icon icon=\"more-horizontal-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t\t<div class=\"gz-overflow-panel\" *ngIf=\"menuOpen\" role=\"menu\">\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"toggleFullWidth()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"expand-outline\"></nb-icon>{{ 'DOCS.EDITOR.FULL_WIDTH' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"copyLink()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"link-2-outline\"></nb-icon>{{ 'DOCS.TREE.COPY_LINK' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"!isPage\" (click)=\"copyMarkdown()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>{{ 'DOCS.EDITOR.COPY_MARKDOWN' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<!-- Export (spec 01 \u00A710.9): Markdown file now, print-CSS PDF via the browser. -->\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"!isPage\" (click)=\"exportMarkdown()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>{{ 'DOCS.EXPORT.MARKDOWN' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"print()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"printer-outline\"></nb-icon>{{ 'DOCS.EXPORT.PRINT' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<!-- Administering shares is creator-or-DOCS_MANAGE only (spec 08 \u00A73.3 / \u00A71.5). -->\n\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_UPDATE\">\n\t\t\t\t\t\t\t<button *ngIf=\"canMutate\" type=\"button\" role=\"menuitem\" (click)=\"openShareDialog()\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"share-outline\"></nb-icon>{{ 'DOCS.SHARE.ACTION' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_UPDATE\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"canMutate\">\n\t\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"!editable\" (click)=\"saveVersionNow()\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"save-outline\"></nb-icon>{{ 'DOCS.EDITOR.SAVE_VERSION_NOW' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"!editable\" (click)=\"toggleInvisibles()\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>{{ 'DOCS.EDITOR.INVISIBLES' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<hr />\n\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"openVersions()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"clock-outline\"></nb-icon>{{ 'DOCS.EDITOR.VERSION_HISTORY' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_CREATE\">\n\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" (click)=\"duplicate()\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"copy-outline\"></nb-icon>{{ 'DOCS.TREE.DUPLICATE' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t<!-- Move / request review / archive are all **own**-scoped below ADMIN (\u00A71.8). -->\n\t\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"PermissionsEnum.DOCS_UPDATE\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"canMutate\">\n\t\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" [disabled]=\"isLocked\" (click)=\"openMoveDialog()\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"corner-down-right-outline\"></nb-icon>{{ 'DOCS.TREE.MOVE' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<!-- Manual review request (spec 01 \u00A711) \u2014 the only route into the\n\t\t\t\t\t\t\t\t     review queue when AI is disabled. Already-PENDING shows the\n\t\t\t\t\t\t\t\t     state instead of an action the backend would no-op. -->\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t*ngIf=\"canRequestReview; else pendingReviewItem\"\n\t\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t\trole=\"menuitem\"\n\t\t\t\t\t\t\t\t\t(click)=\"requestReview()\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon>{{ 'DOCS.REVIEW.REQUEST' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<ng-template #pendingReviewItem>\n\t\t\t\t\t\t\t\t\t<button *ngIf=\"isPendingReview\" type=\"button\" role=\"menuitem\" disabled>\n\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon>{{ 'DOCS.REVIEW.PENDING' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t\t\t<button type=\"button\" role=\"menuitem\" class=\"danger\" (click)=\"archive()\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"archive-outline\"></nb-icon>{{ 'DOCS.TREE.ARCHIVE' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<!-- \u2500\u2500\u2500 Icon + inline title row (UX spec \u00A710.1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<div class=\"gz-title-row\" *ngIf=\"document\">\n\t\t\t<div class=\"gz-icon-picker\">\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"gz-doc-icon\"\n\t\t\t\t\t[disabled]=\"!canWrite\"\n\t\t\t\t\t(click)=\"iconPickerOpen = !iconPickerOpen\"\n\t\t\t\t>\n\t\t\t\t\t<span *ngIf=\"document.icon; else defaultIcon\">{{ document.icon }}</span>\n\t\t\t\t\t<ng-template #defaultIcon><nb-icon icon=\"file-text-outline\"></nb-icon></ng-template>\n\t\t\t\t</button>\n\t\t\t\t<div class=\"gz-icon-panel\" *ngIf=\"iconPickerOpen\">\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\t\tmaxlength=\"4\"\n\t\t\t\t\t\tid=\"gz-doc-icon-input\"\n\t\t\t\t\t\t[placeholder]=\"'DOCS.EDITOR.ICON_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.EDITOR.ICON_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t[(ngModel)]=\"iconDraft\"\n\t\t\t\t\t\t(keydown.enter)=\"saveIcon()\"\n\t\t\t\t\t/>\n\t\t\t\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"saveIcon()\">\n\t\t\t\t\t\t{{ 'DOCS.DIALOGS.CREATE_CONFIRM' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<input\n\t\t\t\tclass=\"gz-title-input\"\n\t\t\t\tid=\"gz-doc-title-input\"\n\t\t\t\t[placeholder]=\"'DOCS.EDITOR.UNTITLED' | translate\"\n\t\t\t\t[attr.aria-label]=\"'DOCS.TABLE.COLUMNS.NAME' | translate\"\n\t\t\t\t[(ngModel)]=\"titleDraft\"\n\t\t\t\t[disabled]=\"!canWrite || isLocked\"\n\t\t\t\t(blur)=\"saveTitle()\"\n\t\t\t\t(keydown.enter)=\"saveTitle()\"\n\t\t\t/>\n\t\t</div>\n\t</nb-card-header>\n\n\t<nb-card-body class=\"gz-page-body\">\n\t\t<!-- \u2500\u2500\u2500 Banners \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<div class=\"gz-banner gz-banner-error\" *ngIf=\"loadError\">\n\t\t\t{{ 'DOCS.ERRORS.EDITOR_LOAD' | translate }}\n\t\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"load()\">\n\t\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t\t</button>\n\t\t\t<button nbButton size=\"tiny\" ghost type=\"button\" (click)=\"back()\">\n\t\t\t\t{{ 'DOCS.CARDS.BREADCRUMB_ROOT' | translate }}\n\t\t\t</button>\n\t\t</div>\n\n\t\t<div class=\"gz-banner gz-banner-conflict\" *ngIf=\"saveState === 'conflict'\" role=\"alert\">\n\t\t\t{{ 'DOCS.EDITOR.SAVE.CONFLICT' | translate }}\n\t\t\t<button nbButton size=\"tiny\" status=\"primary\" type=\"button\" (click)=\"conflictReload()\">\n\t\t\t\t{{ 'DOCS.EDITOR.SAVE.CONFLICT_RELOAD' | translate }}\n\t\t\t</button>\n\t\t\t<button nbButton size=\"tiny\" ghost type=\"button\" (click)=\"conflictKeepCopy()\">\n\t\t\t\t{{ 'DOCS.EDITOR.SAVE.CONFLICT_KEEP_COPY' | translate }}\n\t\t\t</button>\n\t\t</div>\n\n\t\t<div class=\"gz-banner gz-banner-locked\" *ngIf=\"isLocked && !loadError\">\n\t\t\t<nb-icon icon=\"lock-outline\"></nb-icon>\n\t\t\t{{ 'DOCS.EDITOR.LOCKED_BANNER' | translate }}\n\t\t</div>\n\n\t\t<!-- Read-only covers both halves of the write rule: no DOCS_UPDATE, or DOCS_UPDATE on\n\t\t     someone else's document without DOCS_MANAGE (spec 08 \u00A71.7). -->\n\t\t<div class=\"gz-banner gz-banner-readonly\" *ngIf=\"!canWrite && !loadError && document\">\n\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t{{ 'DOCS.EDITOR.READ_ONLY_BANNER' | translate }}\n\t\t</div>\n\n\t\t<!-- Content written by a newer extension set (spec 05 \u00A79.1 `metadata.schemaVersion`):\n\t\t     saving from this build would silently drop node types it does not know. -->\n\t\t<div class=\"gz-banner gz-banner-conflict\" *ngIf=\"schemaAhead\" role=\"alert\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\"></nb-icon>\n\t\t\t{{ 'DOCS.EDITOR.SCHEMA_AHEAD' | translate }}\n\t\t</div>\n\n\t\t<!-- \u2500\u2500\u2500 Editor canvas + right rail \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->\n\t\t<div class=\"gz-page-layout\" *ngIf=\"document && !loadError\">\n\t\t\t<div class=\"gz-editor-canvas\" [class.full-width]=\"fullWidth\">\n\t\t\t\t<!-- PAGE: live editor (read-only when locked / no permission) -->\n\t\t\t\t<gz-document-editor\n\t\t\t\t\t*ngIf=\"isPage\"\n\t\t\t\t\t[document]=\"document\"\n\t\t\t\t\t[editable]=\"editable\"\n\t\t\t\t\t(saveStateChanged)=\"onSaveStateChanged($event)\"\n\t\t\t\t\t(statsChanged)=\"onStatsChanged($event)\"\n\t\t\t\t\t(tocChanged)=\"onTocChanged($event)\"\n\t\t\t\t\t(commentRequested)=\"openCommentsFor($event)\"\n\t\t\t\t\t(schemaVersionChanged)=\"onSchemaVersionChanged($event)\"\n\t\t\t\t></gz-document-editor>\n\n\t\t\t\t<!-- FILE: static extracted-text preview (spec 05 \u00A79.1) -->\n\t\t\t\t<gz-document-static-view\n\t\t\t\t\t*ngIf=\"!isPage\"\n\t\t\t\t\t[markdown]=\"document.extractedText ?? null\"\n\t\t\t\t\t[contentHtml]=\"document.contentHtml ?? null\"\n\t\t\t\t></gz-document-static-view>\n\t\t\t</div>\n\n\t\t\t<aside class=\"gz-right-rail\" *ngIf=\"railOpen\">\n\t\t\t\t<ng-container *ngIf=\"versionsOpen; else railTabs\">\n\t\t\t\t\t<gz-docs-version-history\n\t\t\t\t\t\t[documentId]=\"document.id\"\n\t\t\t\t\t\t(closed)=\"versionsOpen = false\"\n\t\t\t\t\t\t(restored)=\"onVersionRestored($event)\"\n\t\t\t\t\t></gz-docs-version-history>\n\t\t\t\t</ng-container>\n\t\t\t\t<ng-template #railTabs>\n\t\t\t\t\t<div class=\"gz-rail-tabs\" role=\"tablist\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\trole=\"tab\"\n\t\t\t\t\t\t\t[attr.aria-selected]=\"railTab === 'toc'\"\n\t\t\t\t\t\t\t[class.active]=\"railTab === 'toc'\"\n\t\t\t\t\t\t\t(click)=\"railTab = 'toc'\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'DOCS.EDITOR.TOC' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\trole=\"tab\"\n\t\t\t\t\t\t\t[attr.aria-selected]=\"railTab === 'info'\"\n\t\t\t\t\t\t\t[class.active]=\"railTab === 'info'\"\n\t\t\t\t\t\t\t(click)=\"railTab = 'info'\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'DOCS.EDITOR.INFO' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<!-- Block-anchored comment threads (spec 01 \u00A710.5 / spec 05 \u00A78).\n\t\t\t\t\t\t     PAGE only: a FILE has no editor blocks to anchor to. -->\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t*ngIf=\"isPage\"\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\trole=\"tab\"\n\t\t\t\t\t\t\t[attr.aria-selected]=\"railTab === 'comments'\"\n\t\t\t\t\t\t\t[class.active]=\"railTab === 'comments'\"\n\t\t\t\t\t\t\t(click)=\"openCommentsTab()\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'DOCS.COMMENTS.TITLE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- ToC panel (UX spec \u00A710.3) -->\n\t\t\t\t\t<div class=\"gz-rail-panel\" *ngIf=\"railTab === 'toc'\">\n\t\t\t\t\t\t<div class=\"gz-toc-empty\" *ngIf=\"!tocAnchors.length\">\n\t\t\t\t\t\t\t{{ 'DOCS.EDITOR.TOC_EMPTY' | translate }}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<ul class=\"gz-toc-list\">\n\t\t\t\t\t\t\t<li *ngFor=\"let anchor of tocAnchors\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t\t[class.active]=\"anchor.isActive\"\n\t\t\t\t\t\t\t\t\t[style.padding-left.rem]=\"0.5 + (anchor.level - 1) * 0.75\"\n\t\t\t\t\t\t\t\t\t(click)=\"scrollToAnchor(anchor)\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{{ anchor.textContent }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- Info panel (UX spec \u00A710.4) -->\n\t\t\t\t\t<div class=\"gz-rail-panel gz-info-panel\" *ngIf=\"railTab === 'info'\">\n\t\t\t\t\t\t<dl>\n\t\t\t\t\t\t\t<ng-container *ngIf=\"stats\">\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.EDITOR.WORD_COUNT' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>{{ stats.words | number }}</dd>\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.EDITOR.CHAR_COUNT' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>{{ stats.characters | number }}</dd>\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.EDITOR.READ_TIME' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>{{ 'DOCS.EDITOR.READ_TIME_VALUE' | translate : { minutes: stats.readTimeMinutes } }}</dd>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<dt>{{ 'DOCS.TABLE.COLUMNS.UPDATED' | translate }}</dt>\n\t\t\t\t\t\t\t<dd>{{ document.updatedAt | date : 'medium' }}</dd>\n\t\t\t\t\t\t\t<dt>{{ 'DOCS.FILTERS.CREATED_RANGE' | translate }}</dt>\n\t\t\t\t\t\t\t<dd>{{ document.createdAt | date : 'medium' }}</dd>\n\t\t\t\t\t\t</dl>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- Comments panel (spec 05 \u00A78). Standalone component, so the page can\n\t\t\t\t\t     mount it without touching the module's declarations.\n\n\t\t\t\t\t     \uD83D\uDED1 `[hidden]`, not `*ngIf`, on the tab condition: this panel owns the\n\t\t\t\t\t     only comment fetch, and its `openBlocksChanged` is what draws the\n\t\t\t\t\t     editor's gutter markers. Behind an `*ngIf` the markers would not\n\t\t\t\t\t     appear until the user happened to open this tab. -->\n\t\t\t\t\t<div class=\"gz-rail-panel\" *ngIf=\"isPage\" [hidden]=\"railTab !== 'comments'\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t*ngIf=\"commentBlockId\"\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tclass=\"gz-comments-all\"\n\t\t\t\t\t\t\t(click)=\"openCommentsTab()\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'DOCS.COMMENTS.ALL_THREADS' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<gz-docs-block-comments\n\t\t\t\t\t\t\t[documentId]=\"document.id\"\n\t\t\t\t\t\t\t[documentName]=\"document.name\"\n\t\t\t\t\t\t\t[blockId]=\"commentBlockId\"\n\t\t\t\t\t\t\t[knownBlockIds]=\"knownBlockIds\"\n\t\t\t\t\t\t\t(openBlocksChanged)=\"onOpenCommentBlocks($event)\"\n\t\t\t\t\t\t\t(blockFocused)=\"onCommentBlockFocused($event)\"\n\t\t\t\t\t\t></gz-docs-block-comments>\n\t\t\t\t\t</div>\n\t\t\t\t</ng-template>\n\t\t\t</aside>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n", styles: [":host{display:block;height:100%}.gz-page-editor{height:100%;display:flex;flex-direction:column;margin:0}.gz-page-header{display:flex;flex-direction:column;gap:.5rem}.gz-page-header-top{display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap}.gz-breadcrumbs{display:flex;align-items:center;gap:.125rem;flex-wrap:wrap;min-width:0}.gz-breadcrumbs .gz-breadcrumb-sep{color:var(--text-hint-color);font-size:.75rem}.gz-page-header-actions{display:flex;align-items:center;gap:.25rem}.gz-save-pill{display:inline-flex;align-items:center;gap:.25rem;font-size:.75rem;color:var(--text-hint-color);border:1px solid var(--border-basic-color-3);border-radius:1rem;padding:.125rem .625rem;white-space:nowrap}.gz-save-pill.warning{color:var(--color-warning-default);border-color:var(--color-warning-transparent-500)}.gz-save-pill.danger{color:var(--color-danger-default);border-color:var(--color-danger-transparent-500)}.gz-save-pill .gz-spin{animation:gz-rotate 1s linear infinite}@keyframes gz-rotate{to{transform:rotate(360deg)}}.gz-overflow{position:relative}.gz-overflow .gz-overflow-panel{position:absolute;top:calc(100% + .25rem);right:0;z-index:100;min-width:13rem;display:flex;flex-direction:column;padding:.25rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1);box-shadow:var(--shadow)}.gz-overflow .gz-overflow-panel button{display:flex;align-items:center;gap:.5rem;border:none;background:transparent;text-align:left;padding:.375rem .5rem;border-radius:.25rem;cursor:pointer;color:var(--text-basic-color);font-size:.875rem}.gz-overflow .gz-overflow-panel button nb-icon{font-size:1rem;color:var(--text-hint-color)}.gz-overflow .gz-overflow-panel button:hover:not(:disabled){background:var(--background-basic-color-2)}.gz-overflow .gz-overflow-panel button:disabled{opacity:.4;cursor:default}.gz-overflow .gz-overflow-panel button.danger{color:var(--color-danger-default)}.gz-overflow .gz-overflow-panel hr{border:none;border-top:1px solid var(--border-basic-color-3);margin:.25rem 0}.gz-title-row{display:flex;align-items:center;gap:.5rem}.gz-icon-picker{position:relative}.gz-icon-picker .gz-doc-icon{font-size:1.25rem}.gz-icon-picker .gz-icon-panel{position:absolute;top:calc(100% + .25rem);left:0;z-index:100;display:flex;gap:.25rem;padding:.375rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1);box-shadow:var(--shadow)}.gz-icon-picker .gz-icon-panel input{width:5rem}.gz-title-input{flex:1;min-width:0;border:none;background:transparent;color:var(--text-basic-color);font-size:1.5rem;font-weight:700;padding:.125rem .25rem;border-radius:.25rem}.gz-title-input:focus{outline:2px solid var(--color-primary-transparent-300)}.gz-title-input::placeholder{color:var(--text-hint-color)}.gz-title-input:disabled{opacity:.8}.gz-page-body{flex:1;display:flex;flex-direction:column;gap:.5rem;overflow:hidden}.gz-banner{display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;border-radius:var(--border-radius);font-size:.875rem}.gz-banner.gz-banner-error,.gz-banner.gz-banner-conflict{background:var(--color-danger-transparent-100);color:var(--color-danger-default)}.gz-banner.gz-banner-locked{background:var(--color-warning-transparent-100);color:var(--color-warning-default)}.gz-banner.gz-banner-readonly{background:var(--background-basic-color-2);color:var(--text-hint-color)}.gz-page-layout{flex:1;display:flex;gap:1rem;min-height:0;overflow:hidden}.gz-editor-canvas{flex:1;min-width:0;overflow-y:auto}.gz-editor-canvas gz-document-editor,.gz-editor-canvas gz-document-static-view{display:block;max-width:52rem;margin:0 auto}.gz-editor-canvas.full-width gz-document-editor,.gz-editor-canvas.full-width gz-document-static-view{max-width:none}.gz-right-rail{flex:0 0 17rem;border-left:1px solid var(--border-basic-color-3);padding-left:.75rem;overflow-y:auto;display:flex;flex-direction:column;gap:.5rem}@media(max-width:767px){.gz-right-rail{display:none}}.gz-rail-tabs{display:flex;gap:.25rem}.gz-rail-tabs button.active{background:var(--color-primary-transparent-100)}.gz-rail-panel{flex:1;min-height:0;overflow-y:auto}.gz-toc-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}.gz-toc-list button{width:100%;text-align:left;border:none;background:transparent;padding:.25rem .5rem;border-radius:.25rem;cursor:pointer;color:var(--text-basic-color);font-size:.8125rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-toc-list button:hover{background:var(--background-basic-color-2)}.gz-toc-list button.active{color:var(--color-primary-default);background:var(--color-primary-transparent-100)}.gz-toc-empty{font-size:.8125rem;color:var(--text-hint-color);padding:.5rem}.gz-info-panel dl{display:grid;grid-template-columns:auto 1fr;gap:.25rem .75rem;margin:0;font-size:.8125rem}.gz-info-panel dl dt{color:var(--text-hint-color)}.gz-info-panel dl dd{margin:0;text-align:right}\n"] }]
        }], propDecorators: { editorComponent: [{
                type: ViewChild,
                args: [DocumentEditorComponent]
            }], commentsPanel: [{
                type: ViewChild,
                args: [BlockCommentThreadComponent]
            }], onBeforeUnload: [{
                type: HostListener,
                args: ['window:beforeunload', ['$event']]
            }], onVisibilityChange: [{
                type: HostListener,
                args: ['document:visibilitychange']
            }] } });
//# sourceMappingURL=document-page.component.js.map