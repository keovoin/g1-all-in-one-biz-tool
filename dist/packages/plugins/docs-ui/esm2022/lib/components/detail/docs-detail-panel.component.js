import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Actions } from '@ngneat/effects-ng';
import { catchError, firstValueFrom, of } from 'rxjs';
import { BaseEntityEnum, DocumentKindEnum, DocumentKnowledgeStatusEnum, DocumentReviewStatusEnum, DocumentStatusEnum, DocumentVisibilityEnum, PermissionsEnum } from '@gauzy/contracts';
import { Store, TagsService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsActions } from '../../+state/documents.actions';
import { findLinkEntityDescriptor } from '../../models/docs-link.model';
import { DocsExportService } from '../../services/docs-export.service';
import { DocumentPermissionService } from '../../services/document-permission.service';
import { DocumentTreeStore } from '../../services/document-tree.store';
import { DocumentsService } from '../../services/documents.service';
import { UploadQueueService } from '../../services/upload-queue.service';
import { DocsDeleteDialogComponent } from '../../dialogs/delete-dialog.component';
import { ExtractedTextDialogComponent } from '../../dialogs/extracted-text-dialog.component';
import { DocumentLinkDialogComponent } from '../../dialogs/link-dialog.component';
import { RequestReviewDialogComponent } from '../../dialogs/request-review-dialog.component';
import { DocumentShareDialogComponent } from '../../dialogs/share-dialog.component';
import { DOCS_PERMISSIONS } from '../../docs-permission-groups';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../../services/documents.service";
import * as i3 from "../../services/docs-export.service";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@nebular/theme";
import * as i6 from "@ngneat/effects-ng";
import * as i7 from "@angular/router";
import * as i8 from "../../services/upload-queue.service";
import * as i9 from "../../services/document-tree.store";
import * as i10 from "../../services/document-permission.service";
import * as i11 from "@angular/common";
import * as i12 from "ngx-permissions";
import * as i13 from "@gauzy/ui-core/shared";
import * as i14 from "../table/cells/status-badge.component";
import * as i15 from "../table/cells/knowledge-badge.component";
import * as i16 from "../table/cells/source-badge.component";
import * as i17 from "../table/cells/category-chips.component";
import * as i18 from "../table/cells/tag-chips.component";
import * as i19 from "../activity/docs-detail-activity.component";
import * as i20 from "../comments/document-comments.component";
/**
 * Relations the panel needs on the detail read.
 *
 * `createdByUser` / `updatedByUser` back the Created/Updated rows of the metadata grid
 * (`01-ux-spec.md` §8.4) — only the id columns are stored on the row, so the names have to be
 * joined. 🛑 They must stay on the server-side relation allowlist (`document.controller.ts`
 * `toRelationList`); a relation that is filtered out silently degrades those rows to a bare
 * timestamp rather than erroring.
 */
export const DOCS_DETAIL_RELATIONS = [
    'categories',
    'tags',
    'parent',
    'reviewedBy',
    'createdByUser',
    'updatedByUser'
];
/**
 * Palette the accept-chip picks a colour from when it has to create a `Tag`.
 *
 * Deterministic (hashed from the name) rather than random: accepting the same suggestion on two
 * documents in two organizations produces the same colour, and the plugin does not have to take
 * a dependency on `randomcolor` for it.
 */
const SUGGESTED_TAG_COLORS = ['#3366FF', '#00D68F', '#FFAA00', '#FF3D71', '#8B5CF6', '#0095FF', '#00B383'];
/**
 * Right-side detail panel for any document kind. Re-fetches by id on open
 * (list rows can be stale) and loads links in parallel. Taxonomy chip edits
 * PUT immediately; the review banner hides itself when approve/reject
 * return 403.
 */
