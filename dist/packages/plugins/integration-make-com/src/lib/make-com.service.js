"use strict";
var MakeComService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeComService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const contracts_1 = require("@gauzy/contracts");
const make_com_model_1 = require("./interfaces/make-com.model");
const cqrs_1 = require("@nestjs/cqrs");
let MakeComService = MakeComService_1 = class MakeComService {
    constructor(_commandBus, config, integrationSettingService, integrationTenantService, integrationService) {
        this._commandBus = _commandBus;
        this.config = config;
        this.integrationSettingService = integrationSettingService;
        this.integrationTenantService = integrationTenantService;
        this.integrationService = integrationService;
        this.logger = new common_1.Logger(MakeComService_1.name);
    }
    /**
     * Retrieves Make.com integration settings for the current tenant and organization.
     *
     * @param {string} [organizationId] - Optional organization ID to filter by organization level
     * @returns {Promise<IMakeComIntegrationSettings>} A promise that resolves to the Make.com integration settings.
     */
    async getIntegrationSettings(organizationId) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.NotFoundException('Tenant ID not found in request context');
            }
            // Build the where clause with tenant and optional organization filter
            const whereClause = {
                name: contracts_1.IntegrationEnum.MakeCom,
                tenantId
            };
            // If organizationId is provided, filter by organization level
            if (organizationId) {
                whereClause.organizationId = organizationId;
            }
            // Find the integration for the current tenant and organization
            const integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: whereClause,
                relations: ['settings']
            });
            if (!integrationTenant) {
                return {
                    isEnabled: false,
                    webhookUrl: null
                };
            }
            // Extract webhook settings from integration settings
            const enabledSetting = integrationTenant.settings.find((setting) => setting.settingsName === make_com_model_1.MakeSettingName.IS_ENABLED);
            const webhookUrlSetting = integrationTenant.settings.find((setting) => setting.settingsName === make_com_model_1.MakeSettingName.WEBHOOK_URL);
            return {
                isEnabled: enabledSetting ? enabledSetting.settingsValue === 'true' : false,
                webhookUrl: webhookUrlSetting ? webhookUrlSetting.settingsValue : null
            };
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                this.logger.error('Error retrieving Make.com integration settings:', error);
                throw error;
            }
        }
    }
    /**
     * Updates Make.com integration settings for the current tenant and organization.
     *
     * @param {Object} input - The settings to update.
     * @param {boolean} input.isEnabled - Whether the integration is enabled.
     * @param {string} input.webhookUrl - The webhook URL for Make.com.
     * @param {string} [organizationId] - Optional organization ID to filter by organization level
     * @returns {Promise<IMakeComIntegrationSettings>} A promise that resolves to the updated settings.
     */
    async updateIntegrationSettings(input, organizationId) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.NotFoundException('Tenant ID not found in request context');
            }
            // Build the where clause with tenant and optional organization filter
            const whereClause = {
                name: contracts_1.IntegrationEnum.MakeCom,
                tenantId
            };
            // If organizationId is provided, filter by organization level
            if (organizationId) {
                whereClause.organizationId = organizationId;
            }
            // Find the integration for the current tenant and organization
            const integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: whereClause,
                relations: ['settings']
            });
            if (!integrationTenant) {
                throw new common_1.NotFoundException(`${contracts_1.IntegrationEnum.MakeCom} integration not found for this tenant${organizationId ? ' and organization' : ''}`);
            }
            const updates = [];
            // Update isEnabled setting if provided
            if (input.isEnabled !== undefined) {
                let enabledSetting = integrationTenant.settings.find((setting) => setting.settingsName === make_com_model_1.MakeSettingName.IS_ENABLED);
                if (enabledSetting) {
                    enabledSetting.settingsValue = input.isEnabled.toString();
                }
                else {
                    enabledSetting = {
                        settingsName: make_com_model_1.MakeSettingName.IS_ENABLED,
                        settingsValue: input.isEnabled.toString(),
                        integration: integrationTenant
                    };
                }
                updates.push(this.integrationSettingService.save(enabledSetting));
            }
            // Update webhookUrl setting if provided
            if (input.webhookUrl !== undefined) {
                let webhookUrlSetting = integrationTenant.settings.find((setting) => setting.settingsName === make_com_model_1.MakeSettingName.WEBHOOK_URL);
                if (webhookUrlSetting) {
                    webhookUrlSetting.settingsValue = input.webhookUrl;
                }
                else {
                    webhookUrlSetting = {
                        settingsName: make_com_model_1.MakeSettingName.WEBHOOK_URL,
                        settingsValue: input.webhookUrl,
                        integration: integrationTenant
                    };
                }
                updates.push(this.integrationSettingService.save(webhookUrlSetting));
            }
            // Wait for all updates to complete
            await Promise.all(updates);
            // Return the updated settings with organization context
            return this.getIntegrationSettings(organizationId);
        }
        catch (error) {
            this.logger.error('Error updating Make.com integration settings:', error);
            throw error;
        }
    }
    /**
     * Add Make.com integration settings for the current tenant and organization.
     * Client credentials (client_id, client_secret) are read from server-side
     * environment variables and are never exposed to tenants.
     *
     * @param {string} [organizationId] - Optional organization ID for organization-level integration
     * @returns The created integration tenant.
     */
    async addIntegrationSettings(organizationId) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.NotFoundException('Tenant ID not found in request context');
            }
            // Validate that server-side OAuth credentials are configured (do NOT persist them to tenant)
            const makeComConfig = this.config?.get('makeCom');
            if (!makeComConfig?.clientId || !makeComConfig?.clientSecret) {
                throw new common_1.InternalServerErrorException('Make.com OAuth credentials are not configured on the server. Please set GAUZY_MAKE_CLIENT_ID and GAUZY_MAKE_CLIENT_SECRET environment variables.');
            }
            // Find or create the base integration
            let integration = await this.integrationService.findOneByOptions({
                where: { provider: contracts_1.IntegrationEnum.MakeCom }
            });
            if (!integration) {
                integration = await this.integrationService.create({
                    name: contracts_1.IntegrationEnum.MakeCom,
                    provider: contracts_1.IntegrationEnum.MakeCom
                });
            }
            // Map project-tied entities with organization and tenant IDs.
            const tiedEntities = core_1.PROJECT_TIED_ENTITIES.map((entity) => ({
                ...entity,
                organizationId,
                tenantId
            }));
            const entitySettings = core_1.DEFAULT_ENTITY_SETTINGS.map((settingEntity) => {
                if (settingEntity.entity === contracts_1.IntegrationEntity.PROJECT) {
                    return {
                        ...settingEntity,
                        tiedEntities
                    };
                }
                return {
                    ...settingEntity,
                    organizationId,
                    tenantId
                };
            });
            return await this._commandBus.execute(new core_1.IntegrationTenantUpdateOrCreateCommand({
                name: contracts_1.IntegrationEnum.MakeCom,
                integration: { provider: contracts_1.IntegrationEnum.MakeCom },
                tenantId,
                organizationId
            }, {
                name: contracts_1.IntegrationEnum.MakeCom,
                integration,
                organizationId,
                tenantId,
                entitySettings: entitySettings,
                settings: [
                    {
                        // Automatically enable the integration when it's created
                        settingsName: make_com_model_1.MakeSettingName.IS_ENABLED,
                        settingsValue: 'true'
                    }
                ].map((setting) => ({
                    ...setting,
                    tenantId,
                    organizationId
                }))
            }));
        }
        catch (error) {
            this.logger.error('Error adding Make.com integration settings:', error);
            throw error;
        }
    }
    /**
     * Retrieves the OAuth client ID for the Make.com integration from server-side config.
     *
     * @returns {Promise<string | null>} A promise that resolves to the OAuth client ID or null if not configured.
     */
    async getOAuthClientId() {
        const makeComConfig = this.config?.get('makeCom');
        return makeComConfig?.clientId ?? null;
    }
};
exports.MakeComService = MakeComService;
exports.MakeComService = MakeComService = MakeComService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        config_1.ConfigService,
        core_1.IntegrationSettingService,
        core_1.IntegrationTenantService,
        core_1.IntegrationService])
], MakeComService);
//# sourceMappingURL=make-com.service.js.map