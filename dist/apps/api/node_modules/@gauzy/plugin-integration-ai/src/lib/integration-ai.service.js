"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationAIService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const core_1 = require("@gauzy/core");
const gauzy_ai_service_1 = require("./gauzy-ai.service");
const request_config_provider_1 = require("./request-config.provider");
const integration_ai_entity_settings_1 = require("./integration-ai-entity-settings");
let IntegrationAIService = class IntegrationAIService {
    constructor(_commandBus, _requestConfigProvider, _gauzyAIService, _integrationService, _integrationTenantService) {
        this._commandBus = _commandBus;
        this._requestConfigProvider = _requestConfigProvider;
        this._gauzyAIService = _gauzyAIService;
        this._integrationService = _integrationService;
        this._integrationTenantService = _integrationTenantService;
        this.logger = new common_1.Logger('IntegrationAIService');
    }
    /**
     * Creates a new integration tenant for Gauzy AI.
     * @param input - The input data for creating the integration tenant.
     * @returns A promise that resolves to the created integration tenant.
     */
    async create(input) {
        try {
            // Destructure input data
            const { apiKey, apiSecret, openAiSecretKey, openAiOrganizationId } = input;
            // Get the current tenant and organization IDs
            const tenantId = core_1.RequestContext.currentTenantId() || input.tenantId;
            const { organizationId } = input;
            // Retrieve Gauzy AI integration from the database
            const integration = await this._integrationService.findOneByWhereOptions({
                provider: contracts_1.IntegrationEnum.GAUZY_AI,
                isActive: true,
                isArchived: false
            });
            // Generate entity settings for the integration tenant
            const entitySettings = integration_ai_entity_settings_1.DEFAULT_ENTITY_SETTINGS.map((setting) => ({
                ...setting,
                organizationId,
                tenantId
            }));
            // Execute the command to create/update the integration tenant settings
            const createdIntegration = await this._commandBus.execute(new core_1.IntegrationTenantUpdateOrCreateCommand({
                name: contracts_1.IntegrationEnum.GAUZY_AI,
                integration: { provider: contracts_1.IntegrationEnum.GAUZY_AI },
                tenantId,
                organizationId
            }, {
                name: contracts_1.IntegrationEnum.GAUZY_AI,
                integration,
                organizationId,
                tenantId,
                entitySettings,
                settings: [
                    {
                        settingsName: 'apiKey',
                        settingsValue: apiKey
                    },
                    {
                        settingsName: 'apiSecret',
                        settingsValue: apiSecret
                    },
                    ...((0, utils_1.isNotEmpty)(openAiSecretKey)
                        ? [
                            {
                                settingsName: 'openAiSecretKey',
                                settingsValue: openAiSecretKey
                            }
                        ]
                        : []),
                    ...((0, utils_1.isNotEmpty)(openAiOrganizationId)
                        ? [
                            {
                                settingsName: 'openAiOrganizationId',
                                settingsValue: openAiOrganizationId
                            }
                        ]
                        : [])
                ].map((setting) => ({
                    ...setting,
                    tenantId,
                    organizationId
                }))
            }));
            // Calling the updateOneTenantApiKey method with the input object
            await this.updateOneTenantApiKey({
                apiKey,
                apiSecret,
                ...((0, utils_1.isNotEmpty)(openAiSecretKey) && { openAiSecretKey }),
                ...((0, utils_1.isNotEmpty)(openAiOrganizationId) && { openAiOrganizationId })
            });
            // Return the created integration tenant
            return createdIntegration;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Error while creating Gauzy AI integration', error.message);
            throw new common_1.HttpException(`Error while creating Gauzy AI integration: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Updates an integration tenant by ID with the provided input.
     *
     * @param {IIntegrationTenant['id']} integrationId - The ID of the integration tenant to update.
     * @returns {Promise<IIntegrationTenant>} - A promise resolving to the updated integration tenant.
     */
    async update(integrationId, input) {
        try {
            // Retrieve Gauzy AI integration from the database
            const integration = await this._integrationTenantService.findOneByIdString(integrationId, {
                relations: { settings: true }
            });
            // Extract settings from the retrieved integration
            const { apiKey, apiSecret, openAiSecretKey, openAiOrganizationId } = (0, utils_1.arrayToObject)(integration.settings, 'settingsName', 'settingsValue');
            // Check if apiKey exists before calling updateOneTenantApiKey
            if (apiKey) {
                // Calling the updateOneTenantApiKey method with the input object
                await this.updateOneTenantApiKey({
                    apiKey,
                    apiSecret,
                    ...((0, utils_1.isNotEmpty)(openAiSecretKey) && { openAiSecretKey }),
                    ...((0, utils_1.isNotEmpty)(openAiOrganizationId) && { openAiOrganizationId })
                });
            }
            // Return the updated integration
            return integration;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Error while updating Gauzy AI integration', error.message);
            throw new common_1.HttpException(`Error while updating Gauzy AI integration: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Updates a tenant's API key by configuring the necessary parameters,
     * triggering the update in the Gauzy AI service, and handling any potential errors in a robust manner.
     */
    async updateOneTenantApiKey({ apiKey, apiSecret, openAiSecretKey, openAiOrganizationId }) {
        try {
            // Set configuration in the requestConfigProvider
            this._requestConfigProvider.setConfig({
                apiKey,
                apiSecret,
                ...((0, utils_1.isNotEmpty)(openAiSecretKey) && { openAiSecretKey }),
                ...((0, utils_1.isNotEmpty)(openAiOrganizationId) && { openAiOrganizationId })
            });
            // Update Gauzy AI service with the new API key
            await this._gauzyAIService.updateOneTenantApiKey({
                apiKey,
                apiSecret,
                openAiSecretKey,
                openAiOrganizationId
            });
            // Reset configuration in the requestConfigProvider
            this._requestConfigProvider.resetConfig();
        }
        catch (error) {
            // Log any errors that occur during the update process
            console.log(`Error while updating Tenant Api Key: %s`, error?.message);
        }
    }
};
exports.IntegrationAIService = IntegrationAIService;
exports.IntegrationAIService = IntegrationAIService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        request_config_provider_1.RequestConfigProvider,
        gauzy_ai_service_1.GauzyAIService,
        core_1.IntegrationService,
        core_1.IntegrationTenantService])
], IntegrationAIService);
//# sourceMappingURL=integration-ai.service.js.map