export class DocsDetailPanelComponent extends TranslationBaseComponent {
    constructor(translateService, documentsService, exportService, toastrService, dialogService, actions, router, uploadQueue, documentTreeStore, tagsService, documentPermission, store) {
        super(translateService);
        this.translateService = translateService;
        this.documentsService = documentsService;
        this.exportService = exportService;
        this.toastrService = toastrService;
        this.dialogService = dialogService;
        this.actions = actions;
        this.router = router;
        this.uploadQueue = uploadQueue;
        this.documentTreeStore = documentTreeStore;
        this.tagsService = tagsService;
        this.documentPermission = documentPermission;
        this.store = store;
        /**
         * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
         * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
         * makes ngx-permissions re-validate forever and wedges the main thread.
         */
        this.docsPermissions = DOCS_PERMISSIONS;
        this.closed = new EventEmitter();
        this.changed = new EventEmitter();
        this.deleted = new EventEmitter();
        this.openEditor = new EventEmitter();
        /** FILE preview request — the shell opens the preview modal. */
        this.openPreview = new EventEmitter();
        this.document = null;
        this.links = [];
        this.categories = [];
        this.loading = false;
        this.loadError = false;
        /** Hidden after a 403 from approve/reject. */
        this.reviewForbidden = false;
        /**
         * Ancestor chain of the open document, root → parent (`01-ux-spec.md` §8.4 "Location").
         * Empty for a root-level document, which renders the "All documents" crumb instead.
         */
        this.location = [];
        /** The suggested tag currently being accepted — one chip at a time, so clicks cannot race. */
        this.acceptingTag = null;
        this.kindEnum = DocumentKindEnum;
        this.statusEnum = DocumentStatusEnum;
        this.knowledgeEnum = DocumentKnowledgeStatusEnum;
        this.reviewEnum = DocumentReviewStatusEnum;
        this.visibilityEnum = DocumentVisibilityEnum;
        this.permissions = PermissionsEnum;
        this.favoriteEntityType = BaseEntityEnum.Document;
        /** True while a markdown/print export is resolving (dialog-free async work). */
        this.exporting = false;
        /** True while the signed download URL is being resolved. */
        this.downloading = false;
        /** Cache so `selectedCategoryIds` keeps a stable reference across change-detection cycles. */
        this.selectedCategoryIdsCache = { source: undefined, result: [] };
        /**
         * AI keyword suggestions that are not already applied.
         *
         * The pipeline deliberately never creates `Tag` rows itself (catalog hygiene, spec 07 §5.2),
         * so these chips are the ONLY path from `metadata.ai.suggestedTags` to a real tag. A chip
         * disappears as soon as its name is on the document, which is what makes "accept" feel like
         * an accept rather than a toggle.
         */
        /** Cache so `suggestedTags` keeps a stable reference (and skips the Set-building work) per CD. */
        this.suggestedTagsCache = {
            suggestions: undefined,
            appliedTags: undefined,
            result: []
        };
    }
    /**
     * Dedup notice for the open document (`R-UPL-04`).
     *
     * 🛑 `duplicateOfId` is reported on the **upload response only** — it is not a
     * column on the document — so the upload queue is the only place that knows it.
     * A document opened on a later page load therefore correctly shows nothing;
     * that is the storage model, not a missing render.
     */
    get duplicateNotice() {
        return this.uploadQueue.duplicateNoticeFor(this.document?.id);
    }
    ngOnChanges(changes) {
        if (changes['documentId'] && this.documentId) {
            this.reviewForbidden = false;
            this.acceptingTag = null;
            this.location = [];
            void this.reload();
        }
    }
    async reload() {
        this.loading = true;
        this.loadError = false;
        try {
            const [document, links, categories] = await Promise.all([
                firstValueFrom(this.documentsService.getById(this.documentId, DOCS_DETAIL_RELATIONS)),
                firstValueFrom(this.documentsService.getLinks(this.documentId).pipe(catchError(() => of([])))),
                firstValueFrom(this.documentsService.getCategories().pipe(catchError(() => of([]))))
            ]);
            // A 200 is not proof of a document. `TransformInterceptor` serializes any non-Nest server
            // error as a 200 carrying `{ message }`, and assigning that straight through built the
            // whole panel around an error object — empty name, `DOCS.KIND.undefined`,
            // `DOCS.SOURCE.undefined` — with no error state and no retry, because `*ngIf="document as
            // doc"` only asks whether it is truthy. Treat a payload without an `id` as a failed read
            // and fall into the existing catch, which is what the user-visible error state is for.
            if (!document?.id) {
                throw new Error(`Documents API returned no document for ${this.documentId}`);
            }
            this.document = document;
            this.links = links ?? [];
            this.categories = categories ?? [];
            // Fault-isolated like the links/categories legs above: no ancestor chain is a
            // missing "Location" row, never a failed panel.
            void this.refreshLocation(document);
        }
        catch {
            this.loadError = true;
            this.document = null;
            this.location = [];
        }
        finally {
            this.loading = false;
        }
    }
    // ─── Header / actions ────────────────────────────────────────
    close() {
        this.closed.emit();
    }
    get isArchived() {
        return !!this.document?.isArchived;
    }
    /**
     * Row-level ownership scope of the open document (`08-permissions-security.md` §1.7).
     *
     * 🛑 ANDed with the template's `ngxPermissionsOnly` gates, never a replacement for them: the
     * server rule is `DOCS_UPDATE AND (DOCS_MANAGE OR creator OR EDIT share)`, so a `DOCS_UPDATE`
     * holder who is not the creator was being shown edit/archive/delete on every document and
     * only found out from a `403 DOCS_WRITE_FORBIDDEN`.
     */
    get canMutate() {
        return this.documentPermission.canMutate(this.document);
    }
    get isSettledFile() {
        return (this.document?.kind === DocumentKindEnum.FILE &&
            (this.document.status === DocumentStatusEnum.READY || this.document.status === DocumentStatusEnum.FAILED));
    }
    /**
     * Resolves the short-lived provider URL, then opens it.
     *
     * 🛑 `GET /:id/download` is a **JWT-guarded JSON endpoint** answering
     * `{ url }`, not a redirect: navigating straight to it sends no bearer token
     * and lands on a 401 page. The signed URL therefore has to come back through
     * the authenticated `HttpClient` first — which is exactly what
     * `getDownloadUrl()` is for.
     */
    async download() {
        if (!this.document || this.downloading)
            return;
        this.downloading = true;
        try {
            const url = await firstValueFrom(this.documentsService.getDownloadUrl(this.document.id));
            if (url)
                window.open(url, '_blank', 'noopener');
            else
                this.toastrService.warning(this.getTranslation('DOCS.PREVIEW.FALLBACK_BODY'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.downloading = false;
        }
    }
    onOpenEditor() {
        if (this.document?.kind === DocumentKindEnum.PAGE) {
            this.openEditor.emit(this.document.id);
        }
    }
    preview() {
        if (this.document?.kind === DocumentKindEnum.FILE) {
            this.openPreview.emit(this.document);
        }
    }
    async reprocess() {
        if (!this.document)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.reprocess(this.document.id));
            this.applyChange(document);
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    async toggleArchive() {
        if (!this.document)
            return;
        const id = this.document.id;
        try {
            const document = this.isArchived
                ? await firstValueFrom(this.documentsService.unarchive(id))
                : await firstValueFrom(this.documentsService.archive(id));
            this.toastrService.success(this.getTranslation(this.isArchived ? 'DOCS.TOASTS.RESTORED' : 'DOCS.TOASTS.ARCHIVED'));
            this.applyChange(document);
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /**
     * Delete is allowed only from the archived state (archive-first flow).
     *
     * The prompt (`01-ux-spec.md` §10.11) is what decides the strategy: a node with
     * children offers subtree-vs-promote, a leaf just confirms. This used to open
     * the generic confirmation and then hardcode `promote-children` — under a query
     * param the backend does not declare, so the request was stripped to the
     * `subtree` default and did the opposite of what the code claimed.
     */
    async remove() {
        if (!this.document || !this.isArchived)
            return;
        const id = this.document.id;
        const result = await firstValueFrom(this.dialogService.open(DocsDeleteDialogComponent, {
            context: {
                target: { id, name: this.document.name, kind: this.document.kind }
            }
        }).onClose);
        if (!result?.strategy)
            return;
        try {
            await firstValueFrom(this.documentsService.delete(id, { strategy: result.strategy }));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.DELETED'));
            this.deleted.emit(id);
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    async openExtractedText() {
        if (!this.document)
            return;
        const document = await firstValueFrom(this.dialogService.open(ExtractedTextDialogComponent, {
            context: { documentId: this.document.id }
        }).onClose);
        if (document)
            this.applyChange(document);
    }
    // ─── Taxonomy (immediate PUTs) ───────────────────────────────
    async onCategoriesChange(categoryIds) {
        if (!this.document)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.update(this.document.id, { categoryIds }));
            this.applyChange({ ...document, categories: this.categories.filter((c) => categoryIds.includes(c.id)) });
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    async onTagsChange(tags) {
        if (!this.document)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.update(this.document.id, this.toTagIdsInput(tags)));
            this.applyChange({ ...document, tags });
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /**
     * Builds the tag half of a `PUT /documents/:id` body.
     *
     * 🛑 The server DTO whitelists **`tagIds`**, not `tags` (`create-document.dto.ts:83-87`), and
     * the route runs with `forbidNonWhitelisted: true` — so sending the `ITag[]` that
     * `IDocumentUpdateInput` advertises is a **400**, not a silently ignored field. The FE
     * contract and the DTO disagree here; the DTO wins, and the cast documents why.
     */
    toTagIdsInput(tags) {
        const input = {
            tagIds: (tags ?? []).map((tag) => tag.id).filter(Boolean)
        };
        return input;
    }
    /**
     * Feeds `[selected]` on an `<nb-select>`, re-read every change-detection cycle while the panel
     * is open. `.map()` mints a new array identity each call; memoizing it (keyed on the
     * `document.categories` reference) keeps that reference stable so nb-select does not re-reconcile
     * its selection model every cycle — the same discipline as `FacetMultiselectComponent`.
     */
    get selectedCategoryIds() {
        const source = this.document?.categories;
        if (this.selectedCategoryIdsCache.source !== source) {
            this.selectedCategoryIdsCache = {
                source,
                result: (source ?? []).map((category) => category.id)
            };
        }
        return this.selectedCategoryIdsCache.result;
    }
    // ─── AI suggested tags (spec 07 §5.2) ────────────────────────
    /**
     * `metadata` as an object.
     *
     * The column is `jsonb` on postgres but **text** on sqlite; `DocumentSubscriber.afterEntityLoad`
     * normally parses that back, but it logs-and-leaves the raw string when the parse fails — and
     * the classifier writes the column through a raw `.update()` that bypasses the subscribers
     * entirely. So the string shape can reach this client, and reading it wrong means the accept
     * chips silently never appear.
     */
    get metadata() {
        const raw = this.document?.metadata;
        if (typeof raw === 'string') {
            try {
                const parsed = JSON.parse(raw);
                return parsed && typeof parsed === 'object' ? parsed : null;
            }
            catch {
                return null;
            }
        }
        return raw && typeof raw === 'object' ? raw : null;
    }
    /**
     * Rebuilds a new array plus two `Set`s on every call and is read each change-detection cycle
     * while the panel is open. Memoized on its two source references (the AI `suggestedTags` array
     * and the applied `document.tags`) so it returns a stable array — the `trackBy` on its `*ngFor`
     * then keeps the suggestion buttons stable. Same reference-stability discipline as the facet fix.
     */
    get suggestedTags() {
        const ai = this.metadata?.['ai'];
        const suggestions = Array.isArray(ai?.suggestedTags) ? ai?.suggestedTags : [];
        const appliedTags = this.document?.tags;
        if (this.suggestedTagsCache.suggestions === suggestions && this.suggestedTagsCache.appliedTags === appliedTags) {
            return this.suggestedTagsCache.result;
        }
        const applied = new Set((appliedTags ?? []).map((tag) => String(tag?.name ?? '').trim().toLowerCase()));
        const seen = new Set();
        const result = suggestions
            .filter((entry) => typeof entry === 'string')
            .map((entry) => entry.trim())
            .filter((entry) => {
            const key = entry.toLowerCase();
            if (!entry || applied.has(key) || seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
        this.suggestedTagsCache = { suggestions, appliedTags, result };
        return result;
    }
    trackBySuggestion(_index, suggestion) {
        return suggestion;
    }
    /**
     * Accepts one suggestion: resolve-or-create the `Tag` by name, then PUT the merged id list.
     *
     * Reuse comes first on purpose — a suggestion that matches an existing organization tag must
     * attach that tag, not mint a near-duplicate the catalog then has to live with.
     */
    async acceptSuggestedTag(name) {
        if (!this.document || this.acceptingTag)
            return;
        this.acceptingTag = name;
        try {
            const tag = await this.resolveOrCreateTag(name);
            const tags = [...(this.document.tags ?? []), tag];
            const document = await firstValueFrom(this.documentsService.update(this.document.id, this.toTagIdsInput(tags)));
            // `applyChange` merges, so the local `tags` array is what removes the chip — the PUT
            // response carries no `tags` relation.
            this.applyChange({ ...document, tags });
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.TAG_ADDED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.acceptingTag = null;
        }
    }
    /** Case-insensitive lookup in the organization's tag catalog, creating the tag only on a miss. */
    async resolveOrCreateTag(name) {
        const organization = this.store.selectedOrganization;
        const organizationId = organization?.id;
        const tenantId = organization?.tenantId;
        const label = name.trim();
        const normalized = label.toLowerCase();
        const { items } = await this.tagsService.getTagsByLevel({ organizationId, tenantId });
        const existing = (items ?? []).find((tag) => String(tag?.name ?? '').trim().toLowerCase() === normalized);
        if (existing)
            return existing;
        return firstValueFrom(this.tagsService.create({
            name: label,
            color: this.colorForTag(normalized),
            description: '',
            organizationId,
            tenantId
        }));
    }
    /** Stable colour for a tag name — see `SUGGESTED_TAG_COLORS`. */
    colorForTag(normalized) {
        let hash = 0;
        for (let index = 0; index < normalized.length; index++) {
            hash = (hash * 31 + normalized.charCodeAt(index)) % 100003;
        }
        return SUGGESTED_TAG_COLORS[hash % SUGGESTED_TAG_COLORS.length];
    }
    // ─── Toggles ─────────────────────────────────────────────────
    async onSearchableToggle(searchable) {
        if (!this.document)
            return;
        try {
            const document = await firstValueFrom(
            // `searchable` is a doc-05/Wave-2 update field not yet on IDocumentUpdateInput.
            this.documentsService.update(this.document.id, { searchable }));
            this.applyChange(document);
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    get inKnowledge() {
        const status = this.document?.knowledgeStatus;
        return (status === DocumentKnowledgeStatusEnum.QUEUED ||
            status === DocumentKnowledgeStatusEnum.INDEXING ||
            status === DocumentKnowledgeStatusEnum.INDEXED);
    }
    async onKnowledgeToggle(include) {
        if (!this.document)
            return;
        const id = this.document.id;
        try {
            const document = include
                ? await firstValueFrom(this.documentsService.knowledgeImport(id))
                : await firstValueFrom(this.documentsService.knowledgeExclude(id));
            this.toastrService.success(this.getTranslation(include ? 'DOCS.TOASTS.KNOWLEDGE_IMPORTED' : 'DOCS.TOASTS.KNOWLEDGE_EXCLUDED'));
            this.applyChange(document);
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    async reindex() {
        if (!this.document)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.reindex(this.document.id));
            this.applyChange(document);
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /** FAILED indexing → re-queue via the import endpoint (FAILED → QUEUED, spec 03 §4.8). */
    async retryKnowledge() {
        if (!this.document)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.knowledgeImport(this.document.id));
            this.applyChange(document);
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    get knowledgeInFlight() {
        const status = this.document?.knowledgeStatus;
        return status === DocumentKnowledgeStatusEnum.QUEUED || status === DocumentKnowledgeStatusEnum.INDEXING;
    }
    async regenerateSummary() {
        if (!this.document)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.regenerateSummary(this.document.id));
            this.applyChange(document);
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    // ─── Review banner ───────────────────────────────────────────
    get showReviewBanner() {
        return this.document?.reviewStatus === DocumentReviewStatusEnum.PENDING && !this.reviewForbidden;
    }
    get isPendingReview() {
        return this.document?.reviewStatus === DocumentReviewStatusEnum.PENDING;
    }
    /**
     * A manual review request is the ONLY way into the queue when AI is off, so
     * it is offered for every kind — but never on a document that is already
     * PENDING (the banner above is the state for that; the backend would no-op)
     * nor on an archived one, which is not part of the working set.
     */
    get canRequestReview() {
        return !!this.document && !this.isPendingReview && !this.isArchived;
    }
    /**
     * Flags the document for a human review (`reviewReason='manual'`). The reason
     * is optional — the dialog mirrors rejection, which is the established shape
     * for a review note in this hub.
     */
    async requestReview() {
        if (!this.canRequestReview || !this.document)
            return;
        const result = await firstValueFrom(this.dialogService.open(RequestReviewDialogComponent).onClose);
        if (!result)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.requestReview(this.document.id, { reason: result.reason }));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.REVIEW_REQUESTED'));
            this.reviewForbidden = false; // a fresh PENDING re-arms the banner controls
            this.applyChange(document);
            // Patch the row in place and re-count the "Needs review" preset/facets —
            // the queue badge is derived from facets, not from the open panel.
            this.actions.dispatch(DocumentsActions.rowChanged(this.document));
            this.actions.dispatch(DocumentsActions.refreshFacets());
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    async approveReview() {
        if (!this.document)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.approveReview(this.document.id));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.REVIEW_APPROVED'));
            this.applyChange(document);
        }
        catch (error) {
            this.handleReviewError(error);
        }
    }
    async rejectReview(reason) {
        if (!this.document)
            return;
        try {
            const document = await firstValueFrom(this.documentsService.rejectReview(this.document.id, { reason }));
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.REVIEW_REJECTED'));
            this.applyChange(document);
        }
        catch (error) {
            this.handleReviewError(error);
        }
    }
    handleReviewError(error) {
        if (error?.status === 403) {
            this.reviewForbidden = true; // hide the banner controls on 403
        }
        else {
            this.toastrService.danger(error);
        }
    }
    // ─── Sharing (spec 08 §3) ────────────────────────────────────
    get isPrivate() {
        return this.document?.visibility === DocumentVisibilityEnum.PRIVATE;
    }
    /**
     * Opens the share dialog. Offered for every document, not only PRIVATE ones:
     * the dialog is also where visibility is flipped, so "Share" has to be the
     * way *into* privacy, not something that only appears once you are already
     * there.
     */
    async openShare() {
        if (!this.document)
            return;
        const updated = await firstValueFrom(this.dialogService.open(DocumentShareDialogComponent, { context: { document: this.document } }).onClose);
        // The dialog can change visibility — reflect it on the badge row.
        if (updated)
            this.applyChange(updated);
    }
    // ─── Export (spec 01 §10.9 / 05 §9.1) ────────────────────────
    get isPage() {
        return this.document?.kind === DocumentKindEnum.PAGE;
    }
    async copyMarkdown() {
        if (!this.document || this.exporting)
            return;
        this.exporting = true;
        try {
            const copied = await this.exportService.copyMarkdown(this.document);
            if (copied)
                this.toastrService.success(this.getTranslation('DOCS.TOASTS.MARKDOWN_COPIED'));
            else
                this.toastrService.warning(this.getTranslation('DOCS.EXPORT.NOTHING_TO_EXPORT'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.exporting = false;
        }
    }
    async exportMarkdown() {
        if (!this.document || this.exporting)
            return;
        this.exporting = true;
        try {
            const written = await this.exportService.downloadMarkdown(this.document);
            if (!written)
                this.toastrService.warning(this.getTranslation('DOCS.EXPORT.NOTHING_TO_EXPORT'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.exporting = false;
        }
    }
    async print() {
        if (!this.document || this.exporting)
            return;
        this.exporting = true;
        try {
            const printed = await this.exportService.print(this.document);
            if (!printed)
                this.toastrService.warning(this.getTranslation('DOCS.EXPORT.NOTHING_TO_EXPORT'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.exporting = false;
        }
    }
    // ─── Linked records (spec 01 §8.9) ───────────────────────────
    async addLink() {
        if (!this.document)
            return;
        const link = await firstValueFrom(this.dialogService.open(DocumentLinkDialogComponent, {
            context: { document: this.document, existing: this.links }
        }).onClose);
        if (link)
            this.links = [...this.links, link];
    }
    async removeLink(link) {
        try {
            await firstValueFrom(this.documentsService.deleteLink(link.id));
            this.links = this.links.filter((entry) => String(entry.id) !== String(link.id));
            this.toastrService.success(this.getTranslation('DOCS.LINKS.TOAST_REMOVED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
    }
    /** Navigates to the linked business record; no-op for entities without a detail route. */
    openLink(link) {
        const route = findLinkEntityDescriptor(link.entity)?.route(link.entityId);
        if (route)
            void this.router.navigateByUrl(route);
    }
    hasLinkRoute(link) {
        return !!findLinkEntityDescriptor(link.entity)?.route(link.entityId);
    }
    // ─── Location / people (spec 01 §8.4) ────────────────────────
    /**
     * Resolves the ancestor chain of the open document for the "Location" row.
     *
     * The shared node cache answers it for free whenever the tree has been walked; a deep link
     * straight into `?id=` has walked nothing, so it falls back to one read of the parent with
     * its own parent — the same two-step the browse breadcrumb uses. Ancestors that cannot be
     * resolved are NOT invented: the chain is simply shorter, and the "All documents" crumb still
     * gets the user back out.
     */
    async refreshLocation(document) {
        const parentId = document?.parentId;
        if (!parentId) {
            this.location = [];
            return;
        }
        const path = this.documentTreeStore.pathOf(parentId);
        if (path.length) {
            this.location = path.map((node) => ({ id: node.id, name: node.name }));
            return;
        }
        try {
            // One level deeper than the `parent` the panel already holds: re-reading the parent
            // *with its own parent* is what buys the second crumb on a cold deep link.
            const parent = await firstValueFrom(this.documentsService.getById(parentId, ['parent']));
            this.location = this.chainOf(parent ?? document?.parent);
        }
        catch {
            this.location = this.chainOf(document?.parent);
        }
    }
    /** `[grandparent, parent]` — or just `[parent]`, or nothing at all. */
    chainOf(parent) {
        if (!parent)
            return [];
        const grandParent = parent.parent;
        return [
            ...(grandParent ? [{ id: grandParent.id, name: grandParent.name }] : []),
            { id: parent.id, name: parent.name }
        ];
    }
    /** Drills the browse list into a folder of the Location chain (`null` = root). */
    openLocation(folderId) {
        this.actions.dispatch(DocumentsActions.folderChanged(folderId));
    }
    /**
     * Display name of a user behind `createdByUser` / `updatedByUser`.
     *
     * Empty when the relation is absent — the row then shows the timestamp alone rather than a
     * placeholder that reads like a real name.
     */
    userLabel(user) {
        return (user?.name ||
            [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
            user?.email ||
            '');
    }
    // ─── Helpers ─────────────────────────────────────────────────
    /** Registered entities get their own icon; anything else falls back to a generic link. */
    linkIcon(link) {
        return findLinkEntityDescriptor(link.entity)?.icon ?? 'link-2-outline';
    }
    /** Entity-type label (`DOCS.LINKS.ENTITY.*`), or the raw enum for unregistered types. */
    linkTypeLabel(link) {
        const descriptor = findLinkEntityDescriptor(link.entity);
        return descriptor ? this.getTranslation(descriptor.labelKey) : String(link.entity);
    }
    /**
     * Display label captured at link time. Falls back to the entity + id so a
     * link created before `metadata.label` existed — or whose record was renamed
     * away — still renders something clickable instead of a blank row.
     */
    linkLabel(link) {
        const metadata = link.metadata;
        return metadata?.label || `${this.linkTypeLabel(link)} · ${link.entityId}`;
    }
    humanizeSize(bytes) {
        if (!bytes)
            return '—';
        const units = ['B', 'KB', 'MB', 'GB'];
        const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / Math.pow(1024, exponent);
        return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
    }
    applyChange(document) {
        this.document = { ...this.document, ...document };
        this.changed.emit(this.document);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsDetailPanelComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocumentsService }, { token: i3.DocsExportService }, { token: i4.ToastrService }, { token: i5.NbDialogService }, { token: i6.Actions }, { token: i7.Router }, { token: i8.UploadQueueService }, { token: i9.DocumentTreeStore }, { token: i4.TagsService }, { token: i10.DocumentPermissionService }, { token: i4.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsDetailPanelComponent, isStandalone: false, selector: "gz-docs-detail-panel", inputs: { documentId: "documentId" }, outputs: { closed: "closed", changed: "changed", deleted: "deleted", openEditor: "openEditor", openPreview: "openPreview" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"docs-detail\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- Error state -->\n\t<div class=\"docs-detail-error\" *ngIf=\"loadError\">\n\t\t<p>{{ 'DOCS.ERRORS.PANEL_LOAD' | translate }}</p>\n\t\t<button nbButton size=\"small\" status=\"primary\" (click)=\"reload()\">\n\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t</button>\n\t</div>\n\n\t<ng-container *ngIf=\"document as doc\">\n\t\t<!-- Header -->\n\t\t<header class=\"docs-detail-header\">\n\t\t\t<div class=\"docs-detail-title\">\n\t\t\t\t<span class=\"docs-detail-icon\" *ngIf=\"doc.icon; else headerEva\">{{ doc.icon }}</span>\n\t\t\t\t<ng-template #headerEva>\n\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t[icon]=\"doc.kind === kindEnum.FOLDER ? 'folder-outline' : doc.kind === kindEnum.PAGE ? 'file-text-outline' : 'file-outline'\"\n\t\t\t\t\t></nb-icon>\n\t\t\t\t</ng-template>\n\t\t\t\t<h5 class=\"docs-detail-name\" [nbTooltip]=\"doc.originalFilename || doc.name\">{{ doc.name }}</h5>\n\t\t\t\t<ngx-favorite-toggle\n\t\t\t\t\t[entityType]=\"favoriteEntityType\"\n\t\t\t\t\t[entityId]=\"doc.id\"\n\t\t\t\t\t[entityName]=\"doc.name\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tspacing=\"detail\"\n\t\t\t\t></ngx-favorite-toggle>\n\t\t\t\t<button nbButton ghost size=\"small\" class=\"docs-detail-close\" (click)=\"close()\">\n\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"docs-detail-badges\">\n\t\t\t\t<nb-badge status=\"basic\" [text]=\"'DOCS.KIND.' + doc.kind | translate\"></nb-badge>\n\t\t\t\t<gz-docs-status-badge *ngIf=\"doc.kind === kindEnum.FILE\" [rowData]=\"doc\"></gz-docs-status-badge>\n\t\t\t\t<gz-docs-knowledge-badge [rowData]=\"doc\"></gz-docs-knowledge-badge>\n\t\t\t\t<gz-docs-source-badge [rowData]=\"doc\"></gz-docs-source-badge>\n\t\t\t\t<nb-badge *ngIf=\"isArchived\" status=\"warning\" [text]=\"'DOCS.FILTERS.PRESET_ARCHIVED' | translate\"></nb-badge>\n\t\t\t\t<nb-badge *ngIf=\"doc.visibility === 'PRIVATE'\" status=\"basic\" [text]=\"'DOCS.VISIBILITY.PRIVATE' | translate\"></nb-badge>\n\t\t\t\t<span class=\"docs-detail-version\" *ngIf=\"doc.version > 1\">v{{ doc.version }}</span>\n\t\t\t</div>\n\t\t</header>\n\n\t\t<!-- Dedup notice (R-UPL-04): advisory only \u2014 the upload was never dropped -->\n\t\t<div class=\"docs-duplicate-notice\" *ngIf=\"duplicateNotice as duplicate\">\n\t\t\t<nb-icon icon=\"copy-outline\"></nb-icon>\n\t\t\t<span>\n\t\t\t\t{{\n\t\t\t\t\tduplicate.name\n\t\t\t\t\t\t? ('DOCS.UPLOAD.DUPLICATE_NOTICE' | translate : { name: duplicate.name })\n\t\t\t\t\t\t: ('DOCS.UPLOAD.DUPLICATE_NOTICE_UNKNOWN' | translate)\n\t\t\t\t}}\n\t\t\t</span>\n\t\t</div>\n\n\t\t<!-- Review banner -->\n\t\t<div class=\"docs-review-banner\" *ngIf=\"showReviewBanner\">\n\t\t\t<div class=\"docs-review-banner-head\">\n\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon>\n\t\t\t\t<strong>{{ 'DOCS.REVIEW.BANNER_TITLE' | translate }}</strong>\n\t\t\t\t<nb-badge\n\t\t\t\t\t*ngIf=\"doc.reviewReason\"\n\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t[text]=\"'DOCS.REVIEW.REASONS.' + (doc.reviewReason || '').toUpperCase().split('-').join('_') | translate\"\n\t\t\t\t></nb-badge>\n\t\t\t</div>\n\t\t\t<p>{{ 'DOCS.REVIEW.BANNER_BODY' | translate }}</p>\n\t\t\t<div class=\"docs-review-banner-actions\" *ngxPermissionsOnly=\"docsPermissions.review\">\n\t\t\t\t<button nbButton size=\"tiny\" status=\"success\" (click)=\"approveReview()\">\n\t\t\t\t\t{{ 'DOCS.REVIEW.APPROVE' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button nbButton size=\"tiny\" status=\"danger\" appearance=\"outline\" (click)=\"rejectReview()\">\n\t\t\t\t\t{{ 'DOCS.REVIEW.REJECT' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"isSettledFile\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tghost\n\t\t\t\t\t(click)=\"openExtractedText()\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.DETAIL.EDIT_EXTRACTED_TEXT' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<!-- Actions -->\n\t\t<div class=\"docs-detail-actions\">\n\t\t\t<button *ngIf=\"doc.kind === kindEnum.FILE\" nbButton size=\"tiny\" status=\"primary\" (click)=\"preview()\">\n\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.PREVIEW.TITLE' | translate }}\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"doc.kind === kindEnum.FILE\"\n\t\t\t\tnbButton\n\t\t\t\tsize=\"tiny\"\n\t\t\t\t[disabled]=\"downloading\"\n\t\t\t\t(click)=\"download()\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.PREVIEW.DOWNLOAD' | translate }}\n\t\t\t</button>\n\t\t\t<button *ngIf=\"doc.kind === kindEnum.PAGE\" nbButton size=\"tiny\" status=\"primary\" (click)=\"onOpenEditor()\">\n\t\t\t\t<nb-icon icon=\"edit-2-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.EDITOR.TITLE' | translate }}\n\t\t\t</button>\n\n\t\t\t<!-- Export actions \u2014 PAGE only; FILE keeps the Download action above\n\t\t\t     (spec 01 \u00A710.9 / 05 \u00A79.1). -->\n\t\t\t<ng-container *ngIf=\"isPage\">\n\t\t\t\t<button nbButton size=\"tiny\" [disabled]=\"exporting\" (click)=\"copyMarkdown()\">\n\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.EDITOR.COPY_MARKDOWN' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t[disabled]=\"exporting\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.EXPORT.MARKDOWN_HINT' | translate\"\n\t\t\t\t\t(click)=\"exportMarkdown()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.EXPORT.MARKDOWN' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t[disabled]=\"exporting\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.EXPORT.PRINT_HINT' | translate\"\n\t\t\t\t\t(click)=\"print()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"printer-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.EXPORT.PRINT' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-container>\n\n\t\t\t<!-- Share / visibility (spec 08 \u00A73) \u2014 DOCS_UPDATE, same as the mutations below.\n\t\t\t     `canMutate` is the ownership half: administering shares is creator-or-DOCS_MANAGE\n\t\t\t     only (\u00A73.3 / \u00A71.5), which is exactly what `canMutate` answers. -->\n\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t<button *ngIf=\"canMutate\" nbButton size=\"tiny\" (click)=\"openShare()\">\n\t\t\t\t\t<nb-icon icon=\"share-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.SHARE.ACTION' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-container>\n\n\t\t\t<!-- Every control below writes the document, so each carries BOTH halves of the\n\t\t\t     server's write rule: the DOCS_UPDATE gate and the `canMutate` ownership scope\n\t\t\t     (`08-permissions-security.md` \u00A71.7/\u00A71.8 \u2014 edit/move/archive are **own** for\n\t\t\t     everyone below ADMIN). -->\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.update\">\n\t\t\t\t<ng-container *ngIf=\"canMutate\">\n\t\t\t\t\t<button *ngIf=\"isSettledFile\" nbButton size=\"tiny\" (click)=\"openExtractedText()\">\n\t\t\t\t\t\t{{ 'DOCS.DETAIL.EDIT_EXTRACTED_TEXT' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button *ngIf=\"doc.kind === kindEnum.FILE\" nbButton size=\"tiny\" (click)=\"reprocess()\">\n\t\t\t\t\t\t<nb-icon icon=\"refresh-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.UPLOAD.RETRY' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<!-- Manual review request (spec 01 \u00A711) \u2014 the only way into the review\n\t\t\t\t\t     queue when AI is disabled. Hidden while PENDING (the banner above is\n\t\t\t\t\t     that state) and on archived documents. -->\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"canRequestReview\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t\tappearance=\"outline\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.REVIEW.REQUEST_HINT' | translate\"\n\t\t\t\t\t\t(click)=\"requestReview()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.REVIEW.REQUEST' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button nbButton size=\"tiny\" (click)=\"toggleArchive()\">\n\t\t\t\t\t\t<nb-icon [icon]=\"isArchived ? 'undo-outline' : 'archive-outline'\"></nb-icon>\n\t\t\t\t\t\t{{ (isArchived ? 'DOCS.TREE.RESTORE' : 'DOCS.TREE.ARCHIVE') | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.delete\">\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"isArchived && canMutate\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\tappearance=\"outline\"\n\t\t\t\t\t(click)=\"remove()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.TREE.DELETE' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t</div>\n\n\t\t<!-- AI summary -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<h6>\n\t\t\t\t{{ 'DOCS.DETAIL.SUMMARY' | translate }}\n\t\t\t\t<button\n\t\t\t\t\t*ngxPermissionsOnly=\"docsPermissions.aiImport\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t(click)=\"regenerateSummary()\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.DETAIL.REGENERATE_SUMMARY' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"refresh-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</h6>\n\t\t\t<p *ngIf=\"doc.summary; else noSummary\">{{ doc.summary }}</p>\n\t\t\t<ng-template #noSummary>\n\t\t\t\t<p class=\"muted\">{{ 'DOCS.DETAIL.NO_SUMMARY' | translate }}</p>\n\t\t\t</ng-template>\n\t\t\t<span class=\"docs-confidence\" *ngIf=\"doc.aiConfidence !== undefined && doc.aiConfidence !== null\">\n\t\t\t\t{{ 'DOCS.DETAIL.CONFIDENCE' | translate }}: {{ doc.aiConfidence | percent }}\n\t\t\t</span>\n\n\t\t\t<!-- AI suggested tags (spec 07 \u00A75.2) \u2014 accept chips are the ONLY path from\n\t\t\t     `metadata.ai.suggestedTags` to a real Tag: the pipeline deliberately never\n\t\t\t     creates tag rows itself. Writing tags needs DOCS_UPDATE, same as the taxonomy\n\t\t\t     editor below. -->\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.update\">\n\t\t\t\t<div class=\"docs-suggested-tags\" *ngIf=\"suggestedTags.length && canMutate\">\n\t\t\t\t\t<span class=\"docs-suggested-tags-label\" [nbTooltip]=\"'DOCS.DETAIL.SUGGESTED_TAGS_HINT' | translate\">\n\t\t\t\t\t\t{{ 'DOCS.DETAIL.SUGGESTED_TAGS' | translate }}\n\t\t\t\t\t</span>\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngFor=\"let suggestion of suggestedTags; trackBy: trackBySuggestion\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tclass=\"docs-suggested-tag\"\n\t\t\t\t\t\t[disabled]=\"!!acceptingTag\"\n\t\t\t\t\t\t[attr.aria-busy]=\"acceptingTag === suggestion\"\n\t\t\t\t\t\t(click)=\"acceptSuggestedTag(suggestion)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t{{ suggestion }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</ng-template>\n\t\t</section>\n\n\t\t<!-- Metadata -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<h6>{{ 'DOCS.DETAIL.METADATA' | translate }}</h6>\n\t\t\t<dl class=\"docs-detail-meta\">\n\t\t\t\t<ng-container *ngIf=\"doc.kind === kindEnum.FILE\">\n\t\t\t\t\t<dt>{{ 'DOCS.DETAIL.MIME' | translate }}</dt>\n\t\t\t\t\t<dd class=\"docs-detail-meta-ellipsis\" [nbTooltip]=\"doc.mimeType || ''\" nbTooltipStatus=\"basic\">\n\t\t\t\t\t\t{{ doc.mimeType || '\u2014' }}\n\t\t\t\t\t</dd>\n\t\t\t\t\t<dt>{{ 'DOCS.TABLE.COLUMNS.SIZE' | translate }}</dt>\n\t\t\t\t\t<dd class=\"docs-detail-meta-ellipsis\">{{ humanizeSize(doc.fileSize) }}</dd>\n\t\t\t\t</ng-container>\n\t\t\t\t<dt>{{ 'DOCS.TABLE.COLUMNS.SOURCE' | translate }}</dt>\n\t\t\t\t<dd class=\"docs-detail-meta-ellipsis\">{{ 'DOCS.SOURCE.' + doc.source | translate }}</dd>\n\t\t\t\t<dt>{{ 'DOCS.VISIBILITY.LABEL' | translate }}</dt>\n\t\t\t\t<dd class=\"docs-detail-meta-ellipsis\">{{ 'DOCS.VISIBILITY.' + doc.visibility | translate }}</dd>\n\t\t\t\t<!-- Created / Updated carry the person as well as the moment (spec 01 \u00A78.4).\n\t\t\t\t     The name is appended only when the relation actually came back \u2014 an\n\t\t\t\t     \"unknown\" placeholder reads like a real attribution. -->\n\t\t\t\t<dt>{{ 'DOCS.DETAIL.CREATED' | translate }}</dt>\n\t\t\t\t<dd>\n\t\t\t\t\t{{ doc.createdAt | date : 'medium' }}\n\t\t\t\t\t<span class=\"docs-detail-actor\" *ngIf=\"userLabel(doc.createdByUser) as creator\">\n\t\t\t\t\t\t\u00B7 {{ creator }}\n\t\t\t\t\t</span>\n\t\t\t\t</dd>\n\t\t\t\t<dt>{{ 'DOCS.TABLE.COLUMNS.UPDATED' | translate }}</dt>\n\t\t\t\t<dd>\n\t\t\t\t\t{{ doc.updatedAt | date : 'medium' }}\n\t\t\t\t\t<span class=\"docs-detail-actor\" *ngIf=\"userLabel(doc.updatedByUser) as updater\">\n\t\t\t\t\t\t\u00B7 {{ updater }}\n\t\t\t\t\t</span>\n\t\t\t\t</dd>\n\t\t\t\t<!-- Location: the \"where does this live\" affordance a `?id=` deep link has no\n\t\t\t\t     other way to answer. Each crumb drills the browse list into that folder. -->\n\t\t\t\t<dt>{{ 'DOCS.DETAIL.LOCATION' | translate }}</dt>\n\t\t\t\t<dd class=\"docs-detail-location\">\n\t\t\t\t\t<button type=\"button\" class=\"docs-detail-crumb\" (click)=\"openLocation(null)\">\n\t\t\t\t\t\t{{ 'DOCS.TREE.ALL_DOCUMENTS' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<ng-container *ngFor=\"let crumb of location\">\n\t\t\t\t\t\t<span class=\"docs-detail-crumb-sep\">/</span>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tclass=\"docs-detail-crumb\"\n\t\t\t\t\t\t\t[nbTooltip]=\"crumb.name\"\n\t\t\t\t\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t\t\t\t\t(click)=\"openLocation(crumb.id)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ crumb.name }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</dd>\n\t\t\t</dl>\n\t\t</section>\n\n\t\t<!-- Taxonomy \u2014 the editable form needs DOCS_UPDATE **and** the ownership scope; either\n\t\t     one missing falls back to the same read-only chips (spec 08 \u00A71.7). -->\n\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update; else taxonomyReadonly\">\n\t\t\t<section class=\"docs-detail-section\" *ngIf=\"canMutate; else taxonomyReadonly\">\n\t\t\t\t<h6>{{ 'DOCS.DETAIL.CATEGORIES' | translate }}</h6>\n\t\t\t\t<nb-select\n\t\t\t\t\tmultiple\n\t\t\t\t\tfullWidth\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[selected]=\"selectedCategoryIds\"\n\t\t\t\t\t(selectedChange)=\"onCategoriesChange($event)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-option *ngFor=\"let category of categories\" [value]=\"category.id\">{{ category.name }}</nb-option>\n\t\t\t\t</nb-select>\n\t\t\t\t<h6>{{ 'DOCS.DETAIL.TAGS' | translate }}</h6>\n\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t[label]=\"false\"\n\t\t\t\t\t[selectedTags]=\"doc.tags || []\"\n\t\t\t\t\t(selectedTagsEvent)=\"onTagsChange($event)\"\n\t\t\t\t></ga-tags-color-input>\n\t\t\t</section>\n\t\t</ng-container>\n\t\t<ng-template #taxonomyReadonly>\n\t\t\t<section class=\"docs-detail-section\">\n\t\t\t\t<h6>{{ 'DOCS.DETAIL.CATEGORIES' | translate }}</h6>\n\t\t\t\t<gz-docs-category-chips [rowData]=\"doc\" [max]=\"99\"></gz-docs-category-chips>\n\t\t\t\t<h6>{{ 'DOCS.DETAIL.TAGS' | translate }}</h6>\n\t\t\t\t<gz-docs-tag-chips [rowData]=\"doc\" [max]=\"99\"></gz-docs-tag-chips>\n\t\t\t</section>\n\t\t</ng-template>\n\n\t\t<!-- Toggles -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<!-- `searchable` is a document write (\u00A71.8 \"Edit metadata \u2026 `searchable` toggle\" \u2014\n\t\t\t     own), so it carries the ownership scope on top of DOCS_UPDATE. -->\n\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t<div class=\"docs-detail-toggle\" *ngIf=\"canMutate\">\n\t\t\t\t\t<nb-toggle [checked]=\"doc.searchable\" (checkedChange)=\"onSearchableToggle($event)\" labelPosition=\"end\">\n\t\t\t\t\t\t{{ 'DOCS.DETAIL.SEARCHABLE_TOGGLE' | translate }}\n\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.DETAIL.SEARCHABLE_HINT' | translate }}</div>\n\t\t\t\t</div>\n\t\t\t</ng-container>\n\t\t\t<div class=\"docs-detail-toggle\" *ngxPermissionsOnly=\"docsPermissions.aiImport\">\n\t\t\t\t<nb-toggle [checked]=\"inKnowledge\" (checkedChange)=\"onKnowledgeToggle($event)\" labelPosition=\"end\">\n\t\t\t\t\t{{ 'DOCS.KNOWLEDGE.TOGGLE_LABEL' | translate }}\n\t\t\t\t</nb-toggle>\n\t\t\t\t<div class=\"hint\">{{ 'DOCS.KNOWLEDGE.TOGGLE_HINT' | translate }}</div>\n\t\t\t\t<!-- Live knowledge status: badge + in-flight spinner + FAILED retry -->\n\t\t\t\t<div class=\"docs-knowledge-status\">\n\t\t\t\t\t<gz-docs-knowledge-badge [rowData]=\"doc\"></gz-docs-knowledge-badge>\n\t\t\t\t\t<nb-icon *ngIf=\"knowledgeInFlight\" icon=\"loader-outline\" class=\"docs-knowledge-spinner\"></nb-icon>\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"doc.knowledgeStatus === knowledgeEnum.FAILED\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t(click)=\"retryKnowledge()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.UPLOAD.RETRY' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"doc.knowledgeStatus === knowledgeEnum.INDEXED\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t(click)=\"reindex()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.KNOWLEDGE.REINDEX_ACTION' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</section>\n\n\t\t<!-- Linked records (spec 01 \u00A78.9) -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<h6 class=\"docs-detail-section-head\">\n\t\t\t\t<span>{{ 'DOCS.DETAIL.LINKS' | translate }}</span>\n\t\t\t\t<!-- Link/unlink is a document write, scoped to **own** below ADMIN (\u00A71.8). -->\n\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t\t<button *ngIf=\"canMutate\" nbButton ghost size=\"tiny\" (click)=\"addLink()\">\n\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.DETAIL.LINK_RECORD' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\t\t\t</h6>\n\t\t\t<p class=\"muted\" *ngIf=\"!links.length\">{{ 'DOCS.DETAIL.NO_LINKS' | translate }}</p>\n\t\t\t<div class=\"docs-detail-link\" *ngFor=\"let link of links\">\n\t\t\t\t<nb-icon [icon]=\"linkIcon(link)\" size=\"tiny\" [nbTooltip]=\"linkTypeLabel(link)\"></nb-icon>\n\t\t\t\t<!-- Deep link when the entity has a detail route; plain text otherwise\n\t\t\t\t     (a dead link is worse than no link). -->\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"hasLinkRoute(link); else linkPlain\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"docs-detail-link-open\"\n\t\t\t\t\t[nbTooltip]=\"linkLabel(link)\"\n\t\t\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t\t\t(click)=\"openLink(link)\"\n\t\t\t\t>\n\t\t\t\t\t{{ linkLabel(link) }}\n\t\t\t\t</button>\n\t\t\t\t<ng-template #linkPlain>\n\t\t\t\t\t<span class=\"docs-detail-link-label\" [nbTooltip]=\"linkLabel(link)\" nbTooltipStatus=\"basic\">{{\n\t\t\t\t\t\tlinkLabel(link)\n\t\t\t\t\t}}</span>\n\t\t\t\t</ng-template>\n\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"canMutate\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.LINKS.REMOVE' | translate\"\n\t\t\t\t\t\t(click)=\"removeLink(link)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\t\t\t</div>\n\t\t</section>\n\n\t\t<!-- Comments \u2014 the platform's generic comment API bound to\n\t\t     (BaseEntityEnum.Document, id) (spec 08 \u00A71). Reading follows document\n\t\t     read access, so the section itself is DOCS_READ-gated; the composer\n\t\t     gates itself further (see the thread component). -->\n\t\t<section class=\"docs-detail-section\" *ngxPermissionsOnly=\"docsPermissions.read\">\n\t\t\t<h6>{{ 'DOCS.DETAIL.COMMENTS' | translate }}</h6>\n\t\t\t<gz-docs-detail-comments [documentId]=\"doc.id\" [documentName]=\"doc.name\"></gz-docs-detail-comments>\n\t\t</section>\n\n\t\t<!-- Activity \u2014 the core activity log bound to (BaseEntityEnum.Document, id)\n\t\t     (R-COL-03). Newest first, \"Show more\" paging, system transitions attributed\n\t\t     to \"System\"; the section is fault-isolated inside the child component so a\n\t\t     failing read never takes the panel down. -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<h6>{{ 'DOCS.DETAIL.ACTIVITY' | translate }}</h6>\n\t\t\t<gz-docs-detail-activity [documentId]=\"doc.id\"></gz-docs-detail-activity>\n\t\t</section>\n\t</ng-container>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-detail{--docs-page-padding: 1rem;--docs-body-size: .75rem;--docs-meta-size: .6875rem;--docs-label-size: .625rem;--gauzy-table-badge-height: 1.125rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-padding-x: .3125rem;display:flex;flex-direction:column;gap:.625rem;padding:0 var(--docs-page-padding, 1rem) var(--docs-page-padding, 1rem);min-height:12rem;font-size:var(--docs-body-size, .75rem);line-height:1.4;color:var(--docs-text, var(--text-basic-color))}.docs-detail-error{display:flex;flex-direction:column;align-items:center;gap:.75rem;text-align:center;padding:2.5rem 1rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-error p{margin:0}.docs-detail-header{position:sticky;top:0;z-index:2;display:flex;flex-direction:column;gap:.375rem;margin-inline:calc(var(--docs-page-padding, 1rem) * -1);padding:.625rem var(--docs-page-padding, 1rem);background:var(--docs-surface, var(--background-basic-color-1));border-bottom:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-detail-title{display:flex;align-items:center;gap:.5rem;min-width:0}.docs-detail-title .docs-detail-icon{flex:0 0 auto;font-size:1.125rem;line-height:1}.docs-detail-title>nb-icon{flex:0 0 auto;font-size:1.125rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-title .docs-detail-name{flex:1 1 auto;min-width:0;margin:0;font-size:.875rem;font-weight:600;line-height:1.25rem;letter-spacing:-.01em;color:var(--docs-text, var(--text-basic-color));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-detail-title .docs-detail-close{flex:0 0 auto;width:var(--docs-control-height-sm, 1.75rem);height:var(--docs-control-height-sm, 1.75rem);padding:0;border-radius:var(--docs-radius, .375rem)}.docs-detail-title .docs-detail-close nb-icon{margin:0;font-size:1rem}.docs-detail-badges{display:flex;align-items:center;gap:.25rem;flex-wrap:wrap}.docs-detail-badges .docs-detail-version{font-size:var(--docs-label-size, .6875rem);font-variant-numeric:tabular-nums;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;max-width:100%;height:var(--gauzy-table-badge-height, 1.125rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transform:none}.docs-duplicate-notice{display:flex;align-items:center;gap:.375rem;padding:.375rem .5rem;border-radius:var(--docs-radius, .375rem);background:var(--docs-surface-sunken, var(--background-basic-color-2));font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-duplicate-notice nb-icon{flex:0 0 auto;font-size:.875rem}.docs-review-banner{border-radius:var(--docs-radius, .375rem);padding:.625rem .75rem;background:var(--color-warning-transparent-100, rgba(255, 170, 0, .08));box-shadow:inset 0 0 0 1px var(--color-warning-default)}.docs-review-banner .docs-review-banner-head{display:flex;align-items:center;gap:.375rem;flex-wrap:wrap;font-size:var(--docs-body-size, .8125rem)}.docs-review-banner .docs-review-banner-head nb-icon{flex:0 0 auto;font-size:1rem;color:var(--color-warning-default)}.docs-review-banner .docs-review-banner-head strong{font-weight:600}.docs-review-banner .docs-review-banner-actions{display:flex;flex-wrap:wrap;gap:.375rem;margin-top:.625rem}.docs-review-banner p{margin:.375rem 0 0;font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-actions{display:flex;gap:.375rem;flex-wrap:wrap}.docs-detail-actions button[nbButton],.docs-review-banner-actions button[nbButton]{display:inline-flex;align-items:center;gap:.375rem;height:1.5rem;min-height:1.5rem;padding-inline:.4375rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .6875rem);font-weight:500;white-space:nowrap}.docs-detail-actions button[nbButton] nb-icon,.docs-review-banner-actions button[nbButton] nb-icon{margin:0;font-size:.8125rem}.docs-detail-section{display:flex;flex-direction:column;gap:.3125rem;padding-top:.625rem;border-top:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-detail-section h6{display:flex;align-items:center;gap:.375rem;margin:0;font-size:var(--docs-label-size, .6875rem);font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-section h6+*+h6{margin-top:.5rem}.docs-detail-section p{margin:0;overflow-wrap:anywhere}.docs-detail-section .muted{color:var(--docs-text-muted, var(--text-hint-color));margin:0}.docs-detail-section h6 button[nbButton]{height:1.25rem;min-height:1.25rem;padding-inline:.25rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-label-size, .6875rem)}.docs-detail-section h6 button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-detail-section-head{justify-content:space-between}.docs-detail-section-head>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-detail-meta{display:grid;grid-template-columns:minmax(4.5rem,6.5rem) minmax(0,1fr);gap:.25rem .625rem;margin:0;font-size:var(--docs-meta-size, .75rem)}.docs-detail-meta dt{min-width:0;color:var(--docs-text-muted, var(--text-hint-color));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-detail-meta dd{min-width:0;margin:0;overflow-wrap:anywhere}.docs-detail-meta dd.docs-detail-meta-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-detail-actor{color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-location{display:flex;align-items:center;flex-wrap:wrap;gap:.25rem}.docs-detail-location .docs-detail-crumb-sep{color:var(--docs-text-muted, var(--text-hint-color));opacity:.7}.docs-detail-location .docs-detail-crumb{max-width:10rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0;border:0;background:transparent;color:var(--text-primary-color);font:inherit;cursor:pointer}.docs-detail-location .docs-detail-crumb:hover{text-decoration:underline}.docs-detail-toggle{display:flex;flex-direction:column;gap:.25rem}.docs-detail-toggle+.docs-detail-toggle{margin-top:.75rem}.docs-detail-toggle ::ng-deep nb-toggle .label{font-size:var(--docs-body-size, .8125rem)}.docs-detail-toggle .hint{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-knowledge-status{display:flex;align-items:center;flex-wrap:wrap;gap:.375rem;margin-top:.125rem}.docs-knowledge-status button[nbButton]{height:1.5rem;min-height:1.5rem;padding-inline:.375rem;font-size:var(--docs-meta-size, .75rem)}.docs-knowledge-status .docs-knowledge-spinner{font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color));animation:docs-spin 1.2s linear infinite}.docs-detail-link{display:flex;align-items:center;gap:.375rem;padding:.25rem 0;font-size:var(--docs-body-size, .8125rem)}.docs-detail-link+.docs-detail-link{border-top:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-detail-link>nb-icon{flex:0 0 auto;font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-link .docs-detail-link-open,.docs-detail-link .docs-detail-link-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}.docs-detail-link .docs-detail-link-open{padding:0;border:0;background:transparent;color:var(--text-primary-color);font:inherit;cursor:pointer}.docs-detail-link .docs-detail-link-open:hover{text-decoration:underline}.docs-detail-link button[nbButton]{flex:0 0 auto;width:1.5rem;height:1.5rem;padding:0}.docs-detail-link button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-confidence{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-suggested-tags{display:flex;align-items:center;flex-wrap:wrap;gap:.25rem;margin-top:.25rem}.docs-suggested-tags .docs-suggested-tags-label{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-suggested-tags .docs-suggested-tag{display:inline-flex;align-items:center;gap:.125rem;max-width:10rem;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border:1px dashed var(--border-basic-color-4);border-radius:var(--docs-radius, .375rem);background:transparent;color:var(--docs-text-muted, var(--text-hint-color));font:inherit;font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}.docs-suggested-tags .docs-suggested-tag nb-icon{flex:0 0 auto;font-size:.75rem}.docs-suggested-tags .docs-suggested-tag:hover:not([disabled]){color:var(--text-primary-color);border-color:var(--color-primary-default);border-style:solid}.docs-suggested-tags .docs-suggested-tag[disabled]{cursor:default;opacity:.6}@keyframes docs-spin{to{transform:rotate(360deg)}}@media(max-width:480px){.docs-detail-meta{grid-template-columns:minmax(0,1fr);gap:0 .75rem}.docs-detail-meta dt{margin-top:.375rem}}.docs-detail ::ng-deep .ng-select .ng-select-container,.docs-detail ::ng-deep nb-select .select-button{min-height:var(--docs-control-height-sm, 1.75rem);border:0;border-radius:var(--docs-radius, .375rem)!important;background-color:var(--docs-surface, var(--background-basic-color-1))!important;box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))!important;color:var(--docs-text, var(--text-basic-color));font-size:var(--docs-body-size, .75rem)}.docs-detail ::ng-deep .ng-select .ng-select-container .ng-value-container{padding-inline-start:.375rem;gap:.1875rem}.docs-detail ::ng-deep .ng-select .ng-placeholder{color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-meta-size, .6875rem)}.docs-detail ::ng-deep .ng-select .ng-arrow-wrapper,.docs-detail ::ng-deep .ng-select .ng-clear-wrapper{color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail ::ng-deep .ng-value .tag-color.tag-label{position:static;display:inline-flex;align-items:center;width:auto;max-width:9rem;height:1.125rem;margin:0;padding:0 .3125rem;border-radius:var(--docs-radius, .375rem);font-size:.625rem;font-weight:500;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transform:none}.docs-detail ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin:0;background:transparent}\n"], dependencies: [{ kind: "directive", type: i11.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i11.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i12.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i5.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i5.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i5.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i5.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i5.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "directive", type: i5.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i13.FavoriteToggleComponent, selector: "ngx-favorite-toggle", inputs: ["entityType", "entityId", "entityName", "size", "status", "disabled", "showLabel", "spacing"], outputs: ["favoriteToggled"] }, { kind: "component", type: i13.TagsColorInputComponent, selector: "ga-tags-color-input", inputs: ["selectedTags", "isOrgLevel", "isTenantLevel", "multiple", "label", "addTag"], outputs: ["selectedTagsEvent"] }, { kind: "component", type: i14.StatusBadgeComponent, selector: "gz-docs-status-badge", inputs: ["rowData", "value"] }, { kind: "component", type: i15.KnowledgeBadgeComponent, selector: "gz-docs-knowledge-badge", inputs: ["rowData", "value"] }, { kind: "component", type: i16.SourceBadgeComponent, selector: "gz-docs-source-badge", inputs: ["rowData", "value"] }, { kind: "component", type: i17.CategoryChipsComponent, selector: "gz-docs-category-chips", inputs: ["rowData", "value", "max"] }, { kind: "component", type: i18.TagChipsComponent, selector: "gz-docs-tag-chips", inputs: ["rowData", "value", "max"] }, { kind: "component", type: i19.DocsDetailActivityComponent, selector: "gz-docs-detail-activity", inputs: ["documentId"] }, { kind: "component", type: i20.DocumentCommentsComponent, selector: "gz-docs-detail-comments", inputs: ["documentId", "documentName"] }, { kind: "pipe", type: i11.PercentPipe, name: "percent" }, { kind: "pipe", type: i11.DatePipe, name: "date" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsDetailPanelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-detail-panel', standalone: false, template: "<div class=\"docs-detail\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<!-- Error state -->\n\t<div class=\"docs-detail-error\" *ngIf=\"loadError\">\n\t\t<p>{{ 'DOCS.ERRORS.PANEL_LOAD' | translate }}</p>\n\t\t<button nbButton size=\"small\" status=\"primary\" (click)=\"reload()\">\n\t\t\t{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}\n\t\t</button>\n\t</div>\n\n\t<ng-container *ngIf=\"document as doc\">\n\t\t<!-- Header -->\n\t\t<header class=\"docs-detail-header\">\n\t\t\t<div class=\"docs-detail-title\">\n\t\t\t\t<span class=\"docs-detail-icon\" *ngIf=\"doc.icon; else headerEva\">{{ doc.icon }}</span>\n\t\t\t\t<ng-template #headerEva>\n\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t[icon]=\"doc.kind === kindEnum.FOLDER ? 'folder-outline' : doc.kind === kindEnum.PAGE ? 'file-text-outline' : 'file-outline'\"\n\t\t\t\t\t></nb-icon>\n\t\t\t\t</ng-template>\n\t\t\t\t<h5 class=\"docs-detail-name\" [nbTooltip]=\"doc.originalFilename || doc.name\">{{ doc.name }}</h5>\n\t\t\t\t<ngx-favorite-toggle\n\t\t\t\t\t[entityType]=\"favoriteEntityType\"\n\t\t\t\t\t[entityId]=\"doc.id\"\n\t\t\t\t\t[entityName]=\"doc.name\"\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tspacing=\"detail\"\n\t\t\t\t></ngx-favorite-toggle>\n\t\t\t\t<button nbButton ghost size=\"small\" class=\"docs-detail-close\" (click)=\"close()\">\n\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"docs-detail-badges\">\n\t\t\t\t<nb-badge status=\"basic\" [text]=\"'DOCS.KIND.' + doc.kind | translate\"></nb-badge>\n\t\t\t\t<gz-docs-status-badge *ngIf=\"doc.kind === kindEnum.FILE\" [rowData]=\"doc\"></gz-docs-status-badge>\n\t\t\t\t<gz-docs-knowledge-badge [rowData]=\"doc\"></gz-docs-knowledge-badge>\n\t\t\t\t<gz-docs-source-badge [rowData]=\"doc\"></gz-docs-source-badge>\n\t\t\t\t<nb-badge *ngIf=\"isArchived\" status=\"warning\" [text]=\"'DOCS.FILTERS.PRESET_ARCHIVED' | translate\"></nb-badge>\n\t\t\t\t<nb-badge *ngIf=\"doc.visibility === 'PRIVATE'\" status=\"basic\" [text]=\"'DOCS.VISIBILITY.PRIVATE' | translate\"></nb-badge>\n\t\t\t\t<span class=\"docs-detail-version\" *ngIf=\"doc.version > 1\">v{{ doc.version }}</span>\n\t\t\t</div>\n\t\t</header>\n\n\t\t<!-- Dedup notice (R-UPL-04): advisory only \u2014 the upload was never dropped -->\n\t\t<div class=\"docs-duplicate-notice\" *ngIf=\"duplicateNotice as duplicate\">\n\t\t\t<nb-icon icon=\"copy-outline\"></nb-icon>\n\t\t\t<span>\n\t\t\t\t{{\n\t\t\t\t\tduplicate.name\n\t\t\t\t\t\t? ('DOCS.UPLOAD.DUPLICATE_NOTICE' | translate : { name: duplicate.name })\n\t\t\t\t\t\t: ('DOCS.UPLOAD.DUPLICATE_NOTICE_UNKNOWN' | translate)\n\t\t\t\t}}\n\t\t\t</span>\n\t\t</div>\n\n\t\t<!-- Review banner -->\n\t\t<div class=\"docs-review-banner\" *ngIf=\"showReviewBanner\">\n\t\t\t<div class=\"docs-review-banner-head\">\n\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon>\n\t\t\t\t<strong>{{ 'DOCS.REVIEW.BANNER_TITLE' | translate }}</strong>\n\t\t\t\t<nb-badge\n\t\t\t\t\t*ngIf=\"doc.reviewReason\"\n\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t[text]=\"'DOCS.REVIEW.REASONS.' + (doc.reviewReason || '').toUpperCase().split('-').join('_') | translate\"\n\t\t\t\t></nb-badge>\n\t\t\t</div>\n\t\t\t<p>{{ 'DOCS.REVIEW.BANNER_BODY' | translate }}</p>\n\t\t\t<div class=\"docs-review-banner-actions\" *ngxPermissionsOnly=\"docsPermissions.review\">\n\t\t\t\t<button nbButton size=\"tiny\" status=\"success\" (click)=\"approveReview()\">\n\t\t\t\t\t{{ 'DOCS.REVIEW.APPROVE' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button nbButton size=\"tiny\" status=\"danger\" appearance=\"outline\" (click)=\"rejectReview()\">\n\t\t\t\t\t{{ 'DOCS.REVIEW.REJECT' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"isSettledFile\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tghost\n\t\t\t\t\t(click)=\"openExtractedText()\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.DETAIL.EDIT_EXTRACTED_TEXT' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<!-- Actions -->\n\t\t<div class=\"docs-detail-actions\">\n\t\t\t<button *ngIf=\"doc.kind === kindEnum.FILE\" nbButton size=\"tiny\" status=\"primary\" (click)=\"preview()\">\n\t\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.PREVIEW.TITLE' | translate }}\n\t\t\t</button>\n\t\t\t<button\n\t\t\t\t*ngIf=\"doc.kind === kindEnum.FILE\"\n\t\t\t\tnbButton\n\t\t\t\tsize=\"tiny\"\n\t\t\t\t[disabled]=\"downloading\"\n\t\t\t\t(click)=\"download()\"\n\t\t\t>\n\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.PREVIEW.DOWNLOAD' | translate }}\n\t\t\t</button>\n\t\t\t<button *ngIf=\"doc.kind === kindEnum.PAGE\" nbButton size=\"tiny\" status=\"primary\" (click)=\"onOpenEditor()\">\n\t\t\t\t<nb-icon icon=\"edit-2-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.EDITOR.TITLE' | translate }}\n\t\t\t</button>\n\n\t\t\t<!-- Export actions \u2014 PAGE only; FILE keeps the Download action above\n\t\t\t     (spec 01 \u00A710.9 / 05 \u00A79.1). -->\n\t\t\t<ng-container *ngIf=\"isPage\">\n\t\t\t\t<button nbButton size=\"tiny\" [disabled]=\"exporting\" (click)=\"copyMarkdown()\">\n\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.EDITOR.COPY_MARKDOWN' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t[disabled]=\"exporting\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.EXPORT.MARKDOWN_HINT' | translate\"\n\t\t\t\t\t(click)=\"exportMarkdown()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.EXPORT.MARKDOWN' | translate }}\n\t\t\t\t</button>\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t[disabled]=\"exporting\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.EXPORT.PRINT_HINT' | translate\"\n\t\t\t\t\t(click)=\"print()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"printer-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.EXPORT.PRINT' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-container>\n\n\t\t\t<!-- Share / visibility (spec 08 \u00A73) \u2014 DOCS_UPDATE, same as the mutations below.\n\t\t\t     `canMutate` is the ownership half: administering shares is creator-or-DOCS_MANAGE\n\t\t\t     only (\u00A73.3 / \u00A71.5), which is exactly what `canMutate` answers. -->\n\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t<button *ngIf=\"canMutate\" nbButton size=\"tiny\" (click)=\"openShare()\">\n\t\t\t\t\t<nb-icon icon=\"share-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.SHARE.ACTION' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-container>\n\n\t\t\t<!-- Every control below writes the document, so each carries BOTH halves of the\n\t\t\t     server's write rule: the DOCS_UPDATE gate and the `canMutate` ownership scope\n\t\t\t     (`08-permissions-security.md` \u00A71.7/\u00A71.8 \u2014 edit/move/archive are **own** for\n\t\t\t     everyone below ADMIN). -->\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.update\">\n\t\t\t\t<ng-container *ngIf=\"canMutate\">\n\t\t\t\t\t<button *ngIf=\"isSettledFile\" nbButton size=\"tiny\" (click)=\"openExtractedText()\">\n\t\t\t\t\t\t{{ 'DOCS.DETAIL.EDIT_EXTRACTED_TEXT' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button *ngIf=\"doc.kind === kindEnum.FILE\" nbButton size=\"tiny\" (click)=\"reprocess()\">\n\t\t\t\t\t\t<nb-icon icon=\"refresh-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.UPLOAD.RETRY' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<!-- Manual review request (spec 01 \u00A711) \u2014 the only way into the review\n\t\t\t\t\t     queue when AI is disabled. Hidden while PENDING (the banner above is\n\t\t\t\t\t     that state) and on archived documents. -->\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"canRequestReview\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t\tappearance=\"outline\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.REVIEW.REQUEST_HINT' | translate\"\n\t\t\t\t\t\t(click)=\"requestReview()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"alert-circle-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.REVIEW.REQUEST' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button nbButton size=\"tiny\" (click)=\"toggleArchive()\">\n\t\t\t\t\t\t<nb-icon [icon]=\"isArchived ? 'undo-outline' : 'archive-outline'\"></nb-icon>\n\t\t\t\t\t\t{{ (isArchived ? 'DOCS.TREE.RESTORE' : 'DOCS.TREE.ARCHIVE') | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.delete\">\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"isArchived && canMutate\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\tappearance=\"outline\"\n\t\t\t\t\t(click)=\"remove()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.TREE.DELETE' | translate }}\n\t\t\t\t</button>\n\t\t\t</ng-template>\n\t\t</div>\n\n\t\t<!-- AI summary -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<h6>\n\t\t\t\t{{ 'DOCS.DETAIL.SUMMARY' | translate }}\n\t\t\t\t<button\n\t\t\t\t\t*ngxPermissionsOnly=\"docsPermissions.aiImport\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tghost\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t(click)=\"regenerateSummary()\"\n\t\t\t\t\t[nbTooltip]=\"'DOCS.DETAIL.REGENERATE_SUMMARY' | translate\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"refresh-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</h6>\n\t\t\t<p *ngIf=\"doc.summary; else noSummary\">{{ doc.summary }}</p>\n\t\t\t<ng-template #noSummary>\n\t\t\t\t<p class=\"muted\">{{ 'DOCS.DETAIL.NO_SUMMARY' | translate }}</p>\n\t\t\t</ng-template>\n\t\t\t<span class=\"docs-confidence\" *ngIf=\"doc.aiConfidence !== undefined && doc.aiConfidence !== null\">\n\t\t\t\t{{ 'DOCS.DETAIL.CONFIDENCE' | translate }}: {{ doc.aiConfidence | percent }}\n\t\t\t</span>\n\n\t\t\t<!-- AI suggested tags (spec 07 \u00A75.2) \u2014 accept chips are the ONLY path from\n\t\t\t     `metadata.ai.suggestedTags` to a real Tag: the pipeline deliberately never\n\t\t\t     creates tag rows itself. Writing tags needs DOCS_UPDATE, same as the taxonomy\n\t\t\t     editor below. -->\n\t\t\t<ng-template [ngxPermissionsOnly]=\"docsPermissions.update\">\n\t\t\t\t<div class=\"docs-suggested-tags\" *ngIf=\"suggestedTags.length && canMutate\">\n\t\t\t\t\t<span class=\"docs-suggested-tags-label\" [nbTooltip]=\"'DOCS.DETAIL.SUGGESTED_TAGS_HINT' | translate\">\n\t\t\t\t\t\t{{ 'DOCS.DETAIL.SUGGESTED_TAGS' | translate }}\n\t\t\t\t\t</span>\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngFor=\"let suggestion of suggestedTags; trackBy: trackBySuggestion\"\n\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\tclass=\"docs-suggested-tag\"\n\t\t\t\t\t\t[disabled]=\"!!acceptingTag\"\n\t\t\t\t\t\t[attr.aria-busy]=\"acceptingTag === suggestion\"\n\t\t\t\t\t\t(click)=\"acceptSuggestedTag(suggestion)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t{{ suggestion }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</ng-template>\n\t\t</section>\n\n\t\t<!-- Metadata -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<h6>{{ 'DOCS.DETAIL.METADATA' | translate }}</h6>\n\t\t\t<dl class=\"docs-detail-meta\">\n\t\t\t\t<ng-container *ngIf=\"doc.kind === kindEnum.FILE\">\n\t\t\t\t\t<dt>{{ 'DOCS.DETAIL.MIME' | translate }}</dt>\n\t\t\t\t\t<dd class=\"docs-detail-meta-ellipsis\" [nbTooltip]=\"doc.mimeType || ''\" nbTooltipStatus=\"basic\">\n\t\t\t\t\t\t{{ doc.mimeType || '\u2014' }}\n\t\t\t\t\t</dd>\n\t\t\t\t\t<dt>{{ 'DOCS.TABLE.COLUMNS.SIZE' | translate }}</dt>\n\t\t\t\t\t<dd class=\"docs-detail-meta-ellipsis\">{{ humanizeSize(doc.fileSize) }}</dd>\n\t\t\t\t</ng-container>\n\t\t\t\t<dt>{{ 'DOCS.TABLE.COLUMNS.SOURCE' | translate }}</dt>\n\t\t\t\t<dd class=\"docs-detail-meta-ellipsis\">{{ 'DOCS.SOURCE.' + doc.source | translate }}</dd>\n\t\t\t\t<dt>{{ 'DOCS.VISIBILITY.LABEL' | translate }}</dt>\n\t\t\t\t<dd class=\"docs-detail-meta-ellipsis\">{{ 'DOCS.VISIBILITY.' + doc.visibility | translate }}</dd>\n\t\t\t\t<!-- Created / Updated carry the person as well as the moment (spec 01 \u00A78.4).\n\t\t\t\t     The name is appended only when the relation actually came back \u2014 an\n\t\t\t\t     \"unknown\" placeholder reads like a real attribution. -->\n\t\t\t\t<dt>{{ 'DOCS.DETAIL.CREATED' | translate }}</dt>\n\t\t\t\t<dd>\n\t\t\t\t\t{{ doc.createdAt | date : 'medium' }}\n\t\t\t\t\t<span class=\"docs-detail-actor\" *ngIf=\"userLabel(doc.createdByUser) as creator\">\n\t\t\t\t\t\t\u00B7 {{ creator }}\n\t\t\t\t\t</span>\n\t\t\t\t</dd>\n\t\t\t\t<dt>{{ 'DOCS.TABLE.COLUMNS.UPDATED' | translate }}</dt>\n\t\t\t\t<dd>\n\t\t\t\t\t{{ doc.updatedAt | date : 'medium' }}\n\t\t\t\t\t<span class=\"docs-detail-actor\" *ngIf=\"userLabel(doc.updatedByUser) as updater\">\n\t\t\t\t\t\t\u00B7 {{ updater }}\n\t\t\t\t\t</span>\n\t\t\t\t</dd>\n\t\t\t\t<!-- Location: the \"where does this live\" affordance a `?id=` deep link has no\n\t\t\t\t     other way to answer. Each crumb drills the browse list into that folder. -->\n\t\t\t\t<dt>{{ 'DOCS.DETAIL.LOCATION' | translate }}</dt>\n\t\t\t\t<dd class=\"docs-detail-location\">\n\t\t\t\t\t<button type=\"button\" class=\"docs-detail-crumb\" (click)=\"openLocation(null)\">\n\t\t\t\t\t\t{{ 'DOCS.TREE.ALL_DOCUMENTS' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<ng-container *ngFor=\"let crumb of location\">\n\t\t\t\t\t\t<span class=\"docs-detail-crumb-sep\">/</span>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tclass=\"docs-detail-crumb\"\n\t\t\t\t\t\t\t[nbTooltip]=\"crumb.name\"\n\t\t\t\t\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t\t\t\t\t(click)=\"openLocation(crumb.id)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ crumb.name }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</dd>\n\t\t\t</dl>\n\t\t</section>\n\n\t\t<!-- Taxonomy \u2014 the editable form needs DOCS_UPDATE **and** the ownership scope; either\n\t\t     one missing falls back to the same read-only chips (spec 08 \u00A71.7). -->\n\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update; else taxonomyReadonly\">\n\t\t\t<section class=\"docs-detail-section\" *ngIf=\"canMutate; else taxonomyReadonly\">\n\t\t\t\t<h6>{{ 'DOCS.DETAIL.CATEGORIES' | translate }}</h6>\n\t\t\t\t<nb-select\n\t\t\t\t\tmultiple\n\t\t\t\t\tfullWidth\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t[selected]=\"selectedCategoryIds\"\n\t\t\t\t\t(selectedChange)=\"onCategoriesChange($event)\"\n\t\t\t\t>\n\t\t\t\t\t<nb-option *ngFor=\"let category of categories\" [value]=\"category.id\">{{ category.name }}</nb-option>\n\t\t\t\t</nb-select>\n\t\t\t\t<h6>{{ 'DOCS.DETAIL.TAGS' | translate }}</h6>\n\t\t\t\t<ga-tags-color-input\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\t[isOrgLevel]=\"true\"\n\t\t\t\t\t[label]=\"false\"\n\t\t\t\t\t[selectedTags]=\"doc.tags || []\"\n\t\t\t\t\t(selectedTagsEvent)=\"onTagsChange($event)\"\n\t\t\t\t></ga-tags-color-input>\n\t\t\t</section>\n\t\t</ng-container>\n\t\t<ng-template #taxonomyReadonly>\n\t\t\t<section class=\"docs-detail-section\">\n\t\t\t\t<h6>{{ 'DOCS.DETAIL.CATEGORIES' | translate }}</h6>\n\t\t\t\t<gz-docs-category-chips [rowData]=\"doc\" [max]=\"99\"></gz-docs-category-chips>\n\t\t\t\t<h6>{{ 'DOCS.DETAIL.TAGS' | translate }}</h6>\n\t\t\t\t<gz-docs-tag-chips [rowData]=\"doc\" [max]=\"99\"></gz-docs-tag-chips>\n\t\t\t</section>\n\t\t</ng-template>\n\n\t\t<!-- Toggles -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<!-- `searchable` is a document write (\u00A71.8 \"Edit metadata \u2026 `searchable` toggle\" \u2014\n\t\t\t     own), so it carries the ownership scope on top of DOCS_UPDATE. -->\n\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t<div class=\"docs-detail-toggle\" *ngIf=\"canMutate\">\n\t\t\t\t\t<nb-toggle [checked]=\"doc.searchable\" (checkedChange)=\"onSearchableToggle($event)\" labelPosition=\"end\">\n\t\t\t\t\t\t{{ 'DOCS.DETAIL.SEARCHABLE_TOGGLE' | translate }}\n\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.DETAIL.SEARCHABLE_HINT' | translate }}</div>\n\t\t\t\t</div>\n\t\t\t</ng-container>\n\t\t\t<div class=\"docs-detail-toggle\" *ngxPermissionsOnly=\"docsPermissions.aiImport\">\n\t\t\t\t<nb-toggle [checked]=\"inKnowledge\" (checkedChange)=\"onKnowledgeToggle($event)\" labelPosition=\"end\">\n\t\t\t\t\t{{ 'DOCS.KNOWLEDGE.TOGGLE_LABEL' | translate }}\n\t\t\t\t</nb-toggle>\n\t\t\t\t<div class=\"hint\">{{ 'DOCS.KNOWLEDGE.TOGGLE_HINT' | translate }}</div>\n\t\t\t\t<!-- Live knowledge status: badge + in-flight spinner + FAILED retry -->\n\t\t\t\t<div class=\"docs-knowledge-status\">\n\t\t\t\t\t<gz-docs-knowledge-badge [rowData]=\"doc\"></gz-docs-knowledge-badge>\n\t\t\t\t\t<nb-icon *ngIf=\"knowledgeInFlight\" icon=\"loader-outline\" class=\"docs-knowledge-spinner\"></nb-icon>\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"doc.knowledgeStatus === knowledgeEnum.FAILED\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t(click)=\"retryKnowledge()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.UPLOAD.RETRY' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"doc.knowledgeStatus === knowledgeEnum.INDEXED\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t(click)=\"reindex()\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.KNOWLEDGE.REINDEX_ACTION' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</section>\n\n\t\t<!-- Linked records (spec 01 \u00A78.9) -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<h6 class=\"docs-detail-section-head\">\n\t\t\t\t<span>{{ 'DOCS.DETAIL.LINKS' | translate }}</span>\n\t\t\t\t<!-- Link/unlink is a document write, scoped to **own** below ADMIN (\u00A71.8). -->\n\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t\t<button *ngIf=\"canMutate\" nbButton ghost size=\"tiny\" (click)=\"addLink()\">\n\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'DOCS.DETAIL.LINK_RECORD' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\t\t\t</h6>\n\t\t\t<p class=\"muted\" *ngIf=\"!links.length\">{{ 'DOCS.DETAIL.NO_LINKS' | translate }}</p>\n\t\t\t<div class=\"docs-detail-link\" *ngFor=\"let link of links\">\n\t\t\t\t<nb-icon [icon]=\"linkIcon(link)\" size=\"tiny\" [nbTooltip]=\"linkTypeLabel(link)\"></nb-icon>\n\t\t\t\t<!-- Deep link when the entity has a detail route; plain text otherwise\n\t\t\t\t     (a dead link is worse than no link). -->\n\t\t\t\t<button\n\t\t\t\t\t*ngIf=\"hasLinkRoute(link); else linkPlain\"\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"docs-detail-link-open\"\n\t\t\t\t\t[nbTooltip]=\"linkLabel(link)\"\n\t\t\t\t\tnbTooltipStatus=\"basic\"\n\t\t\t\t\t(click)=\"openLink(link)\"\n\t\t\t\t>\n\t\t\t\t\t{{ linkLabel(link) }}\n\t\t\t\t</button>\n\t\t\t\t<ng-template #linkPlain>\n\t\t\t\t\t<span class=\"docs-detail-link-label\" [nbTooltip]=\"linkLabel(link)\" nbTooltipStatus=\"basic\">{{\n\t\t\t\t\t\tlinkLabel(link)\n\t\t\t\t\t}}</span>\n\t\t\t\t</ng-template>\n\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.update\">\n\t\t\t\t\t<button\n\t\t\t\t\t\t*ngIf=\"canMutate\"\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tghost\n\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t[nbTooltip]=\"'DOCS.LINKS.REMOVE' | translate\"\n\t\t\t\t\t\t(click)=\"removeLink(link)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t</button>\n\t\t\t\t</ng-container>\n\t\t\t</div>\n\t\t</section>\n\n\t\t<!-- Comments \u2014 the platform's generic comment API bound to\n\t\t     (BaseEntityEnum.Document, id) (spec 08 \u00A71). Reading follows document\n\t\t     read access, so the section itself is DOCS_READ-gated; the composer\n\t\t     gates itself further (see the thread component). -->\n\t\t<section class=\"docs-detail-section\" *ngxPermissionsOnly=\"docsPermissions.read\">\n\t\t\t<h6>{{ 'DOCS.DETAIL.COMMENTS' | translate }}</h6>\n\t\t\t<gz-docs-detail-comments [documentId]=\"doc.id\" [documentName]=\"doc.name\"></gz-docs-detail-comments>\n\t\t</section>\n\n\t\t<!-- Activity \u2014 the core activity log bound to (BaseEntityEnum.Document, id)\n\t\t     (R-COL-03). Newest first, \"Show more\" paging, system transitions attributed\n\t\t     to \"System\"; the section is fault-isolated inside the child component so a\n\t\t     failing read never takes the panel down. -->\n\t\t<section class=\"docs-detail-section\">\n\t\t\t<h6>{{ 'DOCS.DETAIL.ACTIVITY' | translate }}</h6>\n\t\t\t<gz-docs-detail-activity [documentId]=\"doc.id\"></gz-docs-detail-activity>\n\t\t</section>\n\t</ng-container>\n</div>\n", styles: [":host{display:block;min-width:0}.docs-detail{--docs-page-padding: 1rem;--docs-body-size: .75rem;--docs-meta-size: .6875rem;--docs-label-size: .625rem;--gauzy-table-badge-height: 1.125rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-padding-x: .3125rem;display:flex;flex-direction:column;gap:.625rem;padding:0 var(--docs-page-padding, 1rem) var(--docs-page-padding, 1rem);min-height:12rem;font-size:var(--docs-body-size, .75rem);line-height:1.4;color:var(--docs-text, var(--text-basic-color))}.docs-detail-error{display:flex;flex-direction:column;align-items:center;gap:.75rem;text-align:center;padding:2.5rem 1rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-error p{margin:0}.docs-detail-header{position:sticky;top:0;z-index:2;display:flex;flex-direction:column;gap:.375rem;margin-inline:calc(var(--docs-page-padding, 1rem) * -1);padding:.625rem var(--docs-page-padding, 1rem);background:var(--docs-surface, var(--background-basic-color-1));border-bottom:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-detail-title{display:flex;align-items:center;gap:.5rem;min-width:0}.docs-detail-title .docs-detail-icon{flex:0 0 auto;font-size:1.125rem;line-height:1}.docs-detail-title>nb-icon{flex:0 0 auto;font-size:1.125rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-title .docs-detail-name{flex:1 1 auto;min-width:0;margin:0;font-size:.875rem;font-weight:600;line-height:1.25rem;letter-spacing:-.01em;color:var(--docs-text, var(--text-basic-color));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-detail-title .docs-detail-close{flex:0 0 auto;width:var(--docs-control-height-sm, 1.75rem);height:var(--docs-control-height-sm, 1.75rem);padding:0;border-radius:var(--docs-radius, .375rem)}.docs-detail-title .docs-detail-close nb-icon{margin:0;font-size:1rem}.docs-detail-badges{display:flex;align-items:center;gap:.25rem;flex-wrap:wrap}.docs-detail-badges .docs-detail-version{font-size:var(--docs-label-size, .6875rem);font-variant-numeric:tabular-nums;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;max-width:100%;height:var(--gauzy-table-badge-height, 1.125rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transform:none}.docs-duplicate-notice{display:flex;align-items:center;gap:.375rem;padding:.375rem .5rem;border-radius:var(--docs-radius, .375rem);background:var(--docs-surface-sunken, var(--background-basic-color-2));font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-duplicate-notice nb-icon{flex:0 0 auto;font-size:.875rem}.docs-review-banner{border-radius:var(--docs-radius, .375rem);padding:.625rem .75rem;background:var(--color-warning-transparent-100, rgba(255, 170, 0, .08));box-shadow:inset 0 0 0 1px var(--color-warning-default)}.docs-review-banner .docs-review-banner-head{display:flex;align-items:center;gap:.375rem;flex-wrap:wrap;font-size:var(--docs-body-size, .8125rem)}.docs-review-banner .docs-review-banner-head nb-icon{flex:0 0 auto;font-size:1rem;color:var(--color-warning-default)}.docs-review-banner .docs-review-banner-head strong{font-weight:600}.docs-review-banner .docs-review-banner-actions{display:flex;flex-wrap:wrap;gap:.375rem;margin-top:.625rem}.docs-review-banner p{margin:.375rem 0 0;font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-actions{display:flex;gap:.375rem;flex-wrap:wrap}.docs-detail-actions button[nbButton],.docs-review-banner-actions button[nbButton]{display:inline-flex;align-items:center;gap:.375rem;height:1.5rem;min-height:1.5rem;padding-inline:.4375rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .6875rem);font-weight:500;white-space:nowrap}.docs-detail-actions button[nbButton] nb-icon,.docs-review-banner-actions button[nbButton] nb-icon{margin:0;font-size:.8125rem}.docs-detail-section{display:flex;flex-direction:column;gap:.3125rem;padding-top:.625rem;border-top:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-detail-section h6{display:flex;align-items:center;gap:.375rem;margin:0;font-size:var(--docs-label-size, .6875rem);font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-section h6+*+h6{margin-top:.5rem}.docs-detail-section p{margin:0;overflow-wrap:anywhere}.docs-detail-section .muted{color:var(--docs-text-muted, var(--text-hint-color));margin:0}.docs-detail-section h6 button[nbButton]{height:1.25rem;min-height:1.25rem;padding-inline:.25rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-label-size, .6875rem)}.docs-detail-section h6 button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-detail-section-head{justify-content:space-between}.docs-detail-section-head>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-detail-meta{display:grid;grid-template-columns:minmax(4.5rem,6.5rem) minmax(0,1fr);gap:.25rem .625rem;margin:0;font-size:var(--docs-meta-size, .75rem)}.docs-detail-meta dt{min-width:0;color:var(--docs-text-muted, var(--text-hint-color));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-detail-meta dd{min-width:0;margin:0;overflow-wrap:anywhere}.docs-detail-meta dd.docs-detail-meta-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-detail-actor{color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-location{display:flex;align-items:center;flex-wrap:wrap;gap:.25rem}.docs-detail-location .docs-detail-crumb-sep{color:var(--docs-text-muted, var(--text-hint-color));opacity:.7}.docs-detail-location .docs-detail-crumb{max-width:10rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0;border:0;background:transparent;color:var(--text-primary-color);font:inherit;cursor:pointer}.docs-detail-location .docs-detail-crumb:hover{text-decoration:underline}.docs-detail-toggle{display:flex;flex-direction:column;gap:.25rem}.docs-detail-toggle+.docs-detail-toggle{margin-top:.75rem}.docs-detail-toggle ::ng-deep nb-toggle .label{font-size:var(--docs-body-size, .8125rem)}.docs-detail-toggle .hint{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-knowledge-status{display:flex;align-items:center;flex-wrap:wrap;gap:.375rem;margin-top:.125rem}.docs-knowledge-status button[nbButton]{height:1.5rem;min-height:1.5rem;padding-inline:.375rem;font-size:var(--docs-meta-size, .75rem)}.docs-knowledge-status .docs-knowledge-spinner{font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color));animation:docs-spin 1.2s linear infinite}.docs-detail-link{display:flex;align-items:center;gap:.375rem;padding:.25rem 0;font-size:var(--docs-body-size, .8125rem)}.docs-detail-link+.docs-detail-link{border-top:1px solid var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-detail-link>nb-icon{flex:0 0 auto;font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail-link .docs-detail-link-open,.docs-detail-link .docs-detail-link-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}.docs-detail-link .docs-detail-link-open{padding:0;border:0;background:transparent;color:var(--text-primary-color);font:inherit;cursor:pointer}.docs-detail-link .docs-detail-link-open:hover{text-decoration:underline}.docs-detail-link button[nbButton]{flex:0 0 auto;width:1.5rem;height:1.5rem;padding:0}.docs-detail-link button[nbButton] nb-icon{margin:0;font-size:.875rem}.docs-confidence{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-suggested-tags{display:flex;align-items:center;flex-wrap:wrap;gap:.25rem;margin-top:.25rem}.docs-suggested-tags .docs-suggested-tags-label{font-size:var(--docs-meta-size, .75rem);color:var(--docs-text-muted, var(--text-hint-color))}.docs-suggested-tags .docs-suggested-tag{display:inline-flex;align-items:center;gap:.125rem;max-width:10rem;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border:1px dashed var(--border-basic-color-4);border-radius:var(--docs-radius, .375rem);background:transparent;color:var(--docs-text-muted, var(--text-hint-color));font:inherit;font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}.docs-suggested-tags .docs-suggested-tag nb-icon{flex:0 0 auto;font-size:.75rem}.docs-suggested-tags .docs-suggested-tag:hover:not([disabled]){color:var(--text-primary-color);border-color:var(--color-primary-default);border-style:solid}.docs-suggested-tags .docs-suggested-tag[disabled]{cursor:default;opacity:.6}@keyframes docs-spin{to{transform:rotate(360deg)}}@media(max-width:480px){.docs-detail-meta{grid-template-columns:minmax(0,1fr);gap:0 .75rem}.docs-detail-meta dt{margin-top:.375rem}}.docs-detail ::ng-deep .ng-select .ng-select-container,.docs-detail ::ng-deep nb-select .select-button{min-height:var(--docs-control-height-sm, 1.75rem);border:0;border-radius:var(--docs-radius, .375rem)!important;background-color:var(--docs-surface, var(--background-basic-color-1))!important;box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))!important;color:var(--docs-text, var(--text-basic-color));font-size:var(--docs-body-size, .75rem)}.docs-detail ::ng-deep .ng-select .ng-select-container .ng-value-container{padding-inline-start:.375rem;gap:.1875rem}.docs-detail ::ng-deep .ng-select .ng-placeholder{color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-meta-size, .6875rem)}.docs-detail ::ng-deep .ng-select .ng-arrow-wrapper,.docs-detail ::ng-deep .ng-select .ng-clear-wrapper{color:var(--docs-text-muted, var(--text-hint-color))}.docs-detail ::ng-deep .ng-value .tag-color.tag-label{position:static;display:inline-flex;align-items:center;width:auto;max-width:9rem;height:1.125rem;margin:0;padding:0 .3125rem;border-radius:var(--docs-radius, .375rem);font-size:.625rem;font-weight:500;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transform:none}.docs-detail ::ng-deep .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin:0;background:transparent}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocumentsService }, { type: i3.DocsExportService }, { type: i4.ToastrService }, { type: i5.NbDialogService }, { type: i6.Actions }, { type: i7.Router }, { type: i8.UploadQueueService }, { type: i9.DocumentTreeStore }, { type: i4.TagsService }, { type: i10.DocumentPermissionService }, { type: i4.Store }], propDecorators: { documentId: [{
                type: Input
            }], closed: [{
                type: Output
            }], changed: [{
                type: Output
            }], deleted: [{
                type: Output
            }], openEditor: [{
                type: Output
            }], openPreview: [{
                type: Output
            }] } });
//# sourceMappingURL=docs-detail-panel.component.js.map