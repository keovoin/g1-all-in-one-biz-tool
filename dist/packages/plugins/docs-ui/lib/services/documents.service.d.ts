import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID, IDocument, IDocumentCategory, IDocumentCreateInput, IDocumentLink, IDocumentLinkCreateInput, IDocumentMoveInput, IDocumentShare, IDocumentUpdateInput, IDocumentVersion, IPagination, BaseEntityEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { IDocumentBulkInput, IDocumentBulkResult, IDocumentContentUpdateInput, IDocumentFacets, IDocumentFindInput, IDocumentSettings, IDocumentSettingsDefaults, IDocumentStats, IDocumentUploadOptions, IDocumentUploadResponse, IDocumentUploadResult, IKnowledgeStatus } from '../models/docs-api.model';
import { IDocumentShareCreateInput, IDocumentShareUpdateInput } from '../models/docs-share.model';
import * as i0 from "@angular/core";
/**
 * One segment of the server-resolved ancestor chain (`GET /documents/:id/path`).
 *
 * 🛑 `id` is **nullable**: an ancestor the caller may not read is redacted to
 * `{ id: null, restricted: true }` rather than omitted, so the breadcrumb keeps
 * its depth without leaking the folder's name (`08-permissions-security.md`
 * §3.2). A consumer that treats a segment as clickable must check `restricted`
 * (and a present `id`) first.
 */
export interface IDocumentPathSegment {
    /** `null` when the segment is redacted. */
    id: ID | null;
    name?: string;
    restricted?: boolean;
}
/**
 * HTTP client for the Documents backend plugin (`@gauzy/plugin-docs`).
 * One method per endpoint — `03-backend-plugin.md` is authoritative for DTO
 * shapes and query params; provided at module level so it dies with the chunk.
 *
 * 🛑 The list/count/facets trio funnels every caller through
 * `toDocumentsQueryParams()` (models/docs-api.model.ts) rather than passing the
 * caller's object to `toParams()` verbatim: `GetDocumentsQueryDTO` runs under
 * `ValidationPipe({ whitelist: true })`, where a *known* param with the wrong
 * shape (a boolean `archived`, a composite `sort`, an array `kind`) is a 400
 * that blanks the hub, and an *unknown* param is dropped silently.
 */
