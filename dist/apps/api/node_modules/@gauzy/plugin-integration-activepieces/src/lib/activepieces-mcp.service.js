"use strict";
var ActivepiecesMcpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivepiecesMcpService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const rxjs_1 = require("rxjs");
const core_1 = require("@gauzy/core");
const contracts_2 = require("@gauzy/contracts");
const activepieces_config_1 = require("./activepieces.config");
let ActivepiecesMcpService = ActivepiecesMcpService_1 = class ActivepiecesMcpService {
    constructor(httpService, configService, integrationTenantService) {
        this.httpService = httpService;
        this.configService = configService;
        this.integrationTenantService = integrationTenantService;
        this.logger = new common_1.Logger(ActivepiecesMcpService_1.name);
    }
    /**
     * List MCP servers for a project
     */
    async listMcpServers(params) {
        try {
            // Build query parameters
            const queryParams = {
                projectId: params.projectId
            };
            if (params.limit)
                queryParams['limit'] = params.limit.toString();
            if (params.cursor)
                queryParams['cursor'] = params.cursor;
            if (params.name)
                queryParams['name'] = params.name;
            return await this.request('get', activepieces_config_1.ACTIVEPIECES_MCP_SERVERS_URL, undefined, queryParams);
        }
        catch (error) {
            this.logger.error('Failed to list ActivePieces MCP servers:', error);
            throw new common_1.HttpException(`Failed to list ActivePieces MCP servers: ${error.message}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get MCP server by ID
     */
    async getMcpServer(serverId) {
        try {
            if (!serverId?.trim()) {
                throw new common_1.BadRequestException('serverId is required');
            }
            return await this.request('get', `${activepieces_config_1.ACTIVEPIECES_MCP_SERVERS_URL}/${encodeURIComponent(serverId)}`);
        }
        catch (error) {
            this.logger.error('Failed to get ActivePieces MCP server:', error);
            throw new common_1.HttpException(`Failed to get ActivePieces MCP server: ${error.message}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Update MCP server
     */
    async updateMcpServer(serverId, updateData) {
        try {
            const result = await this.request('post', `${activepieces_config_1.ACTIVEPIECES_MCP_SERVERS_URL}/${serverId}`, updateData);
            this.logger.log(`Successfully updated ActivePieces MCP server: ${result.id}`);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to update ActivePieces MCP server:', error);
            throw new common_1.BadRequestException(`Failed to update MCP server: ${error.message}`);
        }
    }
    /**
     * Rotate MCP server token
     */
    async rotateMcpServerToken(serverId) {
        try {
            const result = await this.request('post', `${activepieces_config_1.ACTIVEPIECES_MCP_SERVERS_URL}/${serverId}/rotate`, {} // No body required for rotate
            );
            this.logger.log(`Successfully rotated ActivePieces MCP server token: ${result.id}`);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to rotate ActivePieces MCP server token:', error);
            throw new common_1.BadRequestException(`Failed to rotate MCP server token: ${error.message}`);
        }
    }
    /**
     * Get MCP servers for current tenant
     */
    async getTenantMcpServers(projectId) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            const response = await this.listMcpServers({
                projectId
            });
            // Filter MCP servers by tenant (if they have tenant-specific naming or metadata)
            return response.data.filter((server) => server.name.includes(tenantId) || server.name.includes('gauzy'));
        }
        catch (error) {
            this.logger.error('Failed to get tenant MCP servers:', error);
            throw new common_1.HttpException(`Failed to get tenant MCP servers: ${error.message}`, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Helper method for making HTTP requests with standard headers and error handling
     */
    async request(method, url, data, params) {
        const apiKey = await this.getApiKey();
        const config = {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            ...(params && { params })
        };
        return (0, rxjs_1.firstValueFrom)(this.httpService
            .request({
            method,
            url,
            data,
            ...config,
            timeout: 8000
        })
            .pipe((0, rxjs_1.catchError)((error) => {
            const status = error?.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error?.message || 'Unknown error occurred';
            this.logger.error(`Error making ${method.toUpperCase()} ${url}`, {
                status,
                message
            });
            throw new common_1.HttpException(`HTTP ${method.toUpperCase()} request failed: ${message}`, status);
        }))).then((response) => response.data);
    }
    /**
     * Get API key for Activepieces API calls.
     * Looks for a tenant-specific API key in the database first, then falls back to global config.
     */
    async getApiKey() {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant ID not found in request context');
            }
            // 1. Try tenant-specific API key from database
            let integrationTenant = null;
            try {
                integrationTenant = await this.integrationTenantService.findOneByOptions({
                    where: {
                        tenantId,
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
            const apiKeySetting = integrationTenant?.settings?.find((setting) => setting.settingsName === contracts_2.ActivepiecesSettingName.API_KEY);
            if (apiKeySetting?.settingsValue) {
                return apiKeySetting.settingsValue;
            }
            // 2. Fallback to global config
            const globalApiKey = this.configService.get('activepieces')?.apiKey;
            if (globalApiKey) {
                return globalApiKey;
            }
            throw new common_1.BadRequestException('Activepieces API key not configured');
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to get Activepieces API key: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ActivepiecesMcpService = ActivepiecesMcpService;
exports.ActivepiecesMcpService = ActivepiecesMcpService = ActivepiecesMcpService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        core_1.IntegrationTenantService])
], ActivepiecesMcpService);
//# sourceMappingURL=activepieces-mcp.service.js.map