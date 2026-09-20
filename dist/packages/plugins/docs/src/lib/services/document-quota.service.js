"use strict";
var DocumentQuotaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentQuotaService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../docs.config");
const docs_constants_1 = require("../docs.constants");
const type_orm_document_repository_1 = require("../repositories/type-orm-document.repository");
const quota_calculator_1 = require("./quota.calculator");
/**
 * Per-organization storage quota (`08-permissions-security.md` §5.7).
 *
 * - Effective quota = org setting `docs.<organizationId>.quotaBytes` when present, else the
 *   deployment default `GAUZY_DOCS_ORG_QUOTA_BYTES`. **`0`/unset = unlimited.**
 * - Usage = `SUM(fileSize)` over **all non-purged** documents of the organization —
 *   archived and soft-deleted (trashed) rows included, because their bytes still exist in
 *   the storage provider.
 * - Uploads reject over quota (`DOCS_QUOTA_EXCEEDED`); system-originated captures
 *   (CHAT/EMAIL) warn and proceed so automated intake never silently drops business records.
 *
 * The arithmetic itself lives in `quota.calculator.ts` (pure, unit-tested); this service is
 * only the I/O around it.
 */
let DocumentQuotaService = DocumentQuotaService_1 = class DocumentQuotaService {
    constructor(typeOrmDocumentRepository, tenantSettingService) {
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.tenantSettingService = tenantSettingService;
        this.logger = new common_1.Logger(DocumentQuotaService_1.name);
    }
    /**
     * Resolves the effective quota for one organization.
     *
     * @param organizationId The organization scope.
     * @returns The quota in bytes; `0` = unlimited.
     */
    async getQuotaBytes(organizationId) {
        const envDefault = (0, docs_config_1.getDocsConfig)().orgQuotaBytes;
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            return envDefault;
        }
        const name = `${docs_constants_1.DOCS_SETTING_PREFIX}.${organizationId}.${docs_constants_1.DOCS_SETTING_QUOTA_BYTES}`;
        try {
            const stored = await this.tenantSettingService.getSettings({ where: { name: (0, typeorm_1.In)([name]), tenantId } });
            return (0, quota_calculator_1.resolveQuotaBytes)(stored?.[name], envDefault);
        }
        catch (error) {
            // A settings read failure must not invent a quota out of thin air — fall back to
            // the deployment default rather than blocking or unblocking uploads at random.
            this.logger.warn(`Failed to read the documents storage quota: ${error.message}`);
            return envDefault;
        }
    }
    /**
     * Current storage usage of one organization: `SUM(fileSize)` over every non-purged
     * document row (archived + soft-deleted included).
     *
     * @param organizationId The organization scope.
     * @returns The used bytes (0 when nothing is stored or the query fails).
     */
    async getUsedBytes(organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        try {
            const qb = this.typeOrmDocumentRepository.createQueryBuilder('document');
            qb.select('COALESCE(SUM(document.fileSize), 0)', 'usedBytes');
            qb.withDeleted(); // trashed rows still occupy provider bytes
            qb.where((0, core_1.prepareSQLQuery)(`"document"."organizationId" = :organizationId`), { organizationId });
            if (tenantId) {
                qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."tenantId" = :tenantId`), { tenantId });
            }
            const row = await qb.getRawOne();
            return Number(row?.usedBytes ?? 0) || 0;
        }
        catch (error) {
            this.logger.warn(`Failed to compute documents storage usage: ${error.message}`);
            return 0;
        }
    }
    /**
     * The quota block reported by `GET /plugins/docs/settings`.
     *
     * @param organizationId The organization scope.
     * @returns Quota, usage, remaining bytes, and the unlimited flag.
     */
    async getQuotaState(organizationId) {
        const [quotaBytes, usedBytes] = await Promise.all([
            this.getQuotaBytes(organizationId),
            this.getUsedBytes(organizationId)
        ]);
        return (0, quota_calculator_1.buildQuotaState)(usedBytes, quotaBytes);
    }
    /**
     * Whether accepting `incomingBytes` more would exceed the organization quota.
     *
     * @param incomingBytes The bytes about to be stored.
     * @param state The already-resolved quota state (avoids re-querying per file in a batch).
     * @returns True when the write must be rejected.
     */
    exceeds(incomingBytes, state) {
        return (0, quota_calculator_1.isQuotaExceeded)(state.usedBytes, incomingBytes, state.quotaBytes);
    }
};
exports.DocumentQuotaService = DocumentQuotaService;
exports.DocumentQuotaService = DocumentQuotaService = DocumentQuotaService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        core_1.TenantSettingService])
], DocumentQuotaService);
//# sourceMappingURL=document-quota.service.js.map