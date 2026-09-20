import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Actions } from '@ngneat/effects-ng';
import { BaseEntityEnum, DocumentKindEnum, DocumentKnowledgeStatusEnum, DocumentReviewStatusEnum, DocumentStatusEnum, DocumentVisibilityEnum, ID, IDocument, IDocumentCategory, IDocumentLink, ITag, IUser, PermissionsEnum } from '@gauzy/contracts';
import { Store, TagsService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocsExportService } from '../../services/docs-export.service';
import { DocumentPermissionService } from '../../services/document-permission.service';
import { DocumentTreeStore } from '../../services/document-tree.store';
import { DocumentsService } from '../../services/documents.service';
import { UploadDuplicateNotice, UploadQueueService } from '../../services/upload-queue.service';
import * as i0 from "@angular/core";
/**
 * Relations the panel needs on the detail read.
 *
 * `createdByUser` / `updatedByUser` back the Created/Updated rows of the metadata grid
 * (`01-ux-spec.md` §8.4) — only the id columns are stored on the row, so the names have to be
 * joined. 🛑 They must stay on the server-side relation allowlist (`document.controller.ts`
 * `toRelationList`); a relation that is filtered out silently degrades those rows to a bare
 * timestamp rather than erroring.
 */
export declare const DOCS_DETAIL_RELATIONS: string[];
/**
 * Right-side detail panel for any document kind. Re-fetches by id on open
 * (list rows can be stale) and loads links in parallel. Taxonomy chip edits
 * PUT immediately; the review banner hides itself when approve/reject
 * return 403.
 */