export declare class DocumentsService {
    private readonly http;
    private readonly store;
    private readonly API_URL;
    constructor(http: HttpClient, store: Store);
    getAll(params?: IDocumentFindInput): Observable<IPagination<IDocument>>;
    getCount(params?: IDocumentFindInput): Observable<number>;
    /**
     * 🛑 Mapped through `normalizeDocumentFacets`: the endpoint answers enum facets
     * as `Record<value, count>` maps and categories/tags as `{ id, name, count }`
     * rows — this single funnel is what keeps every consumer on `{ value, label,
     * count }` buckets (stored raw, per-option counts never rendered and the
     * Category/Tag options bound `undefined` values).
     */
    getFacets(params?: IDocumentFindInput): Observable<IDocumentFacets>;
    /**
     * Org-global stats for the hub tiles (`GET /documents/stats`). The endpoint
     * ignores filters beyond the mandatory `where` scope — tile numbers stay put
     * while the user filters. Callers treat any failure (incl. 404 on a deployment
     * that predates the route) as "hide the tiles", never as an error surface.
     */
    getStats(params?: IDocumentFindInput): Observable<IDocumentStats>;
    /**
     * Normalizes a caller's filter input into the wire DTO, defaulting the
     * organization scope from the selected organization.
     *
     * The scope is NOT optional: `BaseQueryDTO.where` is `@IsNotEmpty()`, and
     * `DocumentService.resolveOrganizationId()` reads the organization out of
     * `where` because a top-level `organizationId` is not declared on the query
     * DTO and `whitelist: true` strips it.
     */
    private toQueryParams;
    /**
     * The selected organization's scope as wire params for the DETAIL endpoints (single read,
     * settings, links). Unlike the list trio, those endpoints fall back to the token's
     * organization when none is sent — null for a non-employee admin (400
     * `DOCS_ORGANIZATION_REQUIRED` on every detail read), stale when the UI browses another
     * organization of the tenant (404 on rows the list just showed). Absent values are omitted
     * entirely: `toParams()` serializes `undefined` as the literal string "undefined".
     */
    private organizationScope;
    getById(id: ID, relations?: string[]): Observable<IDocument>;
    /**
     * Ancestor chain of one document, **root → the document itself**.
     *
     * Resolving it client-side needs one `GET /documents/:id` per level and still
     * cannot represent an ancestor the caller may not read — it simply disappears,
     * which silently shortens the path. The server walks the chain in one call and
     * substitutes `{ id: null, restricted: true }` for every redacted segment
     * (`08-permissions-security.md` §3.2).
     *
     * 🛑 Deployments that predate the route answer 404, so every caller MUST keep a
     * local fallback — losing the breadcrumb also loses the only way back out of a
     * deep-linked folder.
     */
    getPath(id: ID): Observable<IDocumentPathSegment[]>;
    create(input: IDocumentCreateInput): Observable<IDocument>;
    update(id: ID, input: IDocumentUpdateInput): Observable<IDocument>;
    /**
     * Multipart batch upload with progress events.
     *
     * 🛑 The multipart field is **`files`** (that is what `LazyFilesInterceptor`
     * binds) and the 201 body is the `{ results, rejected }` envelope — never a
     * bare document. Only fields `UploadDocumentsDTO` declares are appended;
     * anything else would be stripped by `whitelist: true` anyway, and appending
     * it would only make a dead control look alive. Conversely, every toggle the
     * classification dialog offers MUST be listed here: `importToKnowledge` and
     * `classifyWithAi` are both real DTO fields, and a toggle that is not sent is
     * a control that does nothing.
     */
    uploadMany(files: File[], options: IDocumentUploadOptions): Observable<HttpEvent<IDocumentUploadResponse>>;
    /**
     * Single-file upload keeping the batch envelope's **per-file result**: progress
     * events pass through untouched and the terminal response carries
     * `{ document, duplicateOfId? }`.
     *
     * 🛑 `duplicateOfId` (the advisory in-org sha256 match, `R-UPL-04`) lives ONLY
     * on this envelope — it is not a column on the document — so anything that wants
     * to show the "possible duplicate" notice has to read it here. {@link upload}
     * narrows the same stream to the bare document for callers that only need the row.
     *
     * A per-file rejection is surfaced as an `HttpErrorResponse` carrying the
     * backend's `{ code, message }` — the batch endpoint answers 201 even when it
     * accepted nothing, so without this a rejected file would look like a success
     * with an undefined document.
     */
    uploadOne(file: File, options: IDocumentUploadOptions): Observable<HttpEvent<IDocumentUploadResult>>;
    /**
     * Single-file convenience over {@link uploadOne}: the terminal response is
     * rewritten to carry just the accepted document, so callers keep their
     * `HttpEvent<IDocument>` contract.
     */
    upload(file: File, options: IDocumentUploadOptions): Observable<HttpEvent<IDocument>>;
    /**
     * Resolves a short-lived provider URL for a FILE document's bytes.
     *
     * `GET /:id/download` answers `{ url }` **as JSON behind the JWT guard** — it
     * is not a redirect, so it can only be reached through the authenticated
     * `HttpClient`; navigating to it directly (`window.open`) sends no token and
     * lands on a 401 page.
     */
    getDownloadUrl(id: ID): Observable<string>;
    move(id: ID, input: IDocumentMoveInput): Observable<IDocument>;
    duplicate(id: ID, options?: {
        deep?: boolean;
    }): Observable<IDocument>;
    archive(id: ID): Observable<IDocument>;
    unarchive(id: ID): Observable<IDocument>;
    /**
     * Archived-only. `strategy` decides subtree deletion vs child promotion.
     *
     * 🛑 The param is **`strategy`** — that is what `DeleteDocumentQueryDTO`
     * declares, and the route runs under `ValidationPipe({ whitelist: true })`, so
     * any other name (this used to send `mode`) is stripped without an error and
     * the handler falls back to `strategy ?? 'subtree'`. The caller's choice then
     * looks honoured while every delete silently cascades over the subtree.
     */
    delete(id: ID, options: {
        strategy: 'subtree' | 'promote-children';
    }): Observable<void>;
    recover(id: ID): Observable<IDocument>;
    reprocess(id: ID): Observable<IDocument>;
    getExtractedText(id: ID): Observable<{
        extractedText: string;
        extractedTextEdited: boolean;
    }>;
    updateExtractedText(id: ID, extractedText: string): Observable<IDocument>;
    /**
     * PAGE content.
     *
     * 🛑 There is **no `GET /documents/:id/content`** — the content route is
     * `PUT`-only (`DocumentController.updateContent`). The columns ride along on
     * the single-document read instead: `GET /documents/:id` returns the full
     * entity, unlike the *list* projection, which deliberately never selects
     * `contentJson`/`contentHtml`. Reading the missing route 404'd, and every
     * caller swallowed it — which is how export and print silently produced
     * empty output for pages that were not open in an editor.
     */
    getContent(id: ID): Observable<{
        contentJson?: unknown;
        contentHtml?: string;
    }>;
    /**
     * PAGE content save (spec 05 §9.2): optimistic concurrency via
     * `expectedUpdatedAt` — stale token → 409 `DOCS_CONTENT_CONFLICT`, locked
     * document → 423 `DOCS_LOCKED`. `forceSnapshot` bypasses the version debounce.
     */
    updateContent(id: ID, input: IDocumentContentUpdateInput): Observable<IDocument>;
    /** Stable app-relative authenticated inline stream URL (spec 05 §6.6 — persisted as image `src`). */
    rawUrl(id: ID): string;
    /**
     * Fetches the original binary through the authenticated HTTP client (the
     * JWT interceptor rides along, unlike a bare `<img src>`). The preview modal
     * turns the blob into an object URL.
     */
    getRawBlob(id: ID): Observable<Blob>;
    knowledgeImport(id: ID): Observable<IDocument>;
    knowledgeExclude(id: ID): Observable<IDocument>;
    reindex(id: ID, options?: {
        force?: boolean;
    }): Observable<IDocument>;
    /** Deployment/index capability probe (spec 03 §4.8) — cosmetic, fail silently. */
    getKnowledgeStatus(): Observable<IKnowledgeStatus>;
    /** Re-runs the classify-summary job (`summary` + `aiConfidence`) — requires AI enabled. */
    regenerateSummary(id: ID): Observable<IDocument>;
    approveReview(id: ID, input?: {
        note?: string;
    }): Observable<IDocument>;
    rejectReview(id: ID, input?: {
        reason?: string;
    }): Observable<IDocument>;
    /**
     * Manual review request (`DOCS_UPDATE`) — moves the document to
     * `reviewStatus=PENDING` with `reviewReason='manual'`. The optional `reason`
     * is stored on the review metadata. Already-PENDING is a 200 no-op, so the
     * callers gate on the status rather than relying on an error.
     */
    requestReview(id: ID, input?: {
        reason?: string;
    }): Observable<IDocument>;
    /** Paginated version history, newest first (list projection has no content columns). */
    getVersions(id: ID): Observable<IPagination<IDocumentVersion>>;
    /** One full snapshot incl. `contentJson`/`contentHtml`. */
    getVersion(id: ID, versionId: ID): Observable<IDocumentVersion>;
    restoreVersion(id: ID, versionId: ID): Observable<IDocument>;
    /** Links of one document. The endpoint answers `IPagination<IDocumentLink>` — unwrapped here. */
    getLinks(id: ID): Observable<IDocumentLink[]>;
    /**
     * Links of a business record. `GetDocumentLinksQueryDTO` carries the
     * organization scope, and the endpoint answers a pagination envelope.
     */
    findLinks(entity: BaseEntityEnum, entityId: ID): Observable<IDocumentLink[]>;
    createLink(input: IDocumentLinkCreateInput): Observable<IDocumentLink>;
    deleteLink(linkId: ID): Observable<void>;
    /**
     * Share overlay for a PRIVATE document. `DOCS_READ`, but the backend's
     * visibility scope means only the creator and `DOCS_MANAGE` holders ever see
     * a non-404 here. On a deployment that predates the P1 share endpoints this
     * 404s too — callers feature-detect rather than surfacing an error.
     */
    getShares(id: ID): Observable<IDocumentShare[]>;
    /**
     * `DOCS_UPDATE`. Exactly one of `employeeId` / `teamId` — both or neither is
     * 400 `DOCS_SHARE_TARGET`; an ORGANIZATION-visible document is 409
     * `DOCS_SHARE_NOT_PRIVATE`; a duplicate target is 409.
     */
    createShare(id: ID, input: IDocumentShareCreateInput): Observable<IDocumentShare>;
    /** `DOCS_UPDATE`. Access level is the only mutable field on a share row. */
    updateShare(id: ID, shareId: ID, input: IDocumentShareUpdateInput): Observable<IDocumentShare>;
    /** `DOCS_UPDATE`. Revokes one share row (the subject keeps org-level access). */
    deleteShare(id: ID, shareId: ID): Observable<void>;
    /**
     * 🛑 `POST /documents/bulk` validates with `forbidNonWhitelisted: true`, and
     * `BulkDocumentActionDTO` declares **no organization scope** (the handler
     * takes it from the request context). An `organizationId`/`tenantId` on the
     * body is therefore a 400 for the whole batch, not a stripped extra — they
     * are dropped here so no caller can smuggle one in.
     */
    bulk(input: IDocumentBulkInput): Observable<IDocumentBulkResult>;
    /**
     * Category catalog (each item carries `documentCount`). Unwraps the pagination envelope.
     *
     * The scope goes inside `where`, like the list trio, for two reasons that both bite: the route
     * types its query as `BaseQueryDTO`, whose `where` is `@IsNotEmpty()`, so sending nothing at all
     * answered EVERY call with `400 {"message":["where should not be empty"]}` — and because every
     * caller wraps this in `catchError(() => of([]))`, the catalog just came back silently empty
     * instead of erroring. And `whitelist: true` strips a top-level `organizationId`, while
     * `DocumentCategoryService.getCategories()` reads `params.organizationId ?? params.where
     * .organizationId` — so `where` is also the only place the scope survives the pipe.
     */
    getCategories(): Observable<IDocumentCategory[]>;
    createCategory(input: Partial<IDocumentCategory>): Observable<IDocumentCategory>;
    updateCategory(id: ID, input: Partial<IDocumentCategory>): Observable<IDocumentCategory>;
    deleteCategory(id: ID): Observable<void>;
    mergeCategory(id: ID, targetId: ID): Observable<void>;
    /**
     * Org defaults + read-only deployment capabilities (spec 03 §4.14). The scope params matter:
     * `DocumentSettingsQueryDTO` accepts them, and without them the controller falls back to the
     * token's organization — null for a non-employee admin, which blanks the settings page.
     */
    getSettings(): Observable<IDocumentSettings>;
    /** Partial update of the org-defaults block only (`capabilities` is never writable). */
    updateSettings(input: Partial<IDocumentSettingsDefaults>): Observable<IDocumentSettings>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocumentsService>;
}
