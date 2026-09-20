"use strict";
var DocumentSettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSettingsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../docs.config");
const docs_constants_1 = require("../docs.constants");
const knowledge_constants_1 = require("../knowledge/knowledge.constants");
const vector_store_registry_1 = require("../knowledge/vector-store/vector-store.registry");
const document_quota_service_1 = require("./document-quota.service");
const quota_calculator_1 = require("./quota.calculator");
/**
 * File types accepted by the upload endpoint (sniffed, never trusted from the client header).
 */
const DOCS_ACCEPTED_TYPES = [
    'pdf',
    'docx',
    'xlsx',
    'pptx',
    'odt',
    'ods',
    'csv',
    'txt',
    'md',
    'html',
    'png',
    'jpg',
    'webp',
    'gif'
];
/**
 * Org-default settings persisted as namespaced rows in the core `tenant_setting` table
 * (`name: 'docs.<organizationId>.<key>'`), plus the read-only deployment capabilities block.
 */
let DocumentSettingsService = DocumentSettingsService_1 = class DocumentSettingsService {
    constructor(tenantSettingService, documentQuotaService) {
        this.tenantSettingService = tenantSettingService;
        this.documentQuotaService = documentQuotaService;
        this.logger = new common_1.Logger(DocumentSettingsService_1.name);
    }
    /**
     * Reads the org defaults + deployment capabilities + the live storage-quota state.
     *
     * @param organizationId The organization scope.
     * @returns The settings envelope.
     */
    async getSettings(organizationId) {
        const [defaults, quota, vectorSearch] = await Promise.all([
            this.getDefaults(organizationId),
            this.documentQuotaService.getQuotaState(organizationId),
            this.isVectorSearchAvailable()
        ]);
        const config = (0, docs_config_1.getDocsConfig)();
        return {
            defaults,
            capabilities: {
                aiEnabled: config.aiEnabled,
                vectorSearch,
                embeddingModel: config.embeddingModel,
                maxFileSize: config.maxFileSize,
                acceptedTypes: DOCS_ACCEPTED_TYPES,
                inboundEmailEnabled: config.inboundEmailEnabled
            },
            quota
        };
    }
    /**
     * Partial update of the org-defaults block only (`capabilities` is never writable).
     *
     * @param organizationId The organization scope.
     * @param input The defaults to update.
     * @returns The updated settings envelope.
     */
    async updateSettings(organizationId, input) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const settings = {};
        if (input.importToKnowledgeDefault !== undefined) {
            settings[this.key(organizationId, 'importToKnowledgeDefault')] = String(input.importToKnowledgeDefault);
        }
        if (input.defaultVisibility !== undefined) {
            settings[this.key(organizationId, 'defaultVisibility')] = input.defaultVisibility;
        }
        if (input.autoClassify !== undefined) {
            settings[this.key(organizationId, 'autoClassify')] = String(input.autoClassify);
        }
        if (input.quotaBytes !== undefined) {
            // Stored verbatim (including an explicit "0" = unlimited for this organization).
            settings[this.key(organizationId, docs_constants_1.DOCS_SETTING_QUOTA_BYTES)] = String(input.quotaBytes);
        }
        if (Object.keys(settings).length > 0) {
            await this.tenantSettingService.saveSettings(settings, tenantId);
        }
        return this.getSettings(organizationId);
    }
    /**
     * Whether this deployment can actually answer a *vector* similarity query — i.e. the store
     * the registry would resolve right now is a vector store, not the lexical floor.
     *
     * Deliberately resolved rather than probed provider-by-provider: `GAUZY_DOCS_VECTOR_STORE`
     * can pin a third-party store, and an unavailable pgvector falls through to `lexical`. The
     * capability block has to report what retrieval will really do, so it asks the same
     * `resolve()` the retrieval path asks (`false` ⇒ lexical-only degradation, per the spec's
     * "pgvector available" line).
     *
     * @returns True when the resolved store is vector-capable.
     */
    async isVectorSearchAvailable() {
        try {
            const store = await vector_store_registry_1.DocumentVectorStoreRegistry.resolve();
            return Boolean(store) && store.id !== knowledge_constants_1.VECTOR_STORE_LEXICAL;
        }
        catch (error) {
            // A capability probe must never fail the settings read — report the honest floor.
            this.logger.warn(`Vector-search capability probe failed: ${error.message}`);
            return false;
        }
    }
    /**
     * Reads the org-defaults block with documented fallbacks.
     *
     * @param organizationId The organization scope.
     * @returns The defaults block.
     */
    async getDefaults(organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const names = ['importToKnowledgeDefault', 'defaultVisibility', 'autoClassify', docs_constants_1.DOCS_SETTING_QUOTA_BYTES].map((key) => this.key(organizationId, key));
        let stored = {};
        try {
            stored = await this.tenantSettingService.getSettings({ where: { name: (0, typeorm_1.In)(names), tenantId } });
        }
        catch (error) {
            this.logger.warn(`Failed to read document settings: ${error.message}`);
        }
        return {
            importToKnowledgeDefault: stored[this.key(organizationId, 'importToKnowledgeDefault')] === 'true',
            defaultVisibility: stored[this.key(organizationId, 'defaultVisibility')] ??
                contracts_1.DocumentVisibilityEnum.ORGANIZATION,
            autoClassify: stored[this.key(organizationId, 'autoClassify')] !== 'false',
            quotaBytes: (0, quota_calculator_1.resolveQuotaBytes)(stored[this.key(organizationId, docs_constants_1.DOCS_SETTING_QUOTA_BYTES)], (0, docs_config_1.getDocsConfig)().orgQuotaBytes)
        };
    }
    /**
     * Builds the namespaced `tenant_setting` row name for one org default.
     */
    key(organizationId, key) {
        return `${docs_constants_1.DOCS_SETTING_PREFIX}.${organizationId}.${key}`;
    }
};
exports.DocumentSettingsService = DocumentSettingsService;
exports.DocumentSettingsService = DocumentSettingsService = DocumentSettingsService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.TenantSettingService,
        document_quota_service_1.DocumentQuotaService])
], DocumentSettingsService);
//# sourceMappingURL=document-settings.service.js.map