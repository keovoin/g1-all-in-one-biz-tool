"use strict";
var PosthogConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosthogConfigService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const config_1 = require("@gauzy/config");
/**
 * Setting names for PostHog configuration in tenant_setting table.
 * Uses the property names from IPosthogConfig interface directly.
 */
const POSTHOG_SETTING_NAMES = [
    'posthogKey',
    'posthogHost',
    'posthogEnabled',
    'posthogFlushInterval',
    // Additional settings not in IPosthogConfig
    'posthogFlushAt',
    'posthogEnableErrorTracking',
    'posthogAutocapture'
];
/**
 * Service for retrieving PostHog configuration with hierarchical cascade resolution.
 * Priority (highest to lowest): Tenant DB → Global DB (tenantId=NULL) → Environment variables
 */
let PosthogConfigService = PosthogConfigService_1 = class PosthogConfigService {
    constructor(tenantSettingService) {
        this.tenantSettingService = tenantSettingService;
        this.logger = new common_1.Logger(PosthogConfigService_1.name);
    }
    /**
     * Get PostHog configuration with cascading resolution.
     *
     * @param tenantId - Optional tenant ID for tenant-specific settings
     * @returns PosthogModuleOptions with resolved settings
     */
    async getConfig(tenantId) {
        // Get environment config with proper typing
        const envConfig = config_1.environment.posthog ?? {};
        // Environment variable defaults using IPosthogConfig property names
        const envDefaults = {
            posthogKey: envConfig.posthogKey ?? '',
            posthogHost: envConfig.posthogHost ?? 'https://app.posthog.com',
            posthogEnabled: String(envConfig.posthogEnabled ?? false),
            posthogFlushInterval: String(envConfig.posthogFlushInterval ?? 10000)
        };
        // Get resolved settings from DB with fallback to env
        const resolvedSettings = await this.tenantSettingService.getResolvedSettings(POSTHOG_SETTING_NAMES, tenantId, envDefaults);
        const apiKey = resolvedSettings['posthogKey'] || '';
        const enabled = resolvedSettings['posthogEnabled'] === 'true';
        if (!enabled || !apiKey) {
            this.logger.debug(`PostHog disabled for tenant ${tenantId || 'global'}: enabled=${enabled}, hasApiKey=${!!apiKey}`);
        }
        return {
            apiKey,
            apiHost: resolvedSettings['posthogHost'] || 'https://app.posthog.com',
            enableErrorTracking: resolvedSettings['posthogEnableErrorTracking'] !== 'false',
            flushInterval: parseInt(resolvedSettings['posthogFlushInterval'], 10) || 10000,
            flushAt: parseInt(resolvedSettings['posthogFlushAt'], 10) || 20,
            autocapture: resolvedSettings['posthogAutocapture'] === 'true'
        };
    }
    /**
     * Check if PostHog is enabled for a specific tenant.
     *
     * @param tenantId - Optional tenant ID
     * @returns true if PostHog is enabled and has an API key
     */
    async isEnabled(tenantId) {
        // Get resolved settings to check the enabled flag directly
        const envConfig = config_1.environment.posthog ?? {};
        const envDefaults = {
            posthogKey: envConfig.posthogKey ?? '',
            posthogEnabled: String(envConfig.posthogEnabled ?? false)
        };
        const resolvedSettings = await this.tenantSettingService.getResolvedSettings(['posthogKey', 'posthogEnabled'], tenantId, envDefaults);
        const enabled = resolvedSettings['posthogEnabled'] === 'true';
        const hasApiKey = !!resolvedSettings['posthogKey'];
        return enabled && hasApiKey;
    }
};
exports.PosthogConfigService = PosthogConfigService;
exports.PosthogConfigService = PosthogConfigService = PosthogConfigService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.TenantSettingService])
], PosthogConfigService);
//# sourceMappingURL=posthog-config.service.js.map