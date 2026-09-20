import { CommandBus, EventBus as CqrsEventBus } from '@nestjs/cqrs';
import { WhereExpressionBuilder } from 'typeorm';
import { EntitySubscriptionTypeEnum, ID, IPagination } from '@gauzy/contracts';
import { EventBus, MentionService, TenantAwareCrudService } from '@gauzy/core';
import { CreateDocumentDTO, GetDocumentsQueryDTO, UpdateDocumentContentDTO, UpdateDocumentDTO } from '../dto';
import { Document } from '../entities/document.entity';
import { IDocumentEventContext } from '../events/document.event';
import { MikroOrmDocumentRepository } from '../repositories/mikro-orm-document.repository';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { TypeOrmDocumentLinkRepository } from '../repositories/type-orm-document-link.repository';
import { DocumentAccessService } from './document-access.service';
import { DocumentSettingsService } from './document-settings.service';
import { DocumentVersionService } from './document-version.service';
/**
 * Columns safe for list projections — the content columns (`contentJson`, `contentHtml`,
 * `contentBinary`, `extractedText`) are never selected by list/facet queries.
 */
export declare const DOCUMENT_LIST_COLUMNS: string[];
export declare class DocumentService extends TenantAwareCrudService<Document> {
    readonly typeOrmDocumentRepository: TypeOrmDocumentRepository;
    readonly mikroOrmDocumentRepository: MikroOrmDocumentRepository;
    private readonly typeOrmDocumentLinkRepository;
    private readonly documentVersionService;
    private readonly documentAccessService;
    private readonly documentSettingsService;
    private readonly _eventBus;
    private readonly _cqrsEventBus;
    private readonly _commandBus;
    private readonly _mentionService;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, mikroOrmDocumentRepository: MikroOrmDocumentRepository, typeOrmDocumentLinkRepository: TypeOrmDocumentLinkRepository, documentVersionService: DocumentVersionService, documentAccessService: DocumentAccessService, documentSettingsService: DocumentSettingsService, _eventBus: EventBus, _cqrsEventBus: CqrsEventBus, _commandBus: CommandBus, _mentionService: MentionService);
    /**
     * Applies the Documents visibility + share composition rule to a query builder
     * (`08-permissions-security.md` §3.4): `PRIVATE` rows are visible only to their creator,
     * to holders of `DOCS_MANAGE`, and to `DocumentShare` grantees (employee grant, or a team
     * the requester currently belongs to — resolved in the same SQL predicate so lists,
     * facets, tree browsing and retrieval stay single-query and consistent).
     *
     * The route guard has already proven `DOCS_READ`; this method adds the row-level half of
     * `permission AND (visibility OR ownership OR adminOverride OR share)`.
     *
     * @param qb The query (or where expression) builder to scope.
     * @param alias The `document` alias in the query.
     */
    applyVisibilityScope(qb: WhereExpressionBuilder, alias?: string): void;
    /**
     * Resolves the organization scope of a request: the explicit payload value first, then the
     * `where` envelope of the query DTOs, then the requester's current organization.
     *
     * `whitelist: true` strips any property the DTO does not declare, so a filter set can reach
     * the service with no `organizationId` at all — falling back to "no organization filter"
     * would list the whole tenant, so an unresolvable scope is a hard 400 instead.
     *
     * @param params An optional payload carrying an organization scope.
     * @returns The resolved organization id.
     */
    resolveOrganizationId(params?: {
        organizationId?: ID;
        where?: {
            organizationId?: ID;
        };
    }): ID;
    /**
     * Loads a document by id within the caller's tenant/organization + visibility scope
     * (visibility OR ownership OR `DOCS_MANAGE` OR a share grant, per §3.4).
     * A cross-tenant, cross-org, or invisible id resolves to 404, never 403 (no existence oracle).
     *
     * The tenant + organization pair is applied explicitly here: the inherited
     * `findOneByIdString` merges the **tenant only**, which would otherwise resolve any
     * organization's document inside the tenant.
     *
     * @param id The document id.
     * @param relations Optional relations to join.
     * @param organizationId Explicit organization scope (the client's selected organization);
     * when omitted the request context's organization applies, as before.
     * @returns The scoped document entity.
     */
    findOneScoped(id: ID, relations?: string[], organizationId?: ID): Promise<Document>;
    /**
     * Same scope as `findOneScoped`, but soft-deleted rows are visible — the recovery path
     * needs the trashed row and must not be able to reach another organization's trash.
     *
     * @param id The document id.
     * @returns The scoped (possibly soft-deleted) document entity.
     */
    findOneDeletedScoped(id: ID): Promise<Document>;
    /**
     * Asserts that the requester may MUTATE the given row (§1.6 ownership + the `EDIT` share
     * level). The route guard only proves the verb permission — this adds the row-level half,
     * so a `VIEW`/`COMMENT` grantee can read a shared document but never write it.
     *
     * @param document The document about to be mutated.
     */
    assertCanWrite(document: Document): Promise<void>;
    /**
     * The shared tenant + organization + visibility resolution behind `findOneScoped` and
     * `findOneDeletedScoped`.
     */
    private findOneWithinScope;
    /**
     * Replaces any joined `parent`/`children` document the requester may not read with the
     * `{ id: null, restricted: true }` masking shape of `08-permissions-security.md` §3.2 — no
     * name, no id, and above all no content.
     *
     * @param document The freshly loaded document, with whatever relations were requested.
     */
    private maskUnreadableDocumentRelations;
    /**
     * Creates a FOLDER or PAGE node (`kind: FILE` enters through the upload endpoint).
     *
     * @param input The create payload.
     * @returns The created document.
     */
    createDocument(input: CreateDocumentDTO): Promise<Document>;
    /**
     * Reads the organization's `defaultVisibility` setting, degrading to `ORGANIZATION`.
     *
     * Best-effort by contract: a settings read failure must not fail document creation, and the
     * documented fallback of `getDefaults()` is the same `ORGANIZATION` value.
     *
     * @param organizationId The organization scope.
     * @returns The visibility a new document should be born with.
     */
    private resolveDefaultVisibility;
    /**
     * Subscribes the acting employee to a document through the platform's `EntitySubscription`
     * fan-out (`03-backend-plugin.md` §8/§9.4).
     *
     * Without this, a page author who is never @-mentioned in their own document is not subscribed
     * to it and receives none of the comment fan-out — the exact hole the platform's own
     * `CommentService` closes the same way.
     *
     * Best-effort: a subscription failure never rolls back the mutation that triggered it.
     *
     * @param document The document to subscribe to.
     * @param type Why the subscription is created.
     */
    subscribeRequesterToDocument(document: Document, type: EntitySubscriptionTypeEnum): void;
    /**
     * Partial metadata-only update (name/icon/color/description/flags, categories/tags, visibility).
     * Content saves go through `updateContent`.
     *
     * @param id The document id.
     * @param input The update payload.
     * @returns The updated document.
     */
    updateDocument(id: ID, input: UpdateDocumentDTO): Promise<Document>;
    /**
     * PAGE content save with optimistic concurrency, lock enforcement, debounced version
     * snapshot, and mention diff-sync.
     *
     * @param id The PAGE document id.
     * @param input The content payload.
     * @returns The updated document.
     */
    updateContent(id: ID, input: UpdateDocumentContentDTO): Promise<Document>;
    /**
     * Validates a `contentJson` payload against the editor schema and strips the transient
     * editor-only attributes before it is persisted (`08-permissions-security.md` §6.1,
     * `05-editor-spec.md` §6.6).
     *
     * @param contentJson The payload as it arrived.
     * @returns The document to persist.
     * @throws BadRequestException `DOCS_CONTENT_SCHEMA_INVALID` when the payload is not schema-valid.
     */
    private validateContentJson;
    /**
     * Resolves the `contentHtml` render cache of a save.
     *
     * The client value wins (sanitized), because it comes from the very editor instance that
     * produced the JSON. When it is absent the cache is **derived from the validated JSON** — the
     * previous HTML is never carried forward, since it describes content that no longer exists.
     *
     * @param provided The `contentHtml` the client sent, if any.
     * @param contentJson The validated canonical document.
     * @param fallback The value to keep when there is no JSON to derive from either.
     * @returns The HTML to persist.
     */
    private resolveContentHtml;
    /**
     * Decodes the optional base64 CRDT payload of a content save, enforcing
     * `GAUZY_DOCS_MAX_BINARY_BYTES` (`docs.config.ts`).
     *
     * @param encoded The base64 payload (empty string clears the column).
     * @returns The buffer to persist, or null.
     * @throws BadRequestException `DOCS_CONTENT_BINARY_TOO_LARGE` above the configured cap.
     */
    private decodeContentBinary;
    /**
     * Merges the content save's `metadata` block into the row's existing metadata.
     *
     * A **merge**, never a replace: `document.metadata` is a shared provenance dictionary
     * (`email`, `chat`, `migration`, `deletion`, `review`, `ai`), and an autosave that replaced it
     * would wipe the AI classification and the migration provenance of the row.
     *
     * @param document The document being saved.
     * @param input The content payload.
     * @returns The metadata value to persist.
     */
    private mergeContentMetadata;
    /**
     * Diff-syncs the `DocumentLink` rows that represent the editor's `+` cross-links
     * (`05-editor-spec.md` §7.2): every `documentMention` node in the saved content becomes a link
     * with `entity: BaseEntityEnum.Document`, and links whose mention the save removed are pruned.
     *
     * Only mentions that resolve to a document **the requester can actually read** are linked —
     * otherwise a hand-crafted payload could mint links to arbitrary ids and the linked-records
     * panel would leak their existence. Links to other entity types are never touched: this diff
     * owns exactly the `Document → Document` rows.
     *
     * Best-effort: a link-sync failure logs and never rolls back the content save.
     *
     * @param document The document whose content was just saved.
     * @param contentJson The validated content.
     */
    private syncDocumentLinks;
    /**
     * Narrows a set of document ids to those the requester may read, in the caller's
     * tenant scope and the GIVEN organization (the same single-query predicate every
     * list path uses).
     *
     * @param ids The candidate document ids.
     * @param organizationId The organization to filter in — the saved document's own scope.
     * @returns The subset that resolves inside the read scope.
     */
    private filterReadableDocumentIds;
    /**
     * Diff-syncs the `Document` mention rows against the editor's current mention id set.
     *
     * An **omitted** `mentionEmployeeIds` means "the client has no opinion" and is a no-op; an
     * explicit empty array means "this save removed every mention" and clears them. That is the
     * same distinction the task-comment path draws, and it is what keeps a client that does not
     * send the field from silently wiping a page's mentions.
     *
     * @param documentId The document the mentions belong to.
     * @param mentionEmployeeIds The editor's current mention id set (omitted = no-op).
     */
    private syncMentions;
    /**
     * Paginated, filtered document list. List projections never select content columns; the
     * items carry `hasContent`, `hasExtractedText`, `hasChildren` and `childrenCount` instead.
     *
     * @param params The filter set.
     * @returns Paginated documents.
     */
    getDocuments(params: GetDocumentsQueryDTO): Promise<IPagination<Document>>;
    /**
     * Count for the same filter set as `getDocuments`.
     *
     * @param params The filter set.
     * @returns The matching row count.
     */
    getDocumentCount(params: GetDocumentsQueryDTO): Promise<number>;
    /**
     * Facet counts for the filter chips. Every facet bucket is computed over the *other*
     * filters, so each chip shows what its selection would yield.
     *
     * @param params The filter set.
     * @returns The facet-count envelope.
     */
    getDocumentFacets(params: GetDocumentsQueryDTO): Promise<Record<string, any>>;
    /**
     * Publishes a `DocumentEvent` on the core RxJS event bus. Best-effort: a failure logs and
     * never rolls back the primary mutation.
     *
     * 🛑 This is also the **only** seam the activity log is written from:
     * `DocumentActivityLogSubscriber` listens on `eventBus.ofType(DocumentEvent)` and turns each
     * event into an `ActivityLog` row (R-COL-03). A mutation that skips this method is a
     * mutation the detail panel's timeline will never show.
     *
     * @param entity The document the event describes.
     * @param type The CRUD event type.
     * @param context The lifecycle phase context.
     * @param input Optional input payload.
     */
    emitDocumentEvent(entity: Document, type: 'created' | 'updated' | 'deleted', context?: IDocumentEventContext, input?: any): void;
    /**
     * Builds the shared filtered query for list/count/facets — tenant + organization scope,
     * visibility scope, soft-delete filter (implicit), and every filter of the DTO.
     *
     * @param params The filter set.
     * @returns A scoped `SelectQueryBuilder`.
     */
    private buildFilteredQuery;
    /**
     * Archived handling (default exclude): `exclude` hides archived rows, `only` keeps just
     * them, and any other value (`include`) leaves the flag unfiltered.
     */
    private applyArchivedFilter;
    /**
     * The scalar/enum column filters of the DTO (kind, statuses, source, visibility, searchable).
     */
    private applyAttributeFilters;
    /**
     * The `createdAt` / `updatedAt` range bounds; date-only `To` bounds cover the whole day.
     */
    private applyDateRangeFilters;
    /**
     * Tree browse vs flat search: `parentId: 'root'` scopes to the roots, any other id scopes
     * to that node's direct children, and an absent `parentId` searches the whole organization.
     */
    private applyTreeFilter;
    /**
     * ANY-match M2M filters (categories, tags) via pivot EXISTS subqueries.
     */
    private applyTaxonomyFilters;
    /**
     * Name / content search. `searchIn: 'content'` widens the name match with the content
     * columns — gated on the row's own `searchable` flag, and only after the query-length
     * guard has accepted the term.
     */
    private applySearchFilter;
    /**
     * Normalizes the requested sort direction; anything other than `ASC`/`DESC` leaves the
     * direction unset so the caller's own default applies.
     */
    private resolveSortOrder;
    /**
     * Extends a date-only `To` bound to cover the whole day.
     */
    private endOfDayIfDateOnly;
    /**
     * Maps the writable metadata fields of the create/update DTOs onto entity fields
     * (including tag/category id arrays → relation stubs). Tags arrive as `tagIds`, as the
     * contracts-published `tags` references, or both — see `resolveTagIds`.
     */
    private buildAssignableFields;
    /**
     * Server-side sanitization of the `contentHtml` render cache. Delegates to the shared
     * **allowlist** sanitizer of `@gauzy/core` (`core/html-sanitizer`) — a denylist of regexes
     * is bypassable by construction, so the platform keeps exactly one parser-backed
     * implementation. `contentJson` stays canonical; this cache is regenerated on every save.
     */
    private sanitizeHtml;
}
