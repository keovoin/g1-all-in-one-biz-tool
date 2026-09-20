"use strict";
var PlaneIntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaneIntegrationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
const plane_setting_enum_1 = require("./plane-setting.enum");
/** Global hosted Ever Gauzy PM UI URLs used when the integration runs in "shared" mode. */
const SHARED_PLANE_WEB_URL = 'https://pm.gauzy.co';
const SHARED_PLANE_ADMIN_URL = ''; // admin (god-mode) not offered in shared mode
const SHARED_PLANE_SPACE_URL = 'https://pm-space.gauzy.co';
let PlaneIntegrationService = PlaneIntegrationService_1 = class PlaneIntegrationService {
    constructor(integrationService, integrationTenantService, tenantApiKeyService, configService) {
        this.integrationService = integrationService;
        this.integrationTenantService = integrationTenantService;
        this.tenantApiKeyService = tenantApiKeyService;
        this.configService = configService;
        this.logger = new common_1.Logger(PlaneIntegrationService_1.name);
    }
    /**
     * Configure Plane integration for the current tenant.
     * Finds or creates the base Integration record, auto-generates API credentials,
     * and stores all settings in the database.
     *
     * @param dto - The Plane UI URLs to configure
     * @param organizationId - Optional organization scope
     * @returns Integration tenant ID and the generated API credentials (plain text, shown once)
     */
    async setupIntegration(dto, organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId() ?? undefined;
        organizationId = organizationId ?? core_1.RequestContext.currentOrganizationId() ?? undefined;
        if (!tenantId) {
            throw new common_1.HttpException('Tenant context is required to configure a Plane integration.', common_1.HttpStatus.BAD_REQUEST);
        }
        // Check if a Plane integration already exists for this tenant
        const existing = await this.findIntegrationTenant(tenantId);
        if (existing) {
            throw new common_1.HttpException('Plane integration is already configured for this tenant. Use the update endpoint to modify settings.', common_1.HttpStatus.CONFLICT);
        }
        // Find or create the base Integration record
        const integration = await this.findOrCreateBaseIntegration();
        // Auto-generate API key and secret via TenantApiKeyService
        const apiKeyResponse = await this.tenantApiKeyService.generateApiKey({
            name: 'Plane Integration',
            tenantId
        });
        // Resolve mode (defaults to 'shared' when omitted) and the UI URLs to persist.
        // In shared mode we store the global hosted PM URLs so the proxy's per-tenant
        // CORS resolution keeps working; in custom mode we use the tenant-provided URLs.
        const mode = dto.mode === 'custom' ? 'custom' : 'shared';
        const webUrl = mode === 'custom' ? dto.planeWebUrl : SHARED_PLANE_WEB_URL;
        const adminUrl = mode === 'custom' ? dto.planeAdminUrl || '' : SHARED_PLANE_ADMIN_URL;
        const spaceUrl = mode === 'custom' ? dto.planeSpaceUrl || '' : SHARED_PLANE_SPACE_URL;
        // Build the integration settings array
        const settings = [
            { settingsName: plane_setting_enum_1.PlaneSettingName.PLANE_MODE, settingsValue: mode },
            { settingsName: plane_setting_enum_1.PlaneSettingName.PLANE_WEB_URL, settingsValue: webUrl },
            { settingsName: plane_setting_enum_1.PlaneSettingName.PLANE_ADMIN_URL, settingsValue: adminUrl },
            { settingsName: plane_setting_enum_1.PlaneSettingName.PLANE_SPACE_URL, settingsValue: spaceUrl },
            { settingsName: plane_setting_enum_1.PlaneSettingName.PLANE_API_KEY_VALUE, settingsValue: apiKeyResponse.apiKey },
            { settingsName: plane_setting_enum_1.PlaneSettingName.PLANE_API_SECRET_VALUE, settingsValue: apiKeyResponse.apiSecret },
            { settingsName: plane_setting_enum_1.PlaneSettingName.IS_ENABLED, settingsValue: 'true' }
        ];
        // Create the IntegrationTenant record with cascaded settings
        let integrationTenant;
        try {
            integrationTenant = await this.integrationTenantService.create({
                name: contracts_1.IntegrationEnum.PLANE,
                integration: integration ?? undefined,
                tenantId,
                organizationId,
                settings: settings
            });
        }
        catch (error) {
            // Rollback: delete the generated API key if tenant creation fails
            try {
                await this.tenantApiKeyService.delete({ apiKey: apiKeyResponse.apiKey });
            }
            catch (rollbackError) {
                this.logger.warn(`Failed to rollback API key after setup failure: ${rollbackError instanceof Error ? rollbackError.message : String(rollbackError)}`);
            }
            throw error;
        }
        this.logger.log(`Plane integration configured for tenant ${tenantId}`);
        return {
            integrationTenantId: integrationTenant.id,
            apiKey: apiKeyResponse.apiKey,
            apiSecret: apiKeyResponse.apiSecret
        };
    }
    /**
     * Retrieve the current Plane integration settings for the tenant.
     * API key and secret are NOT returned (security).
     */
    async getSettings(_organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId() ?? undefined;
        const integrationTenant = await this.findIntegrationTenantOrFail(tenantId);
        const settingsMap = this.buildSettingsMap(integrationTenant.settings || []);
        return {
            integrationTenantId: integrationTenant.id,
            mode: settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_MODE] === 'custom' ? 'custom' : 'shared',
            planeWebUrl: settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_WEB_URL] || '',
            planeAdminUrl: settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_ADMIN_URL] || '',
            planeSpaceUrl: settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_SPACE_URL] || '',
            isEnabled: settingsMap[plane_setting_enum_1.PlaneSettingName.IS_ENABLED] === 'true',
            hasApiKey: !!settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_API_KEY_VALUE]
        };
    }
    /**
     * Update Plane UI URLs for the current tenant.
     */
    async updateSettings(dto, organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId() ?? undefined;
        const integrationTenant = await this.findIntegrationTenantOrFail(tenantId);
        const existingSettings = integrationTenant.settings || [];
        // Build a map of setting name → setting object for easy update
        const settingsIndex = new Map();
        for (const s of existingSettings) {
            settingsIndex.set(s.settingsName, s);
        }
        // Build the set of settings to update. When the caller changes `mode` we must
        // persist PLANE_MODE and keep the URLs consistent with it (mirroring
        // setupIntegration): switching to 'shared' overwrites the URLs with the global
        // hosted PM constants; switching to 'custom' applies the tenant-provided URLs.
        // When `mode` is omitted we leave PLANE_MODE untouched and patch only the URLs
        // that were supplied.
        const updates = [];
        if (dto.mode !== undefined) {
            updates.push([plane_setting_enum_1.PlaneSettingName.PLANE_MODE, dto.mode]);
            if (dto.mode === 'shared') {
                updates.push([plane_setting_enum_1.PlaneSettingName.PLANE_WEB_URL, SHARED_PLANE_WEB_URL], [plane_setting_enum_1.PlaneSettingName.PLANE_ADMIN_URL, SHARED_PLANE_ADMIN_URL], [plane_setting_enum_1.PlaneSettingName.PLANE_SPACE_URL, SHARED_PLANE_SPACE_URL]);
            }
            else {
                // Switching to custom mode: UpdatePlaneSettingsDto is a PartialType, so a
                // bare `{ mode: 'custom' }` passes validation. Guard here so we never
                // persist mode='custom' while the URLs stay empty or on the shared hosted
                // defaults. Resolve the effective web/space URLs (from this request or
                // already stored) and reject the switch unless both are real tenant URLs.
                const effectiveWebUrl = dto.planeWebUrl ?? settingsIndex.get(plane_setting_enum_1.PlaneSettingName.PLANE_WEB_URL)?.settingsValue;
                const effectiveSpaceUrl = dto.planeSpaceUrl ?? settingsIndex.get(plane_setting_enum_1.PlaneSettingName.PLANE_SPACE_URL)?.settingsValue;
                if (!effectiveWebUrl ||
                    effectiveWebUrl === SHARED_PLANE_WEB_URL ||
                    !effectiveSpaceUrl ||
                    effectiveSpaceUrl === SHARED_PLANE_SPACE_URL) {
                    throw new common_1.HttpException('Switching to custom mode requires planeWebUrl and planeSpaceUrl.', common_1.HttpStatus.BAD_REQUEST);
                }
                if (dto.planeWebUrl !== undefined) {
                    updates.push([plane_setting_enum_1.PlaneSettingName.PLANE_WEB_URL, dto.planeWebUrl]);
                }
                if (dto.planeAdminUrl !== undefined) {
                    updates.push([plane_setting_enum_1.PlaneSettingName.PLANE_ADMIN_URL, dto.planeAdminUrl]);
                }
                if (dto.planeSpaceUrl !== undefined) {
                    updates.push([plane_setting_enum_1.PlaneSettingName.PLANE_SPACE_URL, dto.planeSpaceUrl]);
                }
            }
        }
        else {
            updates.push([plane_setting_enum_1.PlaneSettingName.PLANE_WEB_URL, dto.planeWebUrl], [plane_setting_enum_1.PlaneSettingName.PLANE_ADMIN_URL, dto.planeAdminUrl], [plane_setting_enum_1.PlaneSettingName.PLANE_SPACE_URL, dto.planeSpaceUrl]);
        }
        for (const [name, value] of updates) {
            if (value !== undefined) {
                const existing = settingsIndex.get(name);
                if (existing) {
                    existing.settingsValue = value;
                }
                else {
                    existingSettings.push({
                        settingsName: name,
                        settingsValue: value,
                        tenantId,
                        organizationId
                    });
                }
            }
        }
        integrationTenant.settings = existingSettings;
        await this.integrationTenantService.save(integrationTenant);
        this.logger.log(`Plane integration settings updated for tenant ${tenantId}`);
        return {
            integrationTenantId: integrationTenant.id,
            updated: true
        };
    }
    /**
     * Remove/archive Plane integration for the tenant.
     */
    async removeIntegration(integrationTenantId) {
        const tenantId = core_1.RequestContext.currentTenantId() ?? undefined;
        const integrationTenant = await this.findIntegrationTenantOrFail(tenantId);
        if (integrationTenant.id !== integrationTenantId) {
            throw new common_1.HttpException('Integration tenant ID mismatch.', common_1.HttpStatus.BAD_REQUEST);
        }
        // Revoke the API key before removing the integration.
        // Only tolerate "not found" (key already deleted); propagate real failures
        // so the integration is not archived with a live credential.
        const settings = integrationTenant.settings || [];
        const apiKeySetting = settings.find((s) => s.settingsName === plane_setting_enum_1.PlaneSettingName.PLANE_API_KEY_VALUE);
        if (apiKeySetting?.settingsValue) {
            try {
                await this.tenantApiKeyService.delete({ apiKey: apiKeySetting.settingsValue });
                this.logger.log(`API key revoked for tenant ${tenantId}`);
            }
            catch (error) {
                if (error instanceof common_1.HttpException && error.getStatus() === common_1.HttpStatus.NOT_FOUND) {
                    this.logger.warn(`API key already deleted for tenant ${tenantId}, proceeding with removal`);
                }
                else {
                    throw error;
                }
            }
        }
        // Soft-delete by marking as archived and inactive
        integrationTenant.isActive = false;
        integrationTenant.isArchived = true;
        // Disable the integration in settings
        const enabledSetting = settings.find((s) => s.settingsName === plane_setting_enum_1.PlaneSettingName.IS_ENABLED);
        if (enabledSetting) {
            enabledSetting.settingsValue = 'false';
        }
        await this.integrationTenantService.save(integrationTenant);
        this.logger.log(`Plane integration removed for tenant ${tenantId}`);
        return { success: true };
    }
    /**
     * Regenerate API key and secret for the Plane integration.
     * The old credentials become invalid.
     *
     * Flow: create new key → persist reference → delete old key.
     * We use TenantApiKeyService.create() directly because generateApiKey()
     * enforces a tenant-wide one-key limit. Creating first ensures the
     * integration is never left keyless if any step fails.
     */
    async regenerateApiKey(organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId() ?? undefined;
        const integrationTenant = await this.findIntegrationTenantOrFail(tenantId);
        const settings = integrationTenant.settings || [];
        const oldApiKeySetting = settings.find((s) => s.settingsName === plane_setting_enum_1.PlaneSettingName.PLANE_API_KEY_VALUE);
        const oldApiKeyValue = oldApiKeySetting?.settingsValue;
        // 1. Generate new credentials and create a TenantApiKey record first
        const apiKey = (0, utils_1.generatePassword)(32);
        const apiSecret = (0, utils_1.generatePassword)(64);
        const hashedApiSecret = (0, utils_1.generateSha256Hash)(apiSecret);
        const tenantApiKey = await this.tenantApiKeyService.create({
            name: 'Plane Integration',
            apiKey,
            apiSecret: hashedApiSecret
        });
        // 2. Update the settings to point to the new key and secret
        if (oldApiKeySetting) {
            oldApiKeySetting.settingsValue = tenantApiKey.apiKey;
        }
        else {
            settings.push({
                settingsName: plane_setting_enum_1.PlaneSettingName.PLANE_API_KEY_VALUE,
                settingsValue: tenantApiKey.apiKey,
                tenantId,
                organizationId
            });
        }
        const oldSecretSetting = settings.find((s) => s.settingsName === plane_setting_enum_1.PlaneSettingName.PLANE_API_SECRET_VALUE);
        if (oldSecretSetting) {
            oldSecretSetting.settingsValue = apiSecret;
        }
        else {
            settings.push({
                settingsName: plane_setting_enum_1.PlaneSettingName.PLANE_API_SECRET_VALUE,
                settingsValue: apiSecret,
                tenantId,
                organizationId
            });
        }
        // 3. Persist the new key reference
        integrationTenant.settings = settings;
        try {
            await this.integrationTenantService.save(integrationTenant);
        }
        catch (error) {
            // Save failed — delete the newly generated key to avoid orphans
            try {
                await this.tenantApiKeyService.delete({ apiKey: tenantApiKey.apiKey });
            }
            catch (rollbackError) {
                this.logger.warn(`Failed to rollback new API key after save failure: ${rollbackError instanceof Error ? rollbackError.message : String(rollbackError)}`);
            }
            throw error;
        }
        // 4. Only delete the old key after the new one is safely persisted
        if (oldApiKeyValue) {
            try {
                await this.tenantApiKeyService.delete({ apiKey: oldApiKeyValue });
            }
            catch (error) {
                if (error instanceof common_1.NotFoundException) {
                    this.logger.warn(`Old API key already deleted for tenant ${tenantId}`);
                }
                else {
                    this.logger.warn(`Failed to delete old API key during regeneration: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
        this.logger.log(`Plane integration API key regenerated for tenant ${tenantId}`);
        return {
            apiKey: tenantApiKey.apiKey,
            apiSecret // Return plain text secret (shown once)
        };
    }
    /**
     * Check if Plane integration is enabled for the current tenant.
     */
    async getStatus() {
        const tenantId = core_1.RequestContext.currentTenantId() ?? undefined;
        const integrationTenant = tenantId ? await this.findIntegrationTenant(tenantId) : null;
        if (!integrationTenant) {
            return { isEnabled: false, integrationTenantId: null };
        }
        const settingsMap = this.buildSettingsMap(integrationTenant.settings || []);
        return {
            isEnabled: !!integrationTenant.isActive && settingsMap[plane_setting_enum_1.PlaneSettingName.IS_ENABLED] === 'true',
            integrationTenantId: integrationTenant.id ?? null
        };
    }
    /**
     * Resolve the full Plane proxy configuration for a given tenant.
     * Used by PlaneProxyService for per-request config resolution.
     */
    async getConfigForTenant(tenantId) {
        const integrationTenant = await this.findIntegrationTenant(tenantId);
        if (!integrationTenant || !integrationTenant.isActive) {
            return null;
        }
        const settingsMap = this.buildSettingsMap(integrationTenant.settings || []);
        if (settingsMap[plane_setting_enum_1.PlaneSettingName.IS_ENABLED] !== 'true') {
            return null;
        }
        const apiKey = settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_API_KEY_VALUE] || '';
        const apiSecret = settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_API_SECRET_VALUE] || '';
        // The externalBaseApiUrl is the Gauzy API URL including the /api prefix
        const gauzyApiBaseUrl = this.configService.get('baseUrl') || 'http://localhost:3000';
        return {
            externalBaseApiUrl: `${gauzyApiBaseUrl}/api`,
            apiKey,
            apiSecret,
            clientBaseUrl: settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_WEB_URL] || '',
            clientAdminUrl: settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_ADMIN_URL] || '',
            clientSpaceUrl: settingsMap[plane_setting_enum_1.PlaneSettingName.PLANE_SPACE_URL] || ''
        };
    }
    /**
     * Find the Plane IntegrationTenant for the given tenant ID.
     */
    async findIntegrationTenant(tenantId) {
        if (!tenantId) {
            return null;
        }
        try {
            return await this.integrationTenantService.findOneByOptions({
                where: {
                    tenantId,
                    name: contracts_1.IntegrationEnum.PLANE,
                    isActive: true,
                    isArchived: false
                },
                relations: ['settings']
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return null;
            }
            throw error;
        }
    }
    /**
     * Find the Plane IntegrationTenant or throw a 404.
     */
    async findIntegrationTenantOrFail(tenantId) {
        const integrationTenant = await this.findIntegrationTenant(tenantId);
        if (!integrationTenant) {
            throw new common_1.HttpException('Plane integration is not configured for this tenant.', common_1.HttpStatus.NOT_FOUND);
        }
        return integrationTenant;
    }
    /**
     * Find or create the base Integration record for Plane.
     */
    async findOrCreateBaseIntegration() {
        try {
            const existing = await this.integrationService.findOneByOptions({
                where: { provider: 'Plane' }
            });
            if (existing) {
                return existing;
            }
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                throw error;
            }
        }
        return await this.integrationService.create({
            name: 'Plane',
            provider: 'Plane',
            imgSrc: 'integrations/plane.svg',
            isComingSoon: false,
            isPaid: false,
            redirectUrl: 'plane',
            order: 11
        });
    }
    /**
     * Build a key-value map from an array of IntegrationSettings.
     */
    buildSettingsMap(settings) {
        const map = {};
        for (const s of settings) {
            map[s.settingsName] = s.settingsValue;
        }
        return map;
    }
};
exports.PlaneIntegrationService = PlaneIntegrationService;
exports.PlaneIntegrationService = PlaneIntegrationService = PlaneIntegrationService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.IntegrationService,
        core_1.IntegrationTenantService,
        core_1.TenantApiKeyService,
        config_1.ConfigService])
], PlaneIntegrationService);
//# sourceMappingURL=plane-integration.service.js.map