export declare class DocsDetailPanelComponent extends TranslationBaseComponent implements OnChanges {
    readonly translateService: TranslateService;
    private readonly documentsService;
    private readonly exportService;
    private readonly toastrService;
    private readonly dialogService;
    private readonly actions;
    private readonly router;
    private readonly uploadQueue;
    private readonly documentTreeStore;
    private readonly tagsService;
    private readonly documentPermission;
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
    documentId: ID;
    closed: EventEmitter<void>;
    changed: EventEmitter<IDocument>;
    deleted: EventEmitter<string>;
    openEditor: EventEmitter<string>;
    /** FILE preview request — the shell opens the preview modal. */
    openPreview: EventEmitter<IDocument>;
    document: IDocument | null;
    links: IDocumentLink[];
    categories: IDocumentCategory[];
    loading: boolean;
    loadError: boolean;
    /** Hidden after a 403 from approve/reject. */
    reviewForbidden: boolean;
    /**
     * Ancestor chain of the open document, root → parent (`01-ux-spec.md` §8.4 "Location").
     * Empty for a root-level document, which renders the "All documents" crumb instead.
     */
    location: Array<{
        id: ID;
        name: string;
    }>;
    /** The suggested tag currently being accepted — one chip at a time, so clicks cannot race. */
    acceptingTag: string | null;
    readonly kindEnum: typeof DocumentKindEnum;
    readonly statusEnum: typeof DocumentStatusEnum;
    readonly knowledgeEnum: typeof DocumentKnowledgeStatusEnum;
    readonly reviewEnum: typeof DocumentReviewStatusEnum;
    readonly visibilityEnum: typeof DocumentVisibilityEnum;
    readonly permissions: typeof PermissionsEnum;
    readonly favoriteEntityType = BaseEntityEnum.Document;
    /** True while a markdown/print export is resolving (dialog-free async work). */
    exporting: boolean;
    /** True while the signed download URL is being resolved. */
    downloading: boolean;
    constructor(translateService: TranslateService, documentsService: DocumentsService, exportService: DocsExportService, toastrService: ToastrService, dialogService: NbDialogService, actions: Actions, router: Router, uploadQueue: UploadQueueService, documentTreeStore: DocumentTreeStore, tagsService: TagsService, documentPermission: DocumentPermissionService, store: Store);
    /**
     * Dedup notice for the open document (`R-UPL-04`).
     *
     * 🛑 `duplicateOfId` is reported on the **upload response only** — it is not a
     * column on the document — so the upload queue is the only place that knows it.
     * A document opened on a later page load therefore correctly shows nothing;
     * that is the storage model, not a missing render.
     */
    get duplicateNotice(): UploadDuplicateNotice | null;
    ngOnChanges(changes: SimpleChanges): void;
    reload(): Promise<void>;
    close(): void;
    get isArchived(): boolean;
    /**
     * Row-level ownership scope of the open document (`08-permissions-security.md` §1.7).
     *
     * 🛑 ANDed with the template's `ngxPermissionsOnly` gates, never a replacement for them: the
     * server rule is `DOCS_UPDATE AND (DOCS_MANAGE OR creator OR EDIT share)`, so a `DOCS_UPDATE`
     * holder who is not the creator was being shown edit/archive/delete on every document and
     * only found out from a `403 DOCS_WRITE_FORBIDDEN`.
     */
    get canMutate(): boolean;
    get isSettledFile(): boolean;
    /**
     * Resolves the short-lived provider URL, then opens it.
     *
     * 🛑 `GET /:id/download` is a **JWT-guarded JSON endpoint** answering
     * `{ url }`, not a redirect: navigating straight to it sends no bearer token
     * and lands on a 401 page. The signed URL therefore has to come back through
     * the authenticated `HttpClient` first — which is exactly what
     * `getDownloadUrl()` is for.
     */
    download(): Promise<void>;
    onOpenEditor(): void;
    preview(): void;
    reprocess(): Promise<void>;
    toggleArchive(): Promise<void>;
    /**
     * Delete is allowed only from the archived state (archive-first flow).
     *
     * The prompt (`01-ux-spec.md` §10.11) is what decides the strategy: a node with
     * children offers subtree-vs-promote, a leaf just confirms. This used to open
     * the generic confirmation and then hardcode `promote-children` — under a query
     * param the backend does not declare, so the request was stripped to the
     * `subtree` default and did the opposite of what the code claimed.
     */
    remove(): Promise<void>;
    openExtractedText(): Promise<void>;
    onCategoriesChange(categoryIds: ID[]): Promise<void>;
    onTagsChange(tags: ITag[]): Promise<void>;
    /**
     * Builds the tag half of a `PUT /documents/:id` body.
     *
     * 🛑 The server DTO whitelists **`tagIds`**, not `tags` (`create-document.dto.ts:83-87`), and
     * the route runs with `forbidNonWhitelisted: true` — so sending the `ITag[]` that
     * `IDocumentUpdateInput` advertises is a **400**, not a silently ignored field. The FE
     * contract and the DTO disagree here; the DTO wins, and the cast documents why.
     */
    private toTagIdsInput;
    /** Cache so `selectedCategoryIds` keeps a stable reference across change-detection cycles. */
    private selectedCategoryIdsCache;
    /**
     * Feeds `[selected]` on an `<nb-select>`, re-read every change-detection cycle while the panel
     * is open. `.map()` mints a new array identity each call; memoizing it (keyed on the
     * `document.categories` reference) keeps that reference stable so nb-select does not re-reconcile
     * its selection model every cycle — the same discipline as `FacetMultiselectComponent`.
     */
    get selectedCategoryIds(): ID[];
    /**
     * `metadata` as an object.
     *
     * The column is `jsonb` on postgres but **text** on sqlite; `DocumentSubscriber.afterEntityLoad`
     * normally parses that back, but it logs-and-leaves the raw string when the parse fails — and
     * the classifier writes the column through a raw `.update()` that bypasses the subscribers
     * entirely. So the string shape can reach this client, and reading it wrong means the accept
     * chips silently never appear.
     */
    private get metadata();
    /**
     * AI keyword suggestions that are not already applied.
     *
     * The pipeline deliberately never creates `Tag` rows itself (catalog hygiene, spec 07 §5.2),
     * so these chips are the ONLY path from `metadata.ai.suggestedTags` to a real tag. A chip
     * disappears as soon as its name is on the document, which is what makes "accept" feel like
     * an accept rather than a toggle.
     */
    /** Cache so `suggestedTags` keeps a stable reference (and skips the Set-building work) per CD. */
    private suggestedTagsCache;
    /**
     * Rebuilds a new array plus two `Set`s on every call and is read each change-detection cycle
     * while the panel is open. Memoized on its two source references (the AI `suggestedTags` array
     * and the applied `document.tags`) so it returns a stable array — the `trackBy` on its `*ngFor`
     * then keeps the suggestion buttons stable. Same reference-stability discipline as the facet fix.
     */
    get suggestedTags(): string[];
    trackBySuggestion(_index: number, suggestion: string): string;
    /**
     * Accepts one suggestion: resolve-or-create the `Tag` by name, then PUT the merged id list.
     *
     * Reuse comes first on purpose — a suggestion that matches an existing organization tag must
     * attach that tag, not mint a near-duplicate the catalog then has to live with.
     */
    acceptSuggestedTag(name: string): Promise<void>;
    /** Case-insensitive lookup in the organization's tag catalog, creating the tag only on a miss. */
    private resolveOrCreateTag;
    /** Stable colour for a tag name — see `SUGGESTED_TAG_COLORS`. */
    private colorForTag;
    onSearchableToggle(searchable: boolean): Promise<void>;
    get inKnowledge(): boolean;
    onKnowledgeToggle(include: boolean): Promise<void>;
    reindex(): Promise<void>;
    /** FAILED indexing → re-queue via the import endpoint (FAILED → QUEUED, spec 03 §4.8). */
    retryKnowledge(): Promise<void>;
    get knowledgeInFlight(): boolean;
    regenerateSummary(): Promise<void>;
    get showReviewBanner(): boolean;
    get isPendingReview(): boolean;
    /**
     * A manual review request is the ONLY way into the queue when AI is off, so
     * it is offered for every kind — but never on a document that is already
     * PENDING (the banner above is the state for that; the backend would no-op)
     * nor on an archived one, which is not part of the working set.
     */
    get canRequestReview(): boolean;
    /**
     * Flags the document for a human review (`reviewReason='manual'`). The reason
     * is optional — the dialog mirrors rejection, which is the established shape
     * for a review note in this hub.
     */
    requestReview(): Promise<void>;
    approveReview(): Promise<void>;
    rejectReview(reason?: string): Promise<void>;
    private handleReviewError;
    get isPrivate(): boolean;
    /**
     * Opens the share dialog. Offered for every document, not only PRIVATE ones:
     * the dialog is also where visibility is flipped, so "Share" has to be the
     * way *into* privacy, not something that only appears once you are already
     * there.
     */
    openShare(): Promise<void>;
    get isPage(): boolean;
    copyMarkdown(): Promise<void>;
    exportMarkdown(): Promise<void>;
    print(): Promise<void>;
    addLink(): Promise<void>;
    removeLink(link: IDocumentLink): Promise<void>;
    /** Navigates to the linked business record; no-op for entities without a detail route. */
    openLink(link: IDocumentLink): void;
    hasLinkRoute(link: IDocumentLink): boolean;
    /**
     * Resolves the ancestor chain of the open document for the "Location" row.
     *
     * The shared node cache answers it for free whenever the tree has been walked; a deep link
     * straight into `?id=` has walked nothing, so it falls back to one read of the parent with
     * its own parent — the same two-step the browse breadcrumb uses. Ancestors that cannot be
     * resolved are NOT invented: the chain is simply shorter, and the "All documents" crumb still
     * gets the user back out.
     */
    private refreshLocation;
    /** `[grandparent, parent]` — or just `[parent]`, or nothing at all. */
    private chainOf;
    /** Drills the browse list into a folder of the Location chain (`null` = root). */
    openLocation(folderId: ID | null): void;
    /**
     * Display name of a user behind `createdByUser` / `updatedByUser`.
     *
     * Empty when the relation is absent — the row then shows the timestamp alone rather than a
     * placeholder that reads like a real name.
     */
    userLabel(user?: IUser | null): string;
    /** Registered entities get their own icon; anything else falls back to a generic link. */
    linkIcon(link: IDocumentLink): string;
    /** Entity-type label (`DOCS.LINKS.ENTITY.*`), or the raw enum for unregistered types. */
    linkTypeLabel(link: IDocumentLink): string;
    /**
     * Display label captured at link time. Falls back to the entity + id so a
     * link created before `metadata.label` existed — or whose record was renamed
     * away — still renders something clickable instead of a blank row.
     */
    linkLabel(link: IDocumentLink): string;
    humanizeSize(bytes?: number): string;
    private applyChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsDetailPanelComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsDetailPanelComponent, "gz-docs-detail-panel", never, { "documentId": { "alias": "documentId"; "required": false; }; }, { "closed": "closed"; "changed": "changed"; "deleted": "deleted"; "openEditor": "openEditor"; "openPreview": "openPreview"; }, never, never, false, never>;
}
