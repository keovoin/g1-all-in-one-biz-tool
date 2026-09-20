import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ID, IDocument, IPagination } from '@gauzy/contracts';
import { BulkDocumentActionDTO, CreateDocumentDTO, DocumentScopeQueryDTO, GetDocumentsQueryDTO, IDocumentBulkResult, UpdateDocumentContentDTO, UpdateDocumentDTO } from '../dto';
import { IDocumentPathSegment } from '../services/document-path.service';
/**
 * Relations a client may ask `GET /documents/:id` to join.
 *
 * 🛑 This is an **allowlist, and `children` is deliberately absent.** The row-level gate of
 * `findOneScoped()` proves the *requested* document is readable; it says nothing about the rows
 * TypeORM eager-loads alongside it. `?relations=children` therefore used to return every child of
 * a readable folder — including other people's `PRIVATE` pages, with `contentJson` and
 * `contentHtml` in full (`08-permissions-security.md` §3.4 row 6: unreadable ⇒ 404, never a
 * payload). Child listing has its own scoped route, `GET /documents?parentId=<id>`, which applies
 * the visibility predicate in SQL; the breadcrumb has `GET /documents/:id/path`, which masks
 * unreadable ancestors. Anything added here must be a relation whose rows carry no per-row
 * visibility of their own — or it needs the same post-load scrubbing `parent` gets in
 * `DocumentService.findOneScoped()`.
 *
 * `createdByUser` / `updatedByUser` satisfy that bar: they are the `ManyToOne → User` actor
 * relations every `BaseEntity` carries, they hold no document content, and a `User` has no
 * per-row visibility to scrub. The detail panel joins them to render the "Created by" / "Updated
 * by" rows of the metadata grid (`01-ux-spec.md` §8.4) — dropping them here would not error, it
 * would silently degrade both rows to a bare timestamp.
 */
export declare const ALLOWED_DOCUMENT_RELATIONS: readonly string[];
/**
 * Normalizes the `relations` query parameter into the array the query handler expects, keeping
 * only the allowlisted names.
 *
 * Express hands over a string for one `?relations=` occurrence and an array for several; an absent
 * (or empty) value means "no relations". An unknown or non-allowlisted name is dropped rather than
 * rejected: `relations` is an optimization hint, and a client asking for one relation too many
 * should get a correctly-scoped document, not a 400 that breaks its whole detail panel.
 *
 * @param relations The raw query-parameter value.
 * @returns The allowlisted relation names to join.
 */
export declare function toRelationList(relations?: string | string[]): string[];
export declare class DocumentController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Retrieves a paginated, filtered document list. List projections never include content
     * columns — they carry `hasContent`/`hasExtractedText`/`hasChildren`/`childrenCount` instead.
     */
    findAll(params: GetDocumentsQueryDTO): Promise<IPagination<IDocument>>;
    /**
     * Retrieves the document count for the same filter set as the list.
     */
    getCount(params: GetDocumentsQueryDTO): Promise<number>;
    /**
     * Retrieves facet counts for the filter chips (each bucket computed over the other filters).
     */
    getFacets(params: GetDocumentsQueryDTO): Promise<Record<string, any>>;
    /**
     * Creates a FOLDER or PAGE document (`kind: FILE` → 400 `DOCS_FILE_VIA_UPLOAD`).
     */
    create(input: CreateDocumentDTO): Promise<IDocument>;
    /**
     * Applies one bulk action to up to 200 documents with per-id partial failure (one HTTP 200).
     */
    bulk(input: BulkDocumentActionDTO): Promise<IDocumentBulkResult>;
    /**
     * Partial **metadata-only** update — content fields are rejected here (`forbidNonWhitelisted`);
     * PAGE content saves go through `PUT /:id/content`.
     */
    update(id: ID, input: UpdateDocumentDTO): Promise<IDocument>;
    /**
     * PAGE content save. Stale `expectedUpdatedAt` → 409 `DOCS_CONTENT_CONFLICT`; locked
     * document → 423 `DOCS_LOCKED`. `forceSnapshot: true` bypasses the version-snapshot debounce.
     */
    updateContent(id: ID, input: UpdateDocumentContentDTO): Promise<IDocument>;
    /**
     * Resolves the breadcrumb chain of a document, root → document.
     *
     * Server-side because the masking rule of `08-permissions-security.md` §3.2 cannot be applied
     * in the client: an ancestor the requester may not read is returned as
     * `{ id: null, restricted: true }` with **no name and no id**, and the client renders it as the
     * `DOCS.BREADCRUMB.RESTRICTED` lock chip.
     *
     * Declared before `GET /:id` so the static `/path` segment is never swallowed by it.
     */
    getPath(id: ID): Promise<IDocumentPathSegment[]>;
    /**
     * Retrieves a single document by id (`relations` query param honored).
     *
     * `organizationId` is the client's selected organization. Without it the scope is resolved
     * from the token's `lastOrganizationId`, which is null for non-employee users (400) and stale
     * when the client browses another organization of the tenant (404 on rows the list showed).
     * `relations` stays a raw `@Query('relations')` extraction on purpose: its metatype is not a
     * DTO class, so the route's ValidationPipe skips it and `toRelationList` remains the gate.
     */
    findById(id: ID, relations?: string | string[], query?: DocumentScopeQueryDTO): Promise<IDocument>;
}
