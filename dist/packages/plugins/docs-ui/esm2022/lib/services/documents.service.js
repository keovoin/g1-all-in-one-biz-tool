import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import { normalizeDocumentFacets, toDocumentsQueryParams } from '../models/docs-api.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@gauzy/ui-core/core";
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
export class DocumentsService {
    constructor(http, store) {
        this.http = http;
        this.store = store;
        this.API_URL = `${API_PREFIX}/plugins/docs`;
    }
    // ─── Documents: read ─────────────────────────────────────────
    getAll(params = {}) {
        return this.http.get(`${this.API_URL}/documents`, {
            params: toParams(this.toQueryParams(params))
        });
    }
    getCount(params = {}) {
        return this.http.get(`${this.API_URL}/documents/count`, {
            params: toParams(this.toQueryParams(params))
        });
    }
    /**
     * 🛑 Mapped through `normalizeDocumentFacets`: the endpoint answers enum facets
     * as `Record<value, count>` maps and categories/tags as `{ id, name, count }`
     * rows — this single funnel is what keeps every consumer on `{ value, label,
     * count }` buckets (stored raw, per-option counts never rendered and the
     * Category/Tag options bound `undefined` values).
     */
    getFacets(params = {}) {
        return this.http
            .get(`${this.API_URL}/documents/facets`, {
            params: toParams(this.toQueryParams(params))
        })
            .pipe(map(normalizeDocumentFacets));
    }
    /**
     * Org-global stats for the hub tiles (`GET /documents/stats`). The endpoint
     * ignores filters beyond the mandatory `where` scope — tile numbers stay put
     * while the user filters. Callers treat any failure (incl. 404 on a deployment
     * that predates the route) as "hide the tiles", never as an error surface.
     */
    getStats(params = {}) {
        return this.http.get(`${this.API_URL}/documents/stats`, {
            params: toParams(this.toQueryParams(params))
        });
    }
    /**
     * Normalizes a caller's filter input into the wire DTO, defaulting the
     * organization scope from the selected organization.
     *
     * The scope is NOT optional: `BaseQueryDTO.where` is `@IsNotEmpty()`, and
     * `DocumentService.resolveOrganizationId()` reads the organization out of
     * `where` because a top-level `organizationId` is not declared on the query
     * DTO and `whitelist: true` strips it.
     */
    toQueryParams(params) {
        const organization = this.store.selectedOrganization;
        return toDocumentsQueryParams({
            ...params,
            organizationId: params.organizationId ?? organization?.id,
            tenantId: params.tenantId ?? organization?.tenantId
        });
    }
    /**
     * The selected organization's scope as wire params for the DETAIL endpoints (single read,
     * settings, links). Unlike the list trio, those endpoints fall back to the token's
     * organization when none is sent — null for a non-employee admin (400
     * `DOCS_ORGANIZATION_REQUIRED` on every detail read), stale when the UI browses another
     * organization of the tenant (404 on rows the list just showed). Absent values are omitted
     * entirely: `toParams()` serializes `undefined` as the literal string "undefined".
     */
    organizationScope() {
        const organization = this.store.selectedOrganization;
        return {
            ...(organization?.id ? { organizationId: organization.id } : {}),
            ...(organization?.tenantId ? { tenantId: organization.tenantId } : {})
        };
    }
    getById(id, relations = []) {
        return this.http.get(`${this.API_URL}/documents/${id}`, {
            params: toParams({ relations, ...this.organizationScope() })
        });
    }
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
    getPath(id) {
        return this.http
            .get(`${this.API_URL}/documents/${id}/path`)
            .pipe(map((result) => (Array.isArray(result) ? result : result?.items ?? [])));
    }
    // ─── Documents: write ────────────────────────────────────────
    create(input) {
        // `CreateDocumentDTO` extends `TenantOrganizationBaseDTO`, whose `organizationId`
        // is required when no `organization` object is sent — the dialogs do not carry one,
        // so default the scope from the selected organization (same as `uploadMany`).
        // Without it every "New folder" / "New page" is a validation 400.
        const organization = this.store.selectedOrganization;
        return this.http.post(`${this.API_URL}/documents`, {
            ...input,
            organizationId: input.organizationId ?? organization?.id,
            tenantId: input.tenantId ?? organization?.tenantId
        });
    }
    update(id, input) {
        return this.http.put(`${this.API_URL}/documents/${id}`, input);
    }
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
    uploadMany(files, options) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file, file.name));
        const organization = this.store.selectedOrganization;
        const fields = {
            parentId: options?.parentId,
            visibility: options?.visibility,
            categoryIds: options?.categoryIds,
            tagIds: options?.tagIds,
            importToKnowledge: options?.importToKnowledge,
            classifyWithAi: options?.classifyWithAi,
            source: options?.source,
            // `TenantOrganizationBaseDTO` requires an organization — the dialogs do not carry one.
            organizationId: options?.organizationId ?? organization?.id,
            tenantId: options?.tenantId ?? organization?.tenantId
        };
        Object.entries(fields).forEach(([key, value]) => {
            if (value === undefined || value === null)
                return;
            if (Array.isArray(value)) {
                if (!value.length)
                    return;
                formData.append(key, value.join(','));
                return;
            }
            formData.append(key, String(value));
        });
        return this.http.post(`${this.API_URL}/documents/upload`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }
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
    uploadOne(file, options) {
        return this.uploadMany([file], options).pipe(map((event) => {
            if (event.type !== HttpEventType.Response)
                return event;
            const response = event;
            const accepted = response.body?.results?.[0];
            if (!accepted?.document) {
                const rejection = response.body?.rejected?.[0];
                throw new HttpErrorResponse({
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url ?? undefined,
                    error: {
                        code: rejection?.code ?? 'DOCS_UPLOAD_REJECTED',
                        message: rejection?.message ?? 'The file was rejected by the server'
                    }
                });
            }
            return response.clone({ body: accepted });
        }));
    }
    /**
     * Single-file convenience over {@link uploadOne}: the terminal response is
     * rewritten to carry just the accepted document, so callers keep their
     * `HttpEvent<IDocument>` contract.
     */
    upload(file, options) {
        return this.uploadOne(file, options).pipe(map((event) => {
            if (event.type !== HttpEventType.Response)
                return event;
            const response = event;
            return response.clone({ body: response.body?.document });
        }));
    }
    /**
     * Resolves a short-lived provider URL for a FILE document's bytes.
     *
     * `GET /:id/download` answers `{ url }` **as JSON behind the JWT guard** — it
     * is not a redirect, so it can only be reached through the authenticated
     * `HttpClient`; navigating to it directly (`window.open`) sends no token and
     * lands on a 401 page.
     */
    getDownloadUrl(id) {
        return this.http
            .get(`${this.API_URL}/documents/${id}/download`)
            .pipe(map((result) => result?.url ?? ''));
    }
    move(id, input) {
        return this.http.post(`${this.API_URL}/documents/${id}/move`, input);
    }
    duplicate(id, options = {}) {
        return this.http.post(`${this.API_URL}/documents/${id}/duplicate`, options);
    }
    archive(id) {
        return this.http.post(`${this.API_URL}/documents/${id}/archive`, {});
    }
    unarchive(id) {
        return this.http.post(`${this.API_URL}/documents/${id}/unarchive`, {});
    }
    /**
     * Archived-only. `strategy` decides subtree deletion vs child promotion.
     *
     * 🛑 The param is **`strategy`** — that is what `DeleteDocumentQueryDTO`
     * declares, and the route runs under `ValidationPipe({ whitelist: true })`, so
     * any other name (this used to send `mode`) is stripped without an error and
     * the handler falls back to `strategy ?? 'subtree'`. The caller's choice then
     * looks honoured while every delete silently cascades over the subtree.
     */
    delete(id, options) {
        return this.http.delete(`${this.API_URL}/documents/${id}`, { params: toParams(options) });
    }
    recover(id) {
        return this.http.post(`${this.API_URL}/documents/${id}/recover`, {});
    }
    // ─── Processing / extraction ─────────────────────────────────
    reprocess(id) {
        return this.http.post(`${this.API_URL}/documents/${id}/reprocess`, {});
    }
    getExtractedText(id) {
        return this.http.get(`${this.API_URL}/documents/${id}/extracted-text`);
    }
    updateExtractedText(id, extractedText) {
        return this.http.put(`${this.API_URL}/documents/${id}/extracted-text`, { extractedText });
    }
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
    getContent(id) {
        return this.getById(id).pipe(map((document) => ({ contentJson: document?.contentJson, contentHtml: document?.contentHtml })));
    }
    /**
     * PAGE content save (spec 05 §9.2): optimistic concurrency via
     * `expectedUpdatedAt` — stale token → 409 `DOCS_CONTENT_CONFLICT`, locked
     * document → 423 `DOCS_LOCKED`. `forceSnapshot` bypasses the version debounce.
     */
    updateContent(id, input) {
        // The content route resolves its scope from the token when the body carries none — the
        // same null/stale token-org failure as `getById`, but on the SAVE path, where it surfaces
        // as autosave silently dying. Body fields rather than query params: JSON serialization
        // drops `undefined`, so an absent scope is simply not sent.
        const organization = this.store.selectedOrganization;
        return this.http.put(`${this.API_URL}/documents/${id}/content`, {
            ...input,
            organizationId: input.organizationId ?? organization?.id,
            tenantId: input.tenantId ?? organization?.tenantId
        });
    }
    /** Stable app-relative authenticated inline stream URL (spec 05 §6.6 — persisted as image `src`). */
    rawUrl(id) {
        return `${this.API_URL}/documents/${id}/raw`;
    }
    /**
     * Fetches the original binary through the authenticated HTTP client (the
     * JWT interceptor rides along, unlike a bare `<img src>`). The preview modal
     * turns the blob into an object URL.
     */
    getRawBlob(id) {
        return this.http.get(this.rawUrl(id), { responseType: 'blob' });
    }
    // ─── AI knowledge ────────────────────────────────────────────
    knowledgeImport(id) {
        return this.http.post(`${this.API_URL}/documents/${id}/knowledge/import`, {});
    }
    knowledgeExclude(id) {
        return this.http.post(`${this.API_URL}/documents/${id}/knowledge/exclude`, {});
    }
    reindex(id, options = {}) {
        return this.http.post(`${this.API_URL}/documents/${id}/knowledge/reindex`, options);
    }
    /** Deployment/index capability probe (spec 03 §4.8) — cosmetic, fail silently. */
    getKnowledgeStatus() {
        return this.http.get(`${this.API_URL}/knowledge/status`);
    }
    /** Re-runs the classify-summary job (`summary` + `aiConfidence`) — requires AI enabled. */
    regenerateSummary(id) {
        return this.http.post(`${this.API_URL}/documents/${id}/summary/regenerate`, {});
    }
    // ─── Review ──────────────────────────────────────────────────
    approveReview(id, input = {}) {
        return this.http.post(`${this.API_URL}/documents/${id}/review/approve`, input);
    }
    rejectReview(id, input = {}) {
        return this.http.post(`${this.API_URL}/documents/${id}/review/reject`, input);
    }
    /**
     * Manual review request (`DOCS_UPDATE`) — moves the document to
     * `reviewStatus=PENDING` with `reviewReason='manual'`. The optional `reason`
     * is stored on the review metadata. Already-PENDING is a 200 no-op, so the
     * callers gate on the status rather than relying on an error.
     */
    requestReview(id, input = {}) {
        return this.http.post(`${this.API_URL}/documents/${id}/review/request`, input);
    }
    // ─── Versions ────────────────────────────────────────────────
    /** Paginated version history, newest first (list projection has no content columns). */
    getVersions(id) {
        return this.http.get(`${this.API_URL}/documents/${id}/versions`);
    }
    /** One full snapshot incl. `contentJson`/`contentHtml`. */
    getVersion(id, versionId) {
        return this.http.get(`${this.API_URL}/documents/${id}/versions/${versionId}`);
    }
    restoreVersion(id, versionId) {
        return this.http.post(`${this.API_URL}/documents/${id}/versions/${versionId}/restore`, {});
    }
    // ─── Links ───────────────────────────────────────────────────
    /** Links of one document. The endpoint answers `IPagination<IDocumentLink>` — unwrapped here. */
    getLinks(id) {
        return this.http
            .get(`${this.API_URL}/documents/${id}/links`, {
            params: toParams(this.organizationScope())
        })
            .pipe(map((result) => result?.items ?? []));
    }
    /**
     * Links of a business record. `GetDocumentLinksQueryDTO` carries the
     * organization scope, and the endpoint answers a pagination envelope.
     */
    findLinks(entity, entityId) {
        return this.http
            .get(`${this.API_URL}/links`, {
            params: toParams({ entity, entityId, ...this.organizationScope() })
        })
            .pipe(map((result) => result?.items ?? []));
    }
    createLink(input) {
        return this.http.post(`${this.API_URL}/links`, input);
    }
    deleteLink(linkId) {
        return this.http.delete(`${this.API_URL}/links/${linkId}`);
    }
    // ─── Shares (spec 03 §4.12 / 08 §3) ──────────────────────────
    /**
     * Share overlay for a PRIVATE document. `DOCS_READ`, but the backend's
     * visibility scope means only the creator and `DOCS_MANAGE` holders ever see
     * a non-404 here. On a deployment that predates the P1 share endpoints this
     * 404s too — callers feature-detect rather than surfacing an error.
     */
    getShares(id) {
        return this.http
            .get(`${this.API_URL}/documents/${id}/shares`)
            .pipe(map((result) => (Array.isArray(result) ? result : result?.items ?? [])));
    }
    /**
     * `DOCS_UPDATE`. Exactly one of `employeeId` / `teamId` — both or neither is
     * 400 `DOCS_SHARE_TARGET`; an ORGANIZATION-visible document is 409
     * `DOCS_SHARE_NOT_PRIVATE`; a duplicate target is 409.
     */
    createShare(id, input) {
        return this.http.post(`${this.API_URL}/documents/${id}/shares`, input);
    }
    /** `DOCS_UPDATE`. Access level is the only mutable field on a share row. */
    updateShare(id, shareId, input) {
        return this.http.put(`${this.API_URL}/documents/${id}/shares/${shareId}`, input);
    }
    /** `DOCS_UPDATE`. Revokes one share row (the subject keeps org-level access). */
    deleteShare(id, shareId) {
        return this.http.delete(`${this.API_URL}/documents/${id}/shares/${shareId}`);
    }
    // ─── Bulk ────────────────────────────────────────────────────
    /**
     * 🛑 `POST /documents/bulk` validates with `forbidNonWhitelisted: true`, and
     * `BulkDocumentActionDTO` declares **no organization scope** (the handler
     * takes it from the request context). An `organizationId`/`tenantId` on the
     * body is therefore a 400 for the whole batch, not a stripped extra — they
     * are dropped here so no caller can smuggle one in.
     */
    bulk(input) {
        const payload = { ...(input ?? {}) };
        delete payload.organizationId;
        delete payload.tenantId;
        return this.http.post(`${this.API_URL}/documents/bulk`, payload);
    }
    // ─── Categories ──────────────────────────────────────────────
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
    getCategories() {
        return this.http
            .get(`${this.API_URL}/categories`, {
            params: toParams({ where: this.organizationScope() })
        })
            .pipe(map((result) => result?.items ?? []));
    }
    createCategory(input) {
        return this.http.post(`${this.API_URL}/categories`, input);
    }
    updateCategory(id, input) {
        return this.http.put(`${this.API_URL}/categories/${id}`, input);
    }
    deleteCategory(id) {
        return this.http.delete(`${this.API_URL}/categories/${id}`);
    }
    mergeCategory(id, targetId) {
        return this.http.post(`${this.API_URL}/categories/${id}/merge`, { targetId });
    }
    // ─── Settings ────────────────────────────────────────────────
    /**
     * Org defaults + read-only deployment capabilities (spec 03 §4.14). The scope params matter:
     * `DocumentSettingsQueryDTO` accepts them, and without them the controller falls back to the
     * token's organization — null for a non-employee admin, which blanks the settings page.
     */
    getSettings() {
        return this.http.get(`${this.API_URL}/settings`, {
            params: toParams(this.organizationScope())
        });
    }
    /** Partial update of the org-defaults block only (`capabilities` is never writable). */
    updateSettings(input) {
        return this.http.put(`${this.API_URL}/settings`, input, {
            params: toParams(this.organizationScope())
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsService, deps: [{ token: i1.HttpClient }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentsService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.Store }] });
//# sourceMappingURL=documents.service.js.map