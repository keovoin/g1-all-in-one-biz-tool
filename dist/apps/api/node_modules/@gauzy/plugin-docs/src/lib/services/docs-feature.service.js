"use strict";
var DocsFeatureService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsFeatureService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_constants_1 = require("../docs.constants");
/**
 * Worker-safe resolution of the `FEATURE_DOCUMENTS` toggle for an explicit tenant/organization.
 *
 * The REST layer has `FeatureFlagGuard`, but the pipeline does not: a `docs.extract` job that was
 * enqueued while the feature was on keeps running after an admin turns it off, and the recovery
 * sweep happily re-drives it. This service is what lets the pipeline honour the flag too.
 *
 * 🛑 It cannot go through the inherited `FeatureOrganizationService` finders: they are
 * `TenantAwareCrudService` methods that merge the tenant off `RequestContext`, and queue threads
 * have none. The tenant/organization pair therefore comes from the job snapshot and is applied
 * explicitly, through the service's own repository.
 *
 * Answers are memoized for {@link DOCS_FEATURE_CACHE_TTL_MS} so a batch of stage transitions
 * costs one lookup rather than one per stage, and **every** failure resolves to `true`: a flag
 * lookup that cannot be answered must not silently park an organization's whole pipeline.
 */
let DocsFeatureService = DocsFeatureService_1 = class DocsFeatureService {
    constructor(featureService, featureOrganizationService) {
        this.featureService = featureService;
        this.featureOrganizationService = featureOrganizationService;
        this.logger = new common_1.Logger(DocsFeatureService_1.name);
        /** `${tenantId}:${organizationId}` → memoized answer. */
        this.cache = new Map();
    }
    /**
     * Whether `FEATURE_DOCUMENTS` is enabled for the given scope.
     *
     * Resolution order (most specific wins): the organization's own `feature_organization` row,
     * then the tenant-wide row (`organizationId` null — what `updateTenantFeatureOrganizations`
     * seeds), then whatever the core `FeatureService` says globally (which itself falls back to
     * the `@gauzy/config` toggle when no `feature` row exists).
     *
     * @param tenantId The tenant scope (from the job snapshot).
     * @param organizationId The organization scope (from the job snapshot).
     * @returns True when the pipeline may process work for this scope.
     */
    async isEnabledFor(tenantId, organizationId) {
        if (!tenantId) {
            return true; // nothing to scope the lookup by — never park on a missing snapshot
        }
        const key = `${tenantId}:${organizationId ?? ''}`;
        const cached = this.cache.get(key);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.enabled;
        }
        let enabled = true;
        try {
            enabled = await this.resolve(tenantId, organizationId);
        }
        catch (error) {
            // Fail OPEN: an unreadable flag must never park the pipeline for a whole tenant.
            this.logger.warn(`Could not resolve ${contracts_1.FeatureEnum.FEATURE_DOCUMENTS} for tenant ${tenantId}: ` +
                `${error.message} — treating it as enabled.`);
            enabled = true;
        }
        this.cache.set(key, { enabled, expiresAt: Date.now() + docs_constants_1.DOCS_FEATURE_CACHE_TTL_MS });
        return enabled;
    }
    /** Test/ops seam: drops the memoized answers. */
    resetCache() {
        this.cache.clear();
    }
    /**
     * The uncached lookup behind {@link isEnabledFor}.
     */
    async resolve(tenantId, organizationId) {
        const rows = await this.featureOrganizationService.typeOrmFeatureOrganizationRepository.find({
            where: { tenantId, feature: { code: contracts_1.FeatureEnum.FEATURE_DOCUMENTS } },
            relations: { feature: true }
        });
        const scoped = (organizationId ? rows.find((row) => row.organizationId === organizationId) : undefined) ??
            rows.find((row) => !row.organizationId);
        if (scoped) {
            return scoped.isEnabled === true;
        }
        // No per-tenant row — the global toggle (with the core's own config fallback) decides.
        return this.featureService.isFeatureEnabled(contracts_1.FeatureEnum.FEATURE_DOCUMENTS);
    }
};
exports.DocsFeatureService = DocsFeatureService;
exports.DocsFeatureService = DocsFeatureService = DocsFeatureService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.FeatureService,
        core_1.FeatureOrganizationService])
], DocsFeatureService);
//# sourceMappingURL=docs-feature.service.js.map