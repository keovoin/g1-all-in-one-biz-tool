"use strict";
var DocumentAccessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentAccessService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const type_orm_document_share_repository_1 = require("../repositories/type-orm-document-share.repository");
const document_access_predicate_1 = require("./document-access.predicate");
const document_access_sql_1 = require("./document-access.sql");
/**
 * Resolves the requesting subject (user id, employee id, current team ids, permissions)
 * and answers share-overlay questions for the read/write paths.
 *
 * There are two evaluation surfaces and they are kept deliberately in lock-step:
 *
 * - **SQL** — `buildShareGrantExistsSql()` folded into `DocumentService.applyVisibilityScope()`
 *   and into the retrieval filter set, so lists/facets/tree/retrieval stay single-query;
 * - **In-memory** — the pure predicates of `document-access.predicate.ts`, used by the
 *   by-id paths (`findOneScoped`) and by the share-administration checks.
 *
 * Team membership is resolved at evaluation time on both surfaces — a removed team member
 * loses access on their next request, with no materialized copies to invalidate.
 */
let DocumentAccessService = DocumentAccessService_1 = class DocumentAccessService {
    constructor(typeOrmDocumentShareRepository) {
        this.typeOrmDocumentShareRepository = typeOrmDocumentShareRepository;
        this.logger = new common_1.Logger(DocumentAccessService_1.name);
    }
    /**
     * The employee id of the requesting user.
     *
     * `RequestContext.currentEmployeeId()` deliberately returns `null` for users holding
     * `CHANGE_SELECTED_EMPLOYEE` (it means "the selected employee", not "me"), which would
     * silently drop share grants for managers — so the identity is read off the JWT user.
     *
     * @returns The requesting user's employee id, or null.
     */
    currentEmployeeId() {
        try {
            return core_1.RequestContext.currentUser()?.employeeId ?? null;
        }
        catch {
            return null;
        }
    }
    /**
     * Loads the team ids the requesting employee currently belongs to.
     *
     * @param employeeId The employee whose memberships to resolve.
     * @returns The organization-team ids (empty when the subject has no employee record).
     */
    async currentTeamIds(employeeId) {
        const id = employeeId ?? this.currentEmployeeId();
        if (!id) {
            return [];
        }
        try {
            const memberships = await this.typeOrmDocumentShareRepository.manager.find(core_1.OrganizationTeamEmployee, {
                select: { organizationTeamId: true },
                where: { employeeId: id, deletedAt: (0, typeorm_1.IsNull)() }
            });
            return memberships.map((membership) => membership.organizationTeamId).filter(Boolean);
        }
        catch (error) {
            // A membership lookup failure must never widen access — it degrades to "no team shares".
            this.logger.warn(`Team membership lookup failed for employee ${id}: ${error.message}`);
            return [];
        }
    }
    /**
     * Builds the access subject of the current request: identity + the permissions the
     * route guards have already proven.
     *
     * @returns The requesting subject (team ids resolved).
     */
    async currentSubject() {
        const employeeId = this.currentEmployeeId();
        return {
            userId: core_1.RequestContext.currentUserId(),
            employeeId,
            teamIds: await this.currentTeamIds(employeeId),
            hasReadPermission: core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_READ),
            hasManagePermission: core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_MANAGE),
            hasUpdatePermission: core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_UPDATE)
        };
    }
    /**
     * Folds the share-grant `EXISTS` clause into a visibility bracket, when — and only
     * when — the requesting subject has an employee identity to match shares against.
     *
     * @param web The `OR` bracket of the visibility scope.
     * @param alias The document alias in the surrounding query.
     * @returns True when the clause was added (i.e. the parameters were bound).
     */
    applyShareScope(web, alias) {
        const employeeId = this.currentEmployeeId();
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!employeeId || !tenantId) {
            return false;
        }
        web.orWhere((0, document_access_sql_1.buildShareGrantExistsSql)(alias), { shareEmployeeId: employeeId, shareTenantId: tenantId });
        return true;
    }
    /**
     * Loads the share rows of one document (used by the by-id access checks and by the
     * share-administration endpoints).
     *
     * @param documentId The document whose overlay to load.
     * @returns The share rows, or an empty array on any lookup failure.
     */
    async loadShares(documentId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            return [];
        }
        try {
            const shares = await this.typeOrmDocumentShareRepository.find({
                where: { documentId, tenantId }
            });
            return shares.map((share) => ({
                employeeId: share.employeeId,
                teamId: share.teamId,
                access: share.access
            }));
        }
        catch (error) {
            this.logger.warn(`Share lookup failed for document ${documentId}: ${error.message}`);
            return [];
        }
    }
    /**
     * Whether the requesting subject may READ the given row, evaluating the full
     * §3.4 truth table including the share overlay.
     *
     * @param document The document projection (`visibility`, `createdByUserId`, `id`).
     * @param documentId The document id, when the row projection does not carry it.
     * @returns True when the row is readable.
     */
    async canRead(document, documentId) {
        const subject = await this.currentSubject();
        // Cheap path first: ORGANIZATION / creator / admin never need the share lookup.
        if ((0, document_access_predicate_1.isDocumentReadable)({ ...document, shares: [] }, subject)) {
            return true;
        }
        if (!subject.employeeId) {
            return false;
        }
        const shares = await this.loadShares(documentId);
        return (0, document_access_predicate_1.isDocumentReadable)({ ...document, shares }, subject);
    }
    /**
     * Whether the requesting subject may MUTATE the given row (§1.6 ownership + `EDIT`
     * share overlay).
     *
     * @param document The document projection.
     * @param documentId The document id.
     * @returns True when the subject may mutate the row.
     */
    async canWrite(document, documentId) {
        const subject = await this.currentSubject();
        if ((0, document_access_predicate_1.isDocumentWritable)({ ...document, shares: [] }, subject)) {
            return true;
        }
        if (!subject.employeeId) {
            return false;
        }
        const shares = await this.loadShares(documentId);
        return (0, document_access_predicate_1.isDocumentWritable)({ ...document, shares }, subject);
    }
    /**
     * Whether the requesting subject may administer the document's share overlay
     * (creator or `DOCS_MANAGE` only — a grantee can never re-share).
     *
     * @param document The document projection.
     * @returns True when share CRUD is permitted on the row.
     */
    async canAdministerShares(document) {
        return (0, document_access_predicate_1.canAdministerShares)(document, await this.currentSubject());
    }
    /**
     * The strongest share access the requesting subject holds on one document.
     *
     * @param document The document projection.
     * @param documentId The document id.
     * @returns The share access level, or null.
     */
    async effectiveShareAccess(document, documentId) {
        const subject = await this.currentSubject();
        if (!subject.employeeId) {
            return null;
        }
        const shares = await this.loadShares(documentId);
        return (0, document_access_predicate_1.effectiveShareAccess)({ ...document, shares }, subject);
    }
    /**
     * Whether the requesting subject holds at least the given share level on a document.
     *
     * @param document The document projection.
     * @param documentId The document id.
     * @param minimum The minimum share access required.
     * @returns True when the overlay grants at least that level.
     */
    async hasShareAtLeast(document, documentId, minimum) {
        const subject = await this.currentSubject();
        if (!subject.employeeId) {
            return false;
        }
        const shares = await this.loadShares(documentId);
        return (0, document_access_predicate_1.hasShareAtLeast)({ ...document, shares }, subject, minimum);
    }
};
exports.DocumentAccessService = DocumentAccessService;
exports.DocumentAccessService = DocumentAccessService = DocumentAccessService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_share_repository_1.TypeOrmDocumentShareRepository])
], DocumentAccessService);
//# sourceMappingURL=document-access.service.js.map