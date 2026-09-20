"use strict";
var DocumentLinkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentLinkService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const mikro_orm_document_link_repository_1 = require("../repositories/mikro-orm-document-link.repository");
const type_orm_document_link_repository_1 = require("../repositories/type-orm-document-link.repository");
const document_service_1 = require("./document.service");
let DocumentLinkService = DocumentLinkService_1 = class DocumentLinkService extends core_1.TenantAwareCrudService {
    constructor(typeOrmDocumentLinkRepository, mikroOrmDocumentLinkRepository, documentService) {
        super(typeOrmDocumentLinkRepository, mikroOrmDocumentLinkRepository);
        this.typeOrmDocumentLinkRepository = typeOrmDocumentLinkRepository;
        this.mikroOrmDocumentLinkRepository = mikroOrmDocumentLinkRepository;
        this.documentService = documentService;
        this.logger = new common_1.Logger(DocumentLinkService_1.name);
    }
    /**
     * Idempotent link write on `(documentId, entity, entityId)` — a duplicate returns the
     * existing row.
     *
     * @param input The link payload.
     * @returns The created (or pre-existing) link.
     */
    async createLink(input) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const { organizationId, documentId, entity, entityId } = input;
        const existing = await this.typeOrmDocumentLinkRepository.findOne({
            where: { tenantId, organizationId, documentId, entity, entityId }
        });
        if (existing) {
            return this.withParsedMetadata(existing);
        }
        const link = await this.create({
            tenantId,
            organizationId,
            documentId,
            entity,
            entityId,
            metadata: this.serializeMetadata(input.metadata)
        });
        return this.withParsedMetadata(link);
    }
    /**
     * The "Documents panel" reverse lookup: every link attached to one business record, with a
     * **list-safe** projection of the document relation.
     *
     * The link rows are only as private as the documents behind them, so the joined document is
     * put through the exact same gate as the document list itself: organization scope on both
     * sides of the join plus `DocumentService.applyVisibilityScope()` (visibility OR ownership
     * OR `DOCS_MANAGE` OR a share grant). Content columns (`contentJson`, `contentHtml`,
     * `extractedText`, `contentBinary`) and the storage key are never projected here — the
     * panel needs metadata, and `fileUrl` is resolved from `storageKey` by the subscriber, so
     * withholding the column withholds the URL too.
     *
     * @param entity The target record type.
     * @param entityId The target record id.
     * @param organizationId Organization scope (falls back to the requester's current org).
     * @returns The matching links.
     */
    async getLinksForEntity(entity, entityId, organizationId) {
        const qb = this.buildScopedLinkQuery(organizationId);
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document_link"."entity" = :entity`), { entity });
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document_link"."entityId" = :entityId`), { entityId });
        const [items, total] = await qb.getManyAndCount();
        return { items: items.map((item) => this.withParsedMetadata(item)), total };
    }
    /**
     * Forward lookup: everything one document is attached to.
     *
     * The document itself is resolved through the read scope first — otherwise the mere
     * *existence* (and count) of links and attachments on someone else's PRIVATE document, or
     * on another organization's document, would leak through this endpoint.
     *
     * @param documentId The document id.
     * @param organizationId Explicit organization scope for the document read (falls back to the
     * requester's current organization when omitted).
     * @returns The matching links.
     */
    async getLinksForDocument(documentId, organizationId) {
        const document = await this.documentService.findOneScoped(documentId, [], organizationId);
        const qb = this.buildScopedLinkQuery(document.organizationId);
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document_link"."documentId" = :documentId`), { documentId });
        const [items, total] = await qb.getManyAndCount();
        return { items: items.map((item) => this.withParsedMetadata(item)), total };
    }
    /**
     * Soft-deletes a link.
     *
     * @param id The link id.
     * @returns The soft-deleted link.
     */
    async deleteLink(id) {
        // Tenant + organization, like every other link path — the inherited `findOneByIdString`
        // merges the tenant only, which would let one organization detach another's links.
        const link = await this.typeOrmDocumentLinkRepository.findOne({
            where: {
                id,
                tenantId: core_1.RequestContext.currentTenantId(),
                organizationId: this.documentService.resolveOrganizationId()
            }
        });
        if (!link) {
            throw new common_1.NotFoundException(`Document link ${id} was not found`);
        }
        await this.softDelete(id);
        return link;
    }
    /**
     * Builds the shared, fully-scoped link query: tenant + organization on the link row, an
     * `INNER JOIN` to the document (so a link whose document is out of scope disappears
     * entirely), the same organization scope on the joined document, the visibility/share
     * predicate, and the list-safe document projection.
     *
     * @param organizationId Organization scope (falls back to the requester's current org).
     * @returns The scoped query builder.
     */
    buildScopedLinkQuery(organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const scopedOrganizationId = this.documentService.resolveOrganizationId({ organizationId });
        const qb = this.typeOrmDocumentLinkRepository.createQueryBuilder('document_link');
        qb.innerJoin('document_link.document', 'document');
        qb.addSelect(document_service_1.DOCUMENT_LIST_COLUMNS.map((column) => `document.${column}`));
        qb.where((0, core_1.prepareSQLQuery)(`"document_link"."tenantId" = :tenantId`), { tenantId });
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document_link"."organizationId" = :organizationId`), {
            organizationId: scopedOrganizationId
        });
        // The join partner is scoped independently — a link row may not drag a foreign
        // organization's document into the response even if the link row itself is in scope.
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."organizationId" = :organizationId`));
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."tenantId" = :tenantId`));
        this.documentService.applyVisibilityScope(qb, 'document');
        qb.orderBy('document_link.createdAt', 'DESC');
        return qb;
    }
    /**
     * Serializes the metadata JSON for persistence on the SQLite path (the plain-text `json`
     * column) — per spec, this entity has no subscriber, the owning service round-trips.
     */
    serializeMetadata(value) {
        if (value && typeof value === 'object' && ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)())) {
            try {
                return JSON.stringify(value);
            }
            catch (error) {
                this.logger.error('Error serializing link metadata:', error.message);
                return null;
            }
        }
        return value ?? null;
    }
    /**
     * Parses metadata back into an object on the SQLite path.
     */
    withParsedMetadata(link) {
        if (link?.metadata && typeof link.metadata === 'string' && ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)())) {
            try {
                link.metadata = JSON.parse(link.metadata);
            }
            catch {
                // Leave as-is — a malformed value must never break the read path
            }
        }
        return link;
    }
};
exports.DocumentLinkService = DocumentLinkService;
exports.DocumentLinkService = DocumentLinkService = DocumentLinkService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_link_repository_1.TypeOrmDocumentLinkRepository,
        mikro_orm_document_link_repository_1.MikroOrmDocumentLinkRepository,
        document_service_1.DocumentService])
], DocumentLinkService);
//# sourceMappingURL=document-link.service.js.map