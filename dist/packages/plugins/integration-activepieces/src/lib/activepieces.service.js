"use strict";
var ActivepiecesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivepiecesService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@gauzy/config");
const rxjs_1 = require("rxjs");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const contracts_2 = require("@gauzy/contracts");
const activepieces_config_1 = require("./activepieces.config");
let ActivepiecesService = ActivepiecesService_1 = class ActivepiecesService {
    constructor(httpService, configService, integrationService, integrationTenantService) {
        this.httpService = httpService;
        this.configService = configService;
        this.integrationService = integrationService;
        this.integrationTenantService = integrationTenantService;
        this.logger = new common_1.Logger(ActivepiecesService_1.name);
    }
    /**
     * Set up the ActivePieces integration by saving the API key.
     * Finds or creates the ACTIVE_PIECES integration record and creates an integration tenant
     * with API_KEY and IS_ENABLED settings.
     */
    async setupIntegration(apiKey, organizationId) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            // Find or create the integration
            let integration = null;
            try {
                integration = await this.integrationService.findOneByOptions({
                    where: { provider: contracts_1.IntegrationEnum.ACTIVE_PIECES }
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            if (!integration) {
                integration = await this.integrationService.create({
                    provider: contracts_1.IntegrationEnum.ACTIVE_PIECES,
                    name: contracts_1.IntegrationEnum.ACTIVE_PIECES
                });
            }
            // Define the settings to save
            const settings = [
                {
                    settingsName: contracts_2.ActivepiecesSettingName.API_KEY,
                    settingsValue: apiKey,
                    tenantId,
                    organizationId
                },
                {
                    settingsName: contracts_2.ActivepiecesSettingName.IS_ENABLED,
                    settingsValue: JSON.stringify(true),
                    tenantId,
                    organizationId
                }
            ];
            // Look up an existing integration tenant for this tenant/org
            let existingTenant = null;
            try {
                existingTenant = await this.integrationTenantService.findOneByOptions({
                    where: {
                        tenantId,
                        ...(organizationId ? { organizationId } : {}),
                        integration: { provider: contracts_1.IntegrationEnum.ACTIVE_PIECES }
                    },
                    relations: ['settings']
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            let integrationTenantId;
            if (existingTenant?.id) {
                // Update existing tenant's settings by merging/replacing API_KEY and IS_ENABLED
                const existingSettings = existingTenant.settings ?? [];
                const settingsByName = new Map(settings.map((s) => [s.settingsName, s]));
                // Update existing rows in-place (preserve their database id) and track which were updated
                const updatedNames = new Set();
                const mergedSettings = existingSettings.map((existing) => {
                    const update = settingsByName.get(existing.settingsName);
                    if (update) {
                        updatedNames.add(existing.settingsName);
                        return { ...existing, settingsValue: update.settingsValue };
                    }
                    return existing;
                });
                // Append truly new settings that had no pre-existing row
                for (const [name, setting] of settingsByName) {
                    if (!updatedNames.has(name)) {
                        mergedSettings.push(setting);
                    }
                }
                await this.integrationTenantService.save({
                    ...existingTenant,
                    settings: mergedSettings
                });
                integrationTenantId = existingTenant.id;
            }
            else {
                // Create a new integration tenant
                const integrationTenant = await this.integrationTenantService.create({
                    name: contracts_1.IntegrationEnum.ACTIVE_PIECES,
                    integration,
                    tenantId,
                    organizationId,
                    settings
                });
                if (!integrationTenant.id) {
                    throw new common_1.BadRequestException('Failed to create integration tenant: missing ID');
                }
                integrationTenantId = integrationTenant.id;
            }
            this.logger.log(`Successfully set up ActivePieces integration for tenant ${tenantId}. ` +
                `Integration tenant ID: ${integrationTenantId}`);
            return { integrationTenantId };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to set up ActivePieces integration:', error);
            throw new common_1.InternalServerErrorException('Failed to set up ActivePieces integration');
        }
    }
    /**
     * Create or update ActivePieces connection for the tenant (using upsert endpoint)
     */
    async upsertConnection(input) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            const organizationId = input.organizationId;
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            // Create external ID for the connection (unique identifier for this tenant)
            const externalId = `gauzy-tenant-${tenantId}${organizationId ? `-org-${organizationId}` : ''}`;
            // Create display name for the connection
            const displayName = input.connectionName || `Ever Gauzy - ${tenantId}`;
            // Prepare the connection request for ActivePieces (upsert format with SECRET_TEXT)
            const connectionRequest = {
                externalId,
                displayName,
                pieceName: activepieces_config_1.ACTIVEPIECES_PIECE_NAME,
                projectId: input.projectId,
                metadata: {
                    tenantId,
                    organizationId: organizationId || 'default',
                    createdAt: new Date().toISOString(),
                    gauzyVersion: '1.0.0'
                },
                type: contracts_2.ActivepiecesConnectionType.SECRET_TEXT,
                value: {
                    type: contracts_2.ActivepiecesConnectionType.SECRET_TEXT,
                    secret_text: input.accessToken
                }
            };
            // Get API key for Activepieces API calls
            let existingIntegrationTenant = null;
            try {
                existingIntegrationTenant = await this.integrationTenantService.findOneByOptions({
                    where: {
                        tenantId,
                        integration: { provider: contracts_1.IntegrationEnum.ACTIVE_PIECES }
                    }
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            if (!existingIntegrationTenant) {
                this.logger.warn(`No integration tenant found for tenant ${tenantId}. ` +
                    'setupIntegration was likely not run; falling back to global GAUZY_ACTIVEPIECES_API_KEY env variable.');
            }
            const apiKey = await this.getApiKey(existingIntegrationTenant?.id);
            // Make the API call to create the connection
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService
                .post(activepieces_config_1.ACTIVEPIECES_CONNECTIONS_URL, connectionRequest, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                const status = error?.response?.status;
                const data = error?.response?.data;
                const errorMessage = data?.error?.message || error.message;
                this.logger.error('Error creating ActivePieces connection:', data);
                if (status === common_1.HttpStatus.UNAUTHORIZED) {
                    return (0, rxjs_1.throwError)(() => new common_1.UnauthorizedException(data?.error?.message ??
                        `Unauthorized to create ActivePieces connection: ${error.message}`));
                }
                // Optionally wrap and throw a more descriptive internal server error
                return (0, rxjs_1.throwError)(() => new common_1.InternalServerErrorException(`Failed to create ActivePieces connection: ${errorMessage}`));
            })));
            // Save the connection details to the database
            const integrationTenant = await this.saveConnectionSettings(response.data, input.accessToken, tenantId, organizationId);
            this.logger.log(`ActivePieces connection Successfully upsert: ${response.data.id}. ` +
                `Integration tenant: ${integrationTenant.id}`);
            // Return both the connection data and the integration tenant ID
            return {
                ...response.data,
                integrationId: integrationTenant.id
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to upsert ActivePieces connection:', error);
            throw new common_1.InternalServerErrorException(`Failed to upsert connection: ${error.message}`);
        }
    }
    /**
     * List ActivePieces connections for a project
     */
    async listConnections(params, integrationId) {
        try {
            // We need an integration ID to get the access token
            if (!integrationId) {
                throw new common_1.BadRequestException('Integration ID is required to list connections');
            }
            const apiKey = await this.getApiKey(integrationId);
            // Build query parameters
            const queryParams = new URLSearchParams();
            queryParams.append('projectId', params.projectId);
            if (params.cursor)
                queryParams.append('cursor', params.cursor);
            if (params.scope)
                queryParams.append('scope', params.scope);
            if (params.pieceName)
                queryParams.append('pieceName', params.pieceName);
            if (params.displayName)
                queryParams.append('displayName', params.displayName);
            if (params.status)
                queryParams.append('status', params.status);
            if (params.limit)
                queryParams.append('limit', params.limit.toString());
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService
                .get(`${activepieces_config_1.ACTIVEPIECES_CONNECTIONS_URL}?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error('Error listing ActivePieces connections:', error.response?.data);
                throw new common_1.HttpException(`Failed to list ActivePieces connections: ${error.message}`, error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to list ActivePieces connections:', error);
            throw new common_1.HttpException(`Failed to list ActivePieces connections: ${error.message}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get connections for current tenant
     */
    async getTenantConnections(projectId, integrationId) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            const response = await this.listConnections({
                projectId,
                pieceName: activepieces_config_1.ACTIVEPIECES_PIECE_NAME,
                scope: contracts_2.ActivepiecesConnectionScope.PROJECT
            }, integrationId);
            // Filter connections by tenant metadata
            return response.data.filter((connection) => connection.metadata?.['tenantId'] === tenantId);
        }
        catch (error) {
            this.logger.error('Failed to get tenant connections:', error);
            throw new common_1.HttpException(`Failed to get tenant connections: ${error.message}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get ActivePieces connection by integration tenant ID
     */
    async getConnection(integrationTenantId) {
        try {
            // Get integration tenant with settings
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            let integrationTenant = null;
            try {
                integrationTenant = await this.integrationTenantService.findOneByOptions({
                    where: { id: integrationTenantId, tenantId },
                    relations: ['settings']
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            if (!integrationTenant) {
                return null;
            }
            // Find connection ID setting
            const connectionIdSetting = integrationTenant.settings?.find((s) => s.settingsName === contracts_2.ActivepiecesSettingName.CONNECTION_ID);
            if (!connectionIdSetting?.settingsValue) {
                return null;
            }
            const apiKey = await this.getApiKey(integrationTenantId);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService
                .get(`${activepieces_config_1.ACTIVEPIECES_CONNECTIONS_URL}/${connectionIdSetting.settingsValue}`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error('Error fetching ActivePieces connection:', error.response?.data);
                throw new common_1.HttpException(`Failed to fetch ActivePieces connection: ${error.message}`, error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to get ActivePieces connection:', error);
            throw new common_1.HttpException(`Failed to get ActivePieces connection: ${error.message}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Delete ActivePieces connection
     */
    async deleteConnection(integrationTenantId) {
        try {
            // Get integration tenant with settings
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            let integrationTenant = null;
            try {
                integrationTenant = await this.integrationTenantService.findOneByOptions({
                    where: { id: integrationTenantId, tenantId },
                    relations: ['settings']
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            if (!integrationTenant) {
                this.logger.warn(`Integration tenant not found: ${integrationTenantId}`);
                return false;
            }
            // Find connection ID setting
            const connectionIdSetting = integrationTenant.settings?.find((s) => s.settingsName === contracts_2.ActivepiecesSettingName.CONNECTION_ID);
            if (!connectionIdSetting?.settingsValue) {
                this.logger.warn(`No connection ID found for integration tenant: ${integrationTenantId}`);
                return false;
            }
            const apiKey = await this.getApiKey(integrationTenantId);
            await (0, rxjs_1.firstValueFrom)(this.httpService
                .delete(`${activepieces_config_1.ACTIVEPIECES_CONNECTIONS_URL}/${connectionIdSetting.settingsValue}`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error('Error deleting ActivePieces connection:', error.response?.data);
                throw new common_1.HttpException(`Failed to delete ActivePieces connection: ${error.message}`, error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            this.logger.log(`Successfully deleted ActivePieces connection: ${connectionIdSetting.settingsValue}`);
            return true;
        }
        catch (error) {
            this.logger.error('Failed to delete ActivePieces connection:', error);
            throw new common_1.HttpException(`Failed to delete Activepieces connection: ${error.message}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get API key for Activepieces API calls.
     * Looks for a tenant-specific API key in the database first, then falls back to global config.
     * @param integrationTenantId - The integration tenant ID (not the base integration ID)
     */
    async getApiKey(integrationTenantId) {
        try {
            // 1. Try tenant-specific API key from database
            if (integrationTenantId) {
                const tenantId = core_1.RequestContext.currentTenantId();
                if (!tenantId) {
                    throw new common_1.BadRequestException('Tenant ID not found in request context');
                }
                let integrationTenant = null;
                try {
                    integrationTenant = await this.integrationTenantService.findOneByOptions({
                        where: { id: integrationTenantId, tenantId },
                        relations: ['settings']
                    });
                }
                catch (error) {
                    if (!(error instanceof common_1.NotFoundException)) {
                        throw error;
                    }
                }
                const apiKeySetting = integrationTenant?.settings?.find((s) => s.settingsName === contracts_2.ActivepiecesSettingName.API_KEY);
                if (apiKeySetting?.settingsValue) {
                    return apiKeySetting.settingsValue;
                }
            }
            // 2. Fallback to global config
            const globalApiKey = this.configService.get('activepieces')?.apiKey;
            if (globalApiKey) {
                return globalApiKey;
            }
            throw new common_1.InternalServerErrorException('Activepieces API key is not configured. Set GAUZY_ACTIVEPIECES_API_KEY or run setupIntegration first.');
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to get Activepieces API key: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get project IDs for an integration tenant
     */
    async getProjectIds(integrationTenantId) {
        try {
            // Get integration tenant with settings
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            let integrationTenant = null;
            try {
                integrationTenant = await this.integrationTenantService.findOneByOptions({
                    where: { id: integrationTenantId, tenantId },
                    relations: ['settings']
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            if (!integrationTenant) {
                return [];
            }
            // Find project ID setting
            const projectIdSetting = integrationTenant.settings?.find((s) => s.settingsName === contracts_2.ActivepiecesSettingName.PROJECT_ID);
            if (!projectIdSetting?.settingsValue) {
                return [];
            }
            try {
                return JSON.parse(projectIdSetting.settingsValue);
            }
            catch (error) {
                // Handle case where it might be a single project ID stored as string
                return [projectIdSetting.settingsValue];
            }
        }
        catch (error) {
            this.logger.error('Failed to get project IDs:', error);
            return [];
        }
    }
    /**
     * Check if ActivePieces integration is enabled
     */
    async isIntegrationEnabled(integrationTenantId) {
        try {
            // Get integration tenant with settings
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            let integrationTenant = null;
            try {
                integrationTenant = await this.integrationTenantService.findOneByOptions({
                    where: { id: integrationTenantId, tenantId },
                    relations: ['settings']
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            if (!integrationTenant) {
                return false;
            }
            // Find enabled setting
            const enabledSetting = integrationTenant.settings?.find((s) => s.settingsName === contracts_2.ActivepiecesSettingName.IS_ENABLED);
            if (typeof enabledSetting?.settingsValue === 'boolean') {
                return enabledSetting.settingsValue;
            }
            return !!(typeof enabledSetting?.settingsValue === 'string'
                ? JSON.parse(enabledSetting.settingsValue)
                : enabledSetting?.settingsValue);
        }
        catch (error) {
            this.logger.error('Error checking if integration is enabled:', error);
            return false;
        }
    }
    /**
     * Get integration tenant information
     */
    async getIntegrationTenant(integrationId) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            return await this.integrationTenantService.findOneByOptions({
                where: {
                    tenantId,
                    integration: { id: integrationId }
                },
                relations: ['integration', 'settings']
            });
        }
        catch (error) {
            this.logger.error('Failed to get integration tenant:', error);
            throw new common_1.HttpException(`Failed to get integration tenant: ${error.message}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Save connection settings to the database
     */
    async saveConnectionSettings(connection, accessToken, tenantId, organizationId) {
        try {
            // Find or create the integration
            let integration = null;
            try {
                integration = await this.integrationService.findOneByOptions({
                    where: { provider: contracts_1.IntegrationEnum.ACTIVE_PIECES }
                });
            }
            catch (error) {
                if (!(error instanceof common_1.NotFoundException)) {
                    throw error;
                }
            }
            if (!integration) {
                integration = await this.integrationService.create({
                    provider: contracts_1.IntegrationEnum.ACTIVE_PIECES,
                    name: contracts_1.IntegrationEnum.ACTIVE_PIECES
                });
            }
            // Define the settings to save
            const settings = [
                {
                    settingsName: contracts_2.ActivepiecesSettingName.ACCESS_TOKEN,
                    settingsValue: accessToken,
                    tenantId,
                    organizationId
                },
                {
                    settingsName: contracts_2.ActivepiecesSettingName.CONNECTION_ID,
                    settingsValue: connection.id,
                    tenantId,
                    organizationId
                },
                {
                    settingsName: contracts_2.ActivepiecesSettingName.PROJECT_ID,
                    settingsValue: JSON.stringify(connection.projectIds), // Serialize array to string
                    tenantId,
                    organizationId
                },
                {
                    settingsName: contracts_2.ActivepiecesSettingName.IS_ENABLED,
                    settingsValue: JSON.stringify(true),
                    tenantId,
                    organizationId
                }
            ];
            // Create or update integration tenant
            const integrationTenant = await this.integrationTenantService.create({
                name: contracts_1.IntegrationEnum.ACTIVE_PIECES,
                integration,
                tenantId,
                organizationId,
                settings
            });
            this.logger.log(`Successfully saved ActivePieces connection settings for tenant ${tenantId}. ` +
                `Integration tenant ID: ${integrationTenant.id}, ` +
                `Connection ID: ${connection.id}`);
            // Return the integration tenant for potential future use
            return integrationTenant;
        }
        catch (error) {
            this.logger.error('Failed to save ActivePieces connection settings:', error);
            throw new common_1.BadRequestException(`Failed to save connection settings: ${error.message}`);
        }
    }
};
exports.ActivepiecesService = ActivepiecesService;
exports.ActivepiecesService = ActivepiecesService = ActivepiecesService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        core_1.IntegrationService,
        core_1.IntegrationTenantService])
], ActivepiecesService);
//# sourceMappingURL=activepieces.service.js.map