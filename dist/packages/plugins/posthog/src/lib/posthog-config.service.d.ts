import { TenantSettingService } from '@gauzy/core';
import { ID } from '@gauzy/contracts';
import { PosthogModuleOptions } from './posthog.interfaces';
/**
 * Service for retrieving PostHog configuration with hierarchical cascade resolution.
 * Priority (highest to lowest): Tenant DB → Global DB (tenantId=NULL) → Environment variables
 */
export declare class PosthogConfigService {
    private readonly tenantSettingService;
    private readonly logger;
    constructor(tenantSettingService: TenantSettingService);
    /**
     * Get PostHog configuration with cascading resolution.
     *
     * @param tenantId - Optional tenant ID for tenant-specific settings
     * @returns PosthogModuleOptions with resolved settings
     */
    getConfig(tenantId?: ID): Promise<PosthogModuleOptions>;
    /**
     * Check if PostHog is enabled for a specific tenant.
     *
     * @param tenantId - Optional tenant ID
     * @returns true if PostHog is enabled and has an API key
     */
    isEnabled(tenantId?: ID): Promise<boolean>;
}
