"use strict";
var DocumentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = exports.DOCUMENT_LIST_COLUMNS = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const create_document_link_command_1 = require("../commands/create-document-link.command");
const delete_document_link_command_1 = require("../commands/delete-document-link.command");
const docs_config_1 = require("../docs.config");
const docs_constants_1 = require("../docs.constants");
// Deep import on purpose: this is a pure helper, not a DTO class, so it must not depend on the
// barrel (which drags in every DTO — and with them `@gauzy/core` — for one function).
const document_tag_reference_1 = require("../dto/document-tag-reference");
const document_event_1 = require("../events/document.event");
const mikro_orm_document_repository_1 = require("../repositories/mikro-orm-document.repository");
const type_orm_document_repository_1 = require("../repositories/type-orm-document.repository");
const type_orm_document_link_repository_1 = require("../repositories/type-orm-document-link.repository");
const validation_1 = require("../validation");
const content_search_guard_1 = require("./content-search.guard");
const document_access_service_1 = require("./document-access.service");
const document_settings_service_1 = require("./document-settings.service");
const document_version_service_1 = require("./document-version.service");
/**
 * Columns safe for list projections — the content columns (`contentJson`, `contentHtml`,
 * `contentBinary`, `extractedText`) are never selected by list/facet queries.
 */
exports.DOCUMENT_LIST_COLUMNS = [
    'id',
    'createdAt',
    'updatedAt',
    'createdByUserId',
    'isActive',
    'isArchived',
    'archivedAt',
    'tenantId',
    'organizationId',
    'kind',
    'parentId',
    'index',
    'name',
    'icon',
    'color',
    'description',
    'isLocked',
    'mimeType',
    'fileSize',
    'sha256',
    'originalFilename',
    'version',
    'extractedTextEdited',
    'summary',
    'status',
    'statusMessage',
    'source',
    'knowledgeStatus',
    'aiConfidence',
    'searchable',
    'reviewStatus',
    'reviewReason',
    'reviewedById',
    'reviewedAt',
    'visibility',
    'externalSource',
    'externalId'
];
let DocumentService = DocumentService_1 = class DocumentService extends core_1.TenantAwareCrudService {
    constructor(typeOrmDocumentRepository, mikroOrmDocumentRepository, typeOrmDocumentLinkRepository, documentVersionService, documentAccessService, documentSettingsService, _eventBus, 
    // The platform's `EntitySubscription` fan-out listens on the CQRS bus, not the RxJS one
    // above — the two are different buses and `DocumentEvent` travels on the other.
    _cqrsEventBus, _commandBus, _mentionService) {
        super(typeOrmDocumentRepository, mikroOrmDocumentRepository);
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.mikroOrmDocumentRepository = mikroOrmDocumentRepository;
        this.typeOrmDocumentLinkRepository = typeOrmDocumentLinkRepository;
        this.documentVersionService = documentVersionService;
        this.documentAccessService = documentAccessService;
        this.documentSettingsService = documentSettingsService;
        this._eventBus = _eventBus;
        this._cqrsEventBus = _cqrsEventBus;
        this._commandBus = _commandBus;
        this._mentionService = _mentionService;
        this.logger = new common_1.Logger(DocumentService_1.name);
    }
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
    applyVisibilityScope(qb, alias = 'document') {
        if (core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_MANAGE)) {
            return; // Admins see everything in their tenant/org scope
        }
        const userId = core_1.RequestContext.currentUserId();
        qb.andWhere(new typeorm_1.Brackets((web) => {
            web.where((0, core_1.prepareSQLQuery)(`"${alias}"."visibility" = :organizationVisibility`), {
                organizationVisibility: contracts_1.DocumentVisibilityEnum.ORGANIZATION
            });
            if (userId) {
                web.orWhere((0, core_1.prepareSQLQuery)(`"${alias}"."createdByUserId" = :visibilityUserId`), { visibilityUserId: userId });
            }
            // Additive share overlay — never subtracts rights, no-op without an employee identity.
            this.documentAccessService.applyShareScope(web, alias);
        }));
    }
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
    resolveOrganizationId(params) {
        const organizationId = params?.organizationId ??
            params?.where?.organizationId ??
            core_1.RequestContext.currentOrganizationId();
        if (!organizationId) {
            throw new common_1.BadRequestException({
                message: 'An organization scope is required for this request',
                code: docs_constants_1.DOCS_ORGANIZATION_REQUIRED
            });
        }
        return organizationId;
    }
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
    async findOneScoped(id, relations = [], organizationId) {
        return this.findOneWithinScope(id, { relations, organizationId });
    }
    /**
     * Same scope as `findOneScoped`, but soft-deleted rows are visible — the recovery path
     * needs the trashed row and must not be able to reach another organization's trash.
     *
     * @param id The document id.
     * @returns The scoped (possibly soft-deleted) document entity.
     */
    async findOneDeletedScoped(id) {
        return this.findOneWithinScope(id, { withDeleted: true });
    }
    /**
     * Asserts that the requester may MUTATE the given row (§1.6 ownership + the `EDIT` share
     * level). The route guard only proves the verb permission — this adds the row-level half,
     * so a `VIEW`/`COMMENT` grantee can read a shared document but never write it.
     *
     * @param document The document about to be mutated.
     */
    async assertCanWrite(document) {
        const permitted = await this.documentAccessService.canWrite({
            createdByUserId: document.createdByUserId,
            visibility: document.visibility,
            isLocked: document.isLocked
        }, document.id);
        if (!permitted) {
            throw new common_1.ForbiddenException({
                message: 'You do not have write access to this document',
                code: docs_constants_1.DOCS_WRITE_FORBIDDEN
            });
        }
    }
    /**
     * The shared tenant + organization + visibility resolution behind `findOneScoped` and
     * `findOneDeletedScoped`.
     */
    async findOneWithinScope(id, options = {}) {
        const tenantId = core_1.RequestContext.currentTenantId();
        // An explicit scope (the client's selected organization) wins over the request context:
        // the context carries the token's `lastOrganizationId`, which is null for non-employee
        // users and stale when the client browses another organization of the tenant. The
        // tenant, by contrast, is ALWAYS the request context's — never client input.
        const organizationId = this.resolveOrganizationId(options);
        // TypeORM ≥ 1.0 rejects the string-array `relations` form outright ("String-array
        // "relations" syntax has been removed") — convert the allowlisted names to the object form.
        const document = await this.typeOrmRepository.findOne({
            where: { id, tenantId, organizationId },
            // It surfaced as a SUCCESS, which is why it went unnoticed: the throw is a plain Error, not an
            // HttpException, so `TransformInterceptor` rewrapped it as `new HttpException(message, undefined)`
            // and the undefined status left Express at 200 — the detail panel rendered an empty document and
            // the page editor opened with a blank title, because `{message}` is truthy and has no `name`.
            ...(options.relations?.length ? { relations: (0, core_1.parseFindOptionsRelations)(options.relations) } : {}),
            ...(options.withDeleted ? { withDeleted: true } : {})
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document ${id} was not found`);
        }
        if (document.visibility === contracts_1.DocumentVisibilityEnum.PRIVATE &&
            !core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_MANAGE) &&
            document.createdByUserId !== core_1.RequestContext.currentUserId()) {
            // Last gate: the share overlay. Only reached for someone else's PRIVATE document,
            // so the extra lookup never touches the common read paths.
            const shared = await this.documentAccessService.canRead({ createdByUserId: document.createdByUserId, visibility: document.visibility }, document.id);
            if (!shared) {
                throw new common_1.NotFoundException(`Document ${id} was not found`);
            }
        }
        // 🛑 The gate above proves the REQUESTED row is readable — it says nothing about the rows
        // TypeORM joined in alongside it. `?relations=parent` (and, before the controller
        // allowlist, `?relations=children`) hands back whole sibling documents with their
        // `contentJson`/`contentHtml`, bypassing §3.4 entirely. Every joined document row is
        // therefore put through the same read predicate and masked when it fails.
        await this.maskUnreadableDocumentRelations(document);
        return document;
    }
    /**
     * Replaces any joined `parent`/`children` document the requester may not read with the
     * `{ id: null, restricted: true }` masking shape of `08-permissions-security.md` §3.2 — no
     * name, no id, and above all no content.
     *
     * @param document The freshly loaded document, with whatever relations were requested.
     */
    async maskUnreadableDocumentRelations(document) {
        const restrict = async (related) => {
            if (!related?.id) {
                return related;
            }
            const readable = await this.documentAccessService.canRead({ createdByUserId: related.createdByUserId, visibility: related.visibility }, related.id);
            return readable ? related : { id: null, restricted: true };
        };
        if (document.parent) {
            document.parent = await restrict(document.parent);
        }
        if (Array.isArray(document.children)) {
            document.children = await Promise.all(document.children.map((child) => restrict(child)));
        }
    }
    /**
     * Creates a FOLDER or PAGE node (`kind: FILE` enters through the upload endpoint).
     *
     * @param input The create payload.
     * @returns The created document.
     */
    async createDocument(input) {
        if (input.kind === contracts_1.DocumentKindEnum.FILE) {
            throw new common_1.BadRequestException({
                message: 'FILE documents are created through the upload endpoint',
                code: docs_constants_1.DOCS_FILE_VIA_UPLOAD
            });
        }
        // Reserved sources (`SYSTEM`, `IMPORT`) can never be claimed by this endpoint —
        // FOLDER/PAGE nodes authored in the platform are always `EDITOR`.
        if (input.source &&
            [contracts_1.DocumentSourceEnum.SYSTEM, contracts_1.DocumentSourceEnum.IMPORT].includes(input.source)) {
            throw new common_1.BadRequestException({ message: 'Reserved source', code: docs_constants_1.DOCS_SOURCE_RESERVED });
        }
        const source = contracts_1.DocumentSourceEnum.EDITOR;
        // The parent must be a container (FOLDER or PAGE)
        if (input.parentId) {
            const parent = await this.findOneScoped(input.parentId);
            if (parent.kind === contracts_1.DocumentKindEnum.FILE) {
                throw new common_1.BadRequestException({
                    message: 'A FILE document can never be a parent',
                    code: docs_constants_1.DOCS_PARENT_NOT_CONTAINER
                });
            }
        }
        // Schema-validate the initial content exactly like a later save would — a page created
        // with content the editor cannot load is content nobody can ever fix.
        const contentJson = input.contentJson ? this.validateContentJson(input.contentJson) : null;
        const organizationId = this.resolveOrganizationId(input);
        const document = await this.create({
            ...this.buildAssignableFields(input),
            kind: input.kind,
            contentJson,
            contentHtml: this.resolveContentHtml(input.contentHtml, contentJson, null),
            status: contracts_1.DocumentStatusEnum.READY,
            source,
            knowledgeStatus: contracts_1.DocumentKnowledgeStatusEnum.NONE,
            reviewStatus: contracts_1.DocumentReviewStatusEnum.NONE,
            // §4.3/§4.14 — the organization default is the whole point of the setting; hardcoding
            // ORGANIZATION here meant an org that chose PRIVATE got ORGANIZATION for 100% of the
            // content its people authored (the upload path already honours it).
            visibility: input.visibility ?? (await this.resolveDefaultVisibility(organizationId))
        });
        // The create DTO accepts `mentionEmployeeIds`, so it has to mean something: without this
        // the field was whitelisted, parsed and silently dropped.
        await this.syncMentions(document.id, input.mentionEmployeeIds);
        await this.syncDocumentLinks(document, contentJson);
        this.subscribeRequesterToDocument(document, contracts_1.EntitySubscriptionTypeEnum.CREATED_ENTITY);
        this.emitDocumentEvent(document, 'created', { phase: 'crud' }, input);
        return document;
    }
    /**
     * Reads the organization's `defaultVisibility` setting, degrading to `ORGANIZATION`.
     *
     * Best-effort by contract: a settings read failure must not fail document creation, and the
     * documented fallback of `getDefaults()` is the same `ORGANIZATION` value.
     *
     * @param organizationId The organization scope.
     * @returns The visibility a new document should be born with.
     */
    async resolveDefaultVisibility(organizationId) {
        try {
            const defaults = await this.documentSettingsService.getDefaults(organizationId);
            return defaults.defaultVisibility ?? contracts_1.DocumentVisibilityEnum.ORGANIZATION;
        }
        catch (error) {
            this.logger.warn(`Failed to resolve the default visibility for organization ${organizationId}: ${error.message}`);
            return contracts_1.DocumentVisibilityEnum.ORGANIZATION;
        }
    }
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
    subscribeRequesterToDocument(document, type) {
        const employeeId = core_1.RequestContext.currentEmployeeId();
        if (!employeeId) {
            return; // no employee identity on this request — there is nobody to subscribe
        }
        try {
            this._cqrsEventBus.publish(new core_1.CreateEntitySubscriptionEvent({
                entity: contracts_1.BaseEntityEnum.Document,
                entityId: document.id,
                employeeId,
                type,
                organizationId: document.organizationId,
                tenantId: document.tenantId
            }));
        }
        catch (error) {
            this.logger.warn(`Failed to publish CreateEntitySubscriptionEvent for document ${document.id}: ${error.message}`);
        }
    }
    /**
     * Partial metadata-only update (name/icon/color/description/flags, categories/tags, visibility).
     * Content saves go through `updateContent`.
     *
     * @param id The document id.
     * @param input The update payload.
     * @returns The updated document.
     */
    async updateDocument(id, input) {
        const document = await this.findOneScoped(id);
        await this.assertCanWrite(document);
        const updated = await this.save({
            ...document,
            ...this.buildAssignableFields(input),
            id: document.id
        });
        this.emitDocumentEvent(updated, 'updated', { phase: 'crud' }, input);
        return updated;
    }
    /**
     * PAGE content save with optimistic concurrency, lock enforcement, debounced version
     * snapshot, and mention diff-sync.
     *
     * @param id The PAGE document id.
     * @param input The content payload.
     * @returns The updated document.
     */
    async updateContent(id, input) {
        // §4.3/§11 — `contentJson` is canonical: HTML alone would leave the two columns describing
        // different documents. `@IsDefined()` alone answers with a bare class-validator 400 with no
        // `code`, so the machine code the rest of the plugin's errors carry is raised here instead.
        if (input.contentHtml !== undefined && input.contentJson === undefined) {
            throw new common_1.BadRequestException({
                message: 'A content save must carry the canonical `contentJson`',
                code: docs_constants_1.DOCS_CONTENT_JSON_REQUIRED
            });
        }
        // The DTO's optional organizationId is the editor's selected organization — without it a
        // save is scoped by the token's org (null for non-employee users → 400, autosave dies).
        const document = await this.findOneScoped(id, [], input.organizationId);
        await this.assertCanWrite(document);
        if (document.kind !== contracts_1.DocumentKindEnum.PAGE) {
            throw new common_1.ConflictException({ message: 'Content saves apply to PAGE documents only', code: docs_constants_1.DOCS_NOT_A_PAGE });
        }
        // 423 Locked — a locked page is view-only until unlocked
        if (document.isLocked) {
            throw new common_1.HttpException({ message: 'Document is locked', code: docs_constants_1.DOCS_LOCKED }, common_1.HttpStatus.LOCKED);
        }
        // 409 optimistic-concurrency conflict on a stale editor
        const currentUpdatedAt = new Date(document.updatedAt).getTime();
        const expectedUpdatedAt = new Date(input.expectedUpdatedAt).getTime();
        if (Number.isFinite(expectedUpdatedAt) && expectedUpdatedAt !== currentUpdatedAt) {
            throw new common_1.ConflictException({
                message: 'Document content changed since it was loaded',
                code: docs_constants_1.DOCS_CONTENT_CONFLICT,
                currentUpdatedAt: document.updatedAt
            });
        }
        // §6.1 step 1 — the TipTap schema is the first line of defense. Validated BEFORE the
        // version snapshot so a rejected payload cannot burn a version slot.
        const contentJson = this.validateContentJson(input.contentJson);
        // Debounced pre-update snapshot (bypassed with forceSnapshot)
        await this.documentVersionService.captureSnapshotIfNeeded(document, {
            force: input.forceSnapshot === true
        });
        const updated = await this.save({
            ...document,
            id: document.id,
            contentJson,
            // 🛑 NOT `?? document.contentHtml`: reusing the stored HTML when the client omits it
            // leaves the render cache describing the PREVIOUS revision, which is what read-only
            // views render and what `searchIn=content` matches on.
            contentHtml: this.resolveContentHtml(input.contentHtml, contentJson, document.contentHtml ?? null),
            ...(input.contentBinary !== undefined
                ? { contentBinary: this.decodeContentBinary(input.contentBinary) }
                : {}),
            metadata: this.mergeContentMetadata(document, input)
        });
        // Mention diff-sync on content save — the same platform mechanism task comments use
        // (`MentionService.updateEntityMentions`: publish the newly added ids, delete the ones the
        // editor dropped). Awaited so the fan-out is done before the response, but best-effort by
        // contract: a failure logs and never rolls back the content save.
        await this.syncMentions(document.id, input.mentionEmployeeIds);
        // The `+` cross-link half of the same idea (`05-editor-spec.md` §7.2).
        await this.syncDocumentLinks(updated, contentJson);
        this.emitDocumentEvent(updated, 'updated', { phase: 'crud' }, input);
        return updated;
    }
    /**
     * Validates a `contentJson` payload against the editor schema and strips the transient
     * editor-only attributes before it is persisted (`08-permissions-security.md` §6.1,
     * `05-editor-spec.md` §6.6).
     *
     * @param contentJson The payload as it arrived.
     * @returns The document to persist.
     * @throws BadRequestException `DOCS_CONTENT_SCHEMA_INVALID` when the payload is not schema-valid.
     */
    validateContentJson(contentJson) {
        return (0, validation_1.stripTransientAttributes)((0, validation_1.validateTiptapDocument)(contentJson));
    }
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
    resolveContentHtml(provided, contentJson, fallback) {
        if (provided) {
            return this.sanitizeHtml(provided);
        }
        if (!contentJson) {
            return fallback;
        }
        try {
            // Sanitized as well: the derivation is schema-constrained, but the platform keeps
            // exactly one gate in front of every stored HTML string.
            return this.sanitizeHtml((0, validation_1.generateDocumentHtml)(contentJson));
        }
        catch (error) {
            this.logger.warn(`Failed to derive contentHtml from contentJson: ${error.message}`);
            return fallback;
        }
    }
    /**
     * Decodes the optional base64 CRDT payload of a content save, enforcing
     * `GAUZY_DOCS_MAX_BINARY_BYTES` (`docs.config.ts`).
     *
     * @param encoded The base64 payload (empty string clears the column).
     * @returns The buffer to persist, or null.
     * @throws BadRequestException `DOCS_CONTENT_BINARY_TOO_LARGE` above the configured cap.
     */
    decodeContentBinary(encoded) {
        if (!encoded) {
            return null;
        }
        const buffer = Buffer.from(encoded, 'base64');
        const maxBinaryBytes = (0, docs_config_1.getDocsConfig)().maxBinaryBytes;
        if (buffer.length > maxBinaryBytes) {
            throw new common_1.BadRequestException({
                message: `The collaboration state exceeds the ${maxBinaryBytes} byte limit`,
                code: docs_constants_1.DOCS_CONTENT_BINARY_TOO_LARGE
            });
        }
        return buffer;
    }
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
    mergeContentMetadata(document, input) {
        if (!input.metadata || Object.keys(input.metadata).length === 0) {
            return document.metadata ?? null;
        }
        const existing = document.metadata && typeof document.metadata === 'object' ? document.metadata : {};
        return { ...existing, ...input.metadata };
    }
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
    async syncDocumentLinks(document, contentJson) {
        if (!contentJson) {
            return;
        }
        try {
            const mentioned = (0, validation_1.collectDocumentMentionIds)(contentJson).filter((id) => id !== document.id);
            // Scoped to the DOCUMENT's organization, not the request context's: the save may
            // have been scoped by the DTO's explicit organizationId (see `updateContent`), and
            // filtering in a different — or null — token organization would resolve zero
            // readable mentions and prune every existing cross-link of the saved document.
            const desired = mentioned.length
                ? await this.filterReadableDocumentIds(mentioned, document.organizationId)
                : [];
            const existing = await this.typeOrmDocumentLinkRepository.find({
                where: {
                    documentId: document.id,
                    entity: contracts_1.BaseEntityEnum.Document,
                    tenantId: document.tenantId,
                    organizationId: document.organizationId
                }
            });
            const existingIds = new Set(existing.map((link) => link.entityId));
            for (const entityId of desired) {
                if (!existingIds.has(entityId)) {
                    await this._commandBus.execute(new create_document_link_command_1.CreateDocumentLinkCommand({
                        tenantId: document.tenantId,
                        organizationId: document.organizationId,
                        documentId: document.id,
                        entity: contracts_1.BaseEntityEnum.Document,
                        entityId,
                        metadata: { origin: 'editor-mention' }
                    }));
                }
            }
            const desiredIds = new Set(desired);
            for (const link of existing) {
                if (!desiredIds.has(link.entityId)) {
                    await this._commandBus.execute(new delete_document_link_command_1.DeleteDocumentLinkCommand(link.id));
                }
            }
        }
        catch (error) {
            this.logger.warn(`Failed to sync document cross-links for document ${document.id}: ${error.message}`);
        }
    }
    /**
     * Narrows a set of document ids to those the requester may read, in the caller's
     * tenant scope and the GIVEN organization (the same single-query predicate every
     * list path uses).
     *
     * @param ids The candidate document ids.
     * @param organizationId The organization to filter in — the saved document's own scope.
     * @returns The subset that resolves inside the read scope.
     */
    async filterReadableDocumentIds(ids, organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const qb = this.typeOrmRepository.createQueryBuilder('document');
        qb.select('document.id', 'id');
        qb.where((0, core_1.prepareSQLQuery)(`"document"."tenantId" = :tenantId`), { tenantId });
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."organizationId" = :organizationId`), { organizationId });
        qb.andWhere({ id: (0, typeorm_1.In)(ids) });
        this.applyVisibilityScope(qb);
        const rows = await qb.getRawMany();
        return rows.map((row) => row.id);
    }
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
    async syncMentions(documentId, mentionEmployeeIds) {
        if (!Array.isArray(mentionEmployeeIds)) {
            return;
        }
        try {
            await this._mentionService.updateEntityMentions(contracts_1.BaseEntityEnum.Document, documentId, mentionEmployeeIds);
        }
        catch (error) {
            this.logger.warn(`Failed to sync mentions for document ${documentId}: ${error.message}`);
        }
    }
    /**
     * Paginated, filtered document list. List projections never select content columns; the
     * items carry `hasContent`, `hasExtractedText`, `hasChildren` and `childrenCount` instead.
     *
     * @param params The filter set.
     * @returns Paginated documents.
     */
    async getDocuments(params) {
        const qb = this.buildFilteredQuery(params);
        // Safe projection + boolean content markers
        qb.select(exports.DOCUMENT_LIST_COLUMNS.map((column) => `document.${column}`));
        qb.addSelect((0, core_1.prepareSQLQuery)(`CASE WHEN "document"."contentJson" IS NOT NULL THEN 1 ELSE 0 END`), 'document_hasContent');
        qb.addSelect((0, core_1.prepareSQLQuery)(`CASE WHEN "document"."extractedText" IS NOT NULL THEN 1 ELSE 0 END`), 'document_hasExtractedText');
        qb.addSelect((0, core_1.prepareSQLQuery)(`(SELECT COUNT(*) FROM "document" "child" WHERE "child"."parentId" = "document"."id" AND "child"."deletedAt" IS NULL)`), 'document_childrenCount');
        // Sorting
        const order = this.resolveSortOrder(params.sortOrder);
        if (params.sort) {
            const sortColumn = params.sort === 'size' ? 'fileSize' : params.sort;
            qb.orderBy(`document.${sortColumn}`, order ?? 'ASC');
        }
        else if (params.parentId) {
            qb.orderBy('document.index', 'ASC'); // tree browse default
        }
        else {
            qb.orderBy('document.updatedAt', 'DESC'); // list default
        }
        // Pagination
        if (params.take) {
            qb.take(params.take);
        }
        if (params.skip) {
            qb.skip(params.take ? params.take * (params.skip - 1) : params.skip);
        }
        const total = await qb.getCount();
        const { entities, raw } = await qb.getRawAndEntities();
        // Attach the computed list markers to the (non-persisted) entity fields
        const items = entities.map((entity, index) => {
            const rawRow = raw[index] ?? {};
            entity.hasContent = Number(rawRow['document_hasContent']) === 1;
            entity.hasExtractedText = Number(rawRow['document_hasExtractedText']) === 1;
            entity.childrenCount = Number(rawRow['document_childrenCount']) || 0;
            entity.hasChildren = Number(rawRow['document_childrenCount']) > 0;
            return entity;
        });
        return { items, total };
    }
    /**
     * Count for the same filter set as `getDocuments`.
     *
     * @param params The filter set.
     * @returns The matching row count.
     */
    async getDocumentCount(params) {
        return this.buildFilteredQuery(params).getCount();
    }
    /**
     * Facet counts for the filter chips. Every facet bucket is computed over the *other*
     * filters, so each chip shows what its selection would yield.
     *
     * @param params The filter set.
     * @returns The facet-count envelope.
     */
    async getDocumentFacets(params) {
        const facetOf = async (column, omit) => {
            const facetParams = { ...params, [omit]: undefined };
            const rows = await this.buildFilteredQuery(facetParams)
                .select(`document.${column}`, 'value')
                .addSelect('COUNT(*)', 'count')
                .groupBy(`document.${column}`)
                .getRawMany();
            return rows.reduce((acc, row) => {
                if (row.value !== null && row.value !== undefined) {
                    acc[row.value] = Number(row.count);
                }
                return acc;
            }, {});
        };
        const [kind, status, knowledgeStatus, reviewStatus, source] = await Promise.all([
            facetOf('kind', 'kind'),
            facetOf('status', 'status'),
            facetOf('knowledgeStatus', 'knowledgeStatus'),
            facetOf('reviewStatus', 'reviewStatus'),
            facetOf('source', 'source')
        ]);
        // Category + tag facets group over the pivots joined to the filtered document set
        const categories = await this.buildFilteredQuery({ ...params, categoryIds: undefined })
            .innerJoin('document.categories', 'facetCategory')
            .select('facetCategory.id', 'id')
            .addSelect('facetCategory.name', 'name')
            .addSelect('COUNT(*)', 'count')
            .groupBy('facetCategory.id')
            .addGroupBy('facetCategory.name')
            .getRawMany();
        const tags = await this.buildFilteredQuery({ ...params, tagIds: undefined })
            .innerJoin('document.tags', 'facetTag')
            .select('facetTag.id', 'id')
            .addSelect('facetTag.name', 'name')
            .addSelect('COUNT(*)', 'count')
            .groupBy('facetTag.id')
            .addGroupBy('facetTag.name')
            .getRawMany();
        // Preset chips
        const [all, needsReview, notInKnowledge, archived] = await Promise.all([
            this.buildFilteredQuery(params).getCount(),
            this.buildFilteredQuery({
                ...params,
                reviewStatus: [contracts_1.DocumentReviewStatusEnum.PENDING],
                needsReview: undefined
            }).getCount(),
            this.buildFilteredQuery({
                ...params,
                knowledgeStatus: [contracts_1.DocumentKnowledgeStatusEnum.NONE, contracts_1.DocumentKnowledgeStatusEnum.EXCLUDED]
            }).getCount(),
            this.buildFilteredQuery({ ...params, archived: 'only' }).getCount()
        ]);
        return {
            kind,
            status,
            knowledgeStatus,
            reviewStatus,
            source,
            categories: categories.map((row) => ({ id: row.id, name: row.name, count: Number(row.count) })),
            tags: tags.map((row) => ({ id: row.id, name: row.name, count: Number(row.count) })),
            presets: { all, needsReview, notInKnowledge, archived }
        };
    }
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
    emitDocumentEvent(entity, type, context = { phase: 'crud' }, input) {
        try {
            const ctx = core_1.RequestContext.currentRequestContext();
            // `EventBus.publish` is `async` — see `DocumentProcessingService.emitEvent`: the
            // catch below never sees a rejection, so terminate the promise explicitly.
            this._eventBus
                .publish(new document_event_1.DocumentEvent(ctx, entity, type, context, input))
                .catch((error) => this.logger.warn(`Failed to publish DocumentEvent (${type}): ${error.message}`));
        }
        catch (error) {
            this.logger.warn(`Failed to publish DocumentEvent (${type}): ${error.message}`);
        }
    }
    /**
     * Builds the shared filtered query for list/count/facets — tenant + organization scope,
     * visibility scope, soft-delete filter (implicit), and every filter of the DTO.
     *
     * @param params The filter set.
     * @returns A scoped `SelectQueryBuilder`.
     */
    buildFilteredQuery(params) {
        const tenantId = core_1.RequestContext.currentTenantId();
        // NEVER optional: `whitelist: true` strips an unexpected `organizationId` off the query
        // DTO, so a missing scope must fall back to the request context (or 400) — treating it
        // as "no filter" would list every organization of the tenant.
        const organizationId = this.resolveOrganizationId(params);
        const qb = this.typeOrmRepository.createQueryBuilder('document');
        qb.where((0, core_1.prepareSQLQuery)(`"document"."tenantId" = :tenantId`), { tenantId });
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."organizationId" = :organizationId`), { organizationId });
        this.applyVisibilityScope(qb);
        this.applyArchivedFilter(qb, params);
        this.applyAttributeFilters(qb, params);
        this.applyDateRangeFilters(qb, params);
        this.applyTreeFilter(qb, params);
        this.applyTaxonomyFilters(qb, params);
        this.applySearchFilter(qb, params);
        return qb;
    }
    /**
     * Archived handling (default exclude): `exclude` hides archived rows, `only` keeps just
     * them, and any other value (`include`) leaves the flag unfiltered.
     */
    applyArchivedFilter(qb, params) {
        const archived = params.archived ?? 'exclude';
        if (archived === 'exclude') {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."isArchived" = :isArchived`), { isArchived: false });
        }
        else if (archived === 'only') {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."isArchived" = :isArchived`), { isArchived: true });
        }
    }
    /**
     * The scalar/enum column filters of the DTO (kind, statuses, source, visibility, searchable).
     */
    applyAttributeFilters(qb, params) {
        if (params.kind?.length) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."kind" IN (:...kinds)`), { kinds: params.kind });
        }
        if (params.status?.length) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."status" IN (:...statuses)`), { statuses: params.status });
        }
        if (params.knowledgeStatus?.length) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."knowledgeStatus" IN (:...knowledgeStatuses)`), {
                knowledgeStatuses: params.knowledgeStatus
            });
        }
        // needsReview shorthand wins over reviewStatus if both sent
        if (params.needsReview === true) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."reviewStatus" = :pendingReview`), {
                pendingReview: contracts_1.DocumentReviewStatusEnum.PENDING
            });
        }
        else if (params.reviewStatus?.length) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."reviewStatus" IN (:...reviewStatuses)`), { reviewStatuses: params.reviewStatus });
        }
        if (params.source?.length) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."source" IN (:...sources)`), { sources: params.source });
        }
        if (params.visibility) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."visibility" = :visibility`), { visibility: params.visibility });
        }
        if (typeof params.searchable === 'boolean') {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."searchable" = :searchableFlag`), { searchableFlag: params.searchable });
        }
    }
    /**
     * The `createdAt` / `updatedAt` range bounds; date-only `To` bounds cover the whole day.
     */
    applyDateRangeFilters(qb, params) {
        if (params.createdAtFrom) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."createdAt" >= :createdAtFrom`), { createdAtFrom: params.createdAtFrom });
        }
        if (params.createdAtTo) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."createdAt" <= :createdAtTo`), {
                createdAtTo: this.endOfDayIfDateOnly(params.createdAtTo)
            });
        }
        if (params.updatedAtFrom) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."updatedAt" >= :updatedAtFrom`), { updatedAtFrom: params.updatedAtFrom });
        }
        if (params.updatedAtTo) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."updatedAt" <= :updatedAtTo`), {
                updatedAtTo: this.endOfDayIfDateOnly(params.updatedAtTo)
            });
        }
    }
    /**
     * Tree browse vs flat search: `parentId: 'root'` scopes to the roots, any other id scopes
     * to that node's direct children, and an absent `parentId` searches the whole organization.
     */
    applyTreeFilter(qb, params) {
        if (params.parentId === 'root') {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."parentId" IS NULL`));
        }
        else if (params.parentId) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."parentId" = :parentId`), { parentId: params.parentId });
        }
    }
    /**
     * ANY-match M2M filters (categories, tags) via pivot EXISTS subqueries.
     */
    applyTaxonomyFilters(qb, params) {
        if (params.categoryIds?.length) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`EXISTS (SELECT 1 FROM "document_category_document" "dcd" WHERE "dcd"."documentId" = "document"."id" AND "dcd"."documentCategoryId" IN (:...filterCategoryIds))`), { filterCategoryIds: params.categoryIds });
        }
        if (params.tagIds?.length) {
            qb.andWhere((0, core_1.prepareSQLQuery)(`EXISTS (SELECT 1 FROM "tag_document" "td" WHERE "td"."documentId" = "document"."id" AND "td"."tagId" IN (:...filterTagIds))`), { filterTagIds: params.tagIds });
        }
    }
    /**
     * Name / content search. `searchIn: 'content'` widens the name match with the content
     * columns — gated on the row's own `searchable` flag, and only after the query-length
     * guard has accepted the term.
     */
    applySearchFilter(qb, params) {
        if (!params.q) {
            return;
        }
        if (params.searchIn !== 'content') {
            qb.andWhere((0, core_1.prepareSQLQuery)(`LOWER("document"."name") LIKE :q`), { q: `%${params.q.toLowerCase()}%` });
            return;
        }
        (0, content_search_guard_1.assertContentSearchQueryLength)(params.q);
        qb.andWhere(new typeorm_1.Brackets((web) => {
            web.where((0, core_1.prepareSQLQuery)(`LOWER("document"."name") LIKE :q`), { q: `%${params.q.toLowerCase()}%` });
            web.orWhere(new typeorm_1.Brackets((content) => {
                content.where((0, core_1.prepareSQLQuery)(`"document"."searchable" = :contentSearchable`), {
                    contentSearchable: true
                });
                content.andWhere(new typeorm_1.Brackets((cols) => {
                    cols.where((0, core_1.prepareSQLQuery)(`LOWER("document"."contentHtml") LIKE :q`), {
                        q: `%${params.q.toLowerCase()}%`
                    });
                    cols.orWhere((0, core_1.prepareSQLQuery)(`LOWER("document"."extractedText") LIKE :q`), {
                        q: `%${params.q.toLowerCase()}%`
                    });
                }));
            }));
        }));
    }
    /**
     * Normalizes the requested sort direction; anything other than `ASC`/`DESC` leaves the
     * direction unset so the caller's own default applies.
     */
    resolveSortOrder(sortOrder) {
        if (sortOrder === 'ASC') {
            return 'ASC';
        }
        if (sortOrder === 'DESC') {
            return 'DESC';
        }
        return undefined;
    }
    /**
     * Extends a date-only `To` bound to cover the whole day.
     */
    endOfDayIfDateOnly(value) {
        return /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T23:59:59.999Z` : value;
    }
    /**
     * Maps the writable metadata fields of the create/update DTOs onto entity fields
     * (including tag/category id arrays → relation stubs). Tags arrive as `tagIds`, as the
     * contracts-published `tags` references, or both — see `resolveTagIds`.
     */
    buildAssignableFields(input) {
        const fields = {};
        if (input.organizationId !== undefined) {
            fields.organizationId = input.organizationId;
        }
        if (input.name !== undefined) {
            fields.name = input.name;
        }
        if (input.parentId !== undefined) {
            fields.parentId = input.parentId;
        }
        if (input.index !== undefined) {
            fields.index = input.index;
        }
        if (input.icon !== undefined) {
            fields.icon = input.icon;
        }
        if (input.color !== undefined) {
            fields.color = input.color;
        }
        if (input.description !== undefined) {
            fields.description = input.description;
        }
        if (input.visibility !== undefined) {
            fields.visibility = input.visibility;
        }
        if (input.searchable !== undefined) {
            fields.searchable = input.searchable;
        }
        if (input.isLocked !== undefined) {
            fields.isLocked = input.isLocked;
        }
        if (input.summary !== undefined) {
            fields.summary = input.summary;
        }
        if (input.categoryIds !== undefined) {
            fields.categories = input.categoryIds.map((id) => ({ id }));
        }
        // `tagIds` and the contracts-published `tags?: ITag[]` are the same operation, so the two
        // shapes are folded into one de-duplicated id list here rather than at every call site.
        const tagIds = (0, document_tag_reference_1.resolveTagIds)(input);
        if (tagIds !== undefined) {
            fields.tags = tagIds.map((id) => ({ id }));
        }
        return fields;
    }
    /**
     * Server-side sanitization of the `contentHtml` render cache. Delegates to the shared
     * **allowlist** sanitizer of `@gauzy/core` (`core/html-sanitizer`) — a denylist of regexes
     * is bypassable by construction, so the platform keeps exactly one parser-backed
     * implementation. `contentJson` stays canonical; this cache is regenerated on every save.
     */
    sanitizeHtml(html) {
        return (0, core_1.sanitizeRichHtml)(html);
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = DocumentService_1 = tslib_1.__decorate([
    (0, core_1.FavoriteService)(contracts_1.BaseEntityEnum.Document),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        mikro_orm_document_repository_1.MikroOrmDocumentRepository,
        type_orm_document_link_repository_1.TypeOrmDocumentLinkRepository,
        document_version_service_1.DocumentVersionService,
        document_access_service_1.DocumentAccessService,
        document_settings_service_1.DocumentSettingsService,
        core_1.EventBus,
        cqrs_1.EventBus,
        cqrs_1.CommandBus,
        core_1.MentionService])
], DocumentService);
//# sourceMappingURL=document.service.js.map