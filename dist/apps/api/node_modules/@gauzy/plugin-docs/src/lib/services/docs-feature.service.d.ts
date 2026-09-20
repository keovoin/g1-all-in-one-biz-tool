import { ID } from '@gauzy/contracts';
import { FeatureOrganizationService, FeatureService } from '@gauzy/core';
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
export declare class DocsFeatureService {
    private readonly featureService;
    private readonly featureOrganizationService;
    private readonly logger;
    /** `${tenantId}:${organizationId}` → memoized answer. */
    private readonly cache;
    constructor(featureService: FeatureService, featureOrganizationService: FeatureOrganizationService);
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
    isEnabledFor(tenantId: ID, organizationId?: ID): Promise<boolean>;
    /** Test/ops seam: drops the memoized answers. */
    resetCache(): void;
    /**
     * The uncached lookup behind {@link isEnabledFor}.
     */
    private resolve;
}
