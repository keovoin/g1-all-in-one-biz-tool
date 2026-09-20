"use strict";
var DocumentShareService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentShareService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_constants_1 = require("../docs.constants");
const mikro_orm_document_share_repository_1 = require("../repositories/mikro-orm-document-share.repository");
const type_orm_document_share_repository_1 = require("../repositories/type-orm-document-share.repository");
const document_access_service_1 = require("./document-access.service");
const document_service_1 = require("./document.service");
/**
 * CRUD for the `DocumentShare` overlay (`03-backend-plugin.md` §4.12,
 * `08-permissions-security.md` §3.3).
 *
 * Rules enforced here — the route guard only proves the verb (`DOCS_READ` / `DOCS_UPDATE`):
 *
 * - The target document must be **readable** by the caller, else 404 (no existence oracle) —
 *   `DocumentService.findOneScoped` does that, share overlay included.
 * - Only the document's **creator** or a **`DOCS_MANAGE`** holder may list or mutate the
 *   overlay (403 `DOCS_SHARE_FORBIDDEN`). A grantee — even at `EDIT` — can never re-share.
 * - Shares are meaningful on `visibility: PRIVATE` documents only → 409
 *   `DOCS_SHARE_NOT_PRIVATE` on an ORGANIZATION document.
 * - Exactly one of `employeeId` / `teamId` → 400 `DOCS_SHARE_TARGET`.
 * - One row per (document, target) → 409 `DOCS_SHARE_EXISTS`.
 */
let DocumentShareService = DocumentShareService_1 = class DocumentShareService extends core_1.TenantAwareCrudService {
    constructor(typeOrmDocumentShareRepository, mikroOrmDocumentShareRepository, documentService, documentAccessService) {
        super(typeOrmDocumentShareRepository, mikroOrmDocumentShareRepository);
        this.typeOrmDocumentShareRepository = typeOrmDocumentShareRepository;
        this.mikroOrmDocumentShareRepository = mikroOrmDocumentShareRepository;
        this.documentService = documentService;
        this.documentAccessService = documentAccessService;
        this.logger = new common_1.Logger(DocumentShareService_1.name);
    }
    /**
     * Lists the share overlay of one document.
     *
     * @param documentId The document whose overlay to read.
     * @returns The share rows with their employee/team relations.
     */
    async findAllForDocument(documentId) {
        await this.assertCanAdminister(documentId);
        const [items, total] = await this.typeOrmDocumentShareRepository.findAndCount({
            where: { documentId, tenantId: core_1.RequestContext.currentTenantId() },
            relations: { employee: true, team: true },
            order: { createdAt: 'ASC' }
        });
        return { items, total };
    }
    /**
     * Creates one share row.
     *
     * @param documentId The (PRIVATE) document to share.
     * @param input The grantee + access level.
     * @returns The created share row.
     */
    async createShare(documentId, input) {
        const document = await this.assertCanAdminister(documentId);
        // XOR target — both or neither is a 400 (mirrors CHK_document_share_target_xor).
        const hasEmployee = !!input.employeeId;
        const hasTeam = !!input.teamId;
        if (hasEmployee === hasTeam) {
            throw new common_1.BadRequestException({
                message: 'Exactly one of employeeId / teamId must be provided',
                code: docs_constants_1.DOCS_SHARE_TARGET
            });
        }
        // The overlay is additive on PRIVATE documents only (08 §3.3) — sharing an
        // ORGANIZATION document would be a silent no-op, so it is refused loudly.
        if (document.visibility !== contracts_1.DocumentVisibilityEnum.PRIVATE) {
            throw new common_1.ConflictException({
                message: 'Shares apply to PRIVATE documents only',
                code: docs_constants_1.DOCS_SHARE_NOT_PRIVATE
            });
        }
        const tenantId = core_1.RequestContext.currentTenantId();
        const duplicate = await this.typeOrmDocumentShareRepository.findOne({
            where: {
                documentId,
                tenantId,
                employeeId: hasEmployee ? input.employeeId : (0, typeorm_1.IsNull)(),
                teamId: hasTeam ? input.teamId : (0, typeorm_1.IsNull)()
            }
        });
        if (duplicate) {
            throw new common_1.ConflictException({
                message: 'This document is already shared with that target',
                code: docs_constants_1.DOCS_SHARE_EXISTS
            });
        }
        const share = await this.create({
            documentId,
            organizationId: document.organizationId,
            employeeId: hasEmployee ? input.employeeId : null,
            teamId: hasTeam ? input.teamId : null,
            access: input.access
        });
        this.logger.debug(`Document ${documentId} shared (${input.access}) with ${hasEmployee ? 'employee' : 'team'}.`);
        return share;
    }
    /**
     * Updates the access level of one share row.
     *
     * @param documentId The document owning the row.
     * @param shareId The share row id.
     * @param input The new access level.
     * @returns The updated share row.
     */
    async updateShare(documentId, shareId, input) {
        await this.assertCanAdminister(documentId);
        const share = await this.findShareOrFail(documentId, shareId);
        await this.typeOrmDocumentShareRepository.update({ id: share.id, tenantId: core_1.RequestContext.currentTenantId() }, { access: input.access });
        return this.findShareOrFail(documentId, shareId);
    }
    /**
     * Revokes one share row (soft delete — the affected row is returned, per the plugin's
     * "no 204s" convention).
     *
     * @param documentId The document owning the row.
     * @param shareId The share row id.
     * @returns The revoked share row.
     */
    async deleteShare(documentId, shareId) {
        await this.assertCanAdminister(documentId);
        const share = await this.findShareOrFail(documentId, shareId);
        await this.typeOrmDocumentShareRepository.softDelete({
            id: share.id,
            tenantId: core_1.RequestContext.currentTenantId()
        });
        return share;
    }
    /**
     * Loads the target document through the read scope (404 when not readable) and asserts
     * that the caller may administer its overlay (403 otherwise).
     *
     * @param documentId The document id.
     * @returns The document.
     */
    async assertCanAdminister(documentId) {
        // Not readable → 404 from findOneScoped; readable but not owned/managed → 403 below.
        const document = await this.documentService.findOneScoped(documentId);
        const permitted = await this.documentAccessService.canAdministerShares({
            createdByUserId: document.createdByUserId,
            visibility: document.visibility
        });
        if (!permitted) {
            throw new common_1.ForbiddenException({
                message: 'Only the document creator or a DOCS_MANAGE holder can manage its shares',
                code: docs_constants_1.DOCS_SHARE_FORBIDDEN
            });
        }
        return document;
    }
    /**
     * Loads one share row scoped to its document (a share id from another document is a 404).
     *
     * @param documentId The owning document id.
     * @param shareId The share row id.
     * @returns The share row.
     */
    async findShareOrFail(documentId, shareId) {
        const share = await this.typeOrmDocumentShareRepository.findOne({
            where: { id: shareId, documentId, tenantId: core_1.RequestContext.currentTenantId() },
            relations: { employee: true, team: true }
        });
        if (!share) {
            throw new common_1.NotFoundException(`Document share ${shareId} was not found`);
        }
        return share;
    }
};
exports.DocumentShareService = DocumentShareService;
exports.DocumentShareService = DocumentShareService = DocumentShareService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_share_repository_1.TypeOrmDocumentShareRepository,
        mikro_orm_document_share_repository_1.MikroOrmDocumentShareRepository,
        document_service_1.DocumentService,
        document_access_service_1.DocumentAccessService])
], DocumentShareService);
//# sourceMappingURL=document-share.service.js.map