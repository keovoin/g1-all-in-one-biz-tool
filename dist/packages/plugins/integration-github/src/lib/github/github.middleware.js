"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const utils_1 = require("@gauzy/utils");
let GithubMiddleware = class GithubMiddleware {
    constructor(cacheManager, _integrationTenantService) {
        this.cacheManager = cacheManager;
        this._integrationTenantService = _integrationTenantService;
        this.logging = true;
    }
    /**
     *
     * @param request
     * @param _response
     * @param next
     */
    async use(request, _response, next) {
        try {
            const integrationIdParam = request.params['integrationId'];
            // Handle case where integrationId could be string or string[]
            const integrationId = Array.isArray(integrationIdParam) ? integrationIdParam[0] : integrationIdParam;
            if (integrationId) {
                const queryParameters = request.query;
                const tenantId = queryParameters.tenantId?.toString() ?? request.header('Tenant-Id');
                const organizationId = queryParameters.organizationId?.toString() ?? request.header('Organization-Id');
                // Check if tenant and organization IDs are not empty
                if ((0, utils_1.isNotEmpty)(tenantId) && (0, utils_1.isNotEmpty)(organizationId)) {
                    try {
                        // Fetch integration settings from the service
                        if (this.logging) {
                            console.log(`Getting Gauzy integration settings from Cache for tenantId: ${tenantId}, organizationId: ${organizationId}, integrationId: ${integrationId}`);
                        }
                        const cacheKey = `integrationTenantSettings_${tenantId}_${organizationId}_${integrationId}`;
                        let integrationTenantSettings = await this.cacheManager.get(cacheKey);
                        if (!integrationTenantSettings) {
                            if (this.logging) {
                                console.log(`Gauzy integration settings NOT loaded from Cache for tenantId: ${tenantId}, organizationId: ${organizationId}, integrationId: ${integrationId}`);
                            }
                            const fromDb = await this._integrationTenantService.findOneByIdString(integrationId, {
                                where: {
                                    tenantId,
                                    organizationId,
                                    isActive: true,
                                    isArchived: false,
                                    integration: {
                                        isActive: true,
                                        isArchived: false
                                    }
                                },
                                relations: {
                                    settings: true
                                }
                            });
                            if (fromDb && fromDb.settings) {
                                integrationTenantSettings = fromDb.settings;
                                const ttl = 5 * 60 * 1000; // 5 min caching period for GitHub Integration Tenant Settings
                                await this.cacheManager.set(cacheKey, integrationTenantSettings, ttl);
                                if (this.logging) {
                                    console.log(`Gauzy integration settings loaded from DB and stored in Cache for tenantId: ${tenantId}, organizationId: ${organizationId}, integrationId: ${integrationId}`);
                                }
                            }
                        }
                        else {
                            if (this.logging) {
                                console.log(`Gauzy integration settings loaded from Cache for tenantId: ${tenantId}, organizationId: ${organizationId}, integrationId: ${integrationId}`);
                            }
                        }
                        if (integrationTenantSettings && integrationTenantSettings.length > 0) {
                            /** Create an 'integration' object and assign properties to it. */
                            request['integration'] = new Object({
                                // Assign properties to the integration object
                                id: integrationId,
                                name: contracts_1.IntegrationEnum.GITHUB,
                                // Convert the 'settings' array to an object using the 'settingsName' and 'settingsValue' properties
                                settings: (0, utils_1.arrayToObject)(integrationTenantSettings, 'settingsName', 'settingsValue')
                            });
                        }
                    }
                    catch (error) {
                        console.log(`Error while getting integration (${contracts_1.IntegrationEnum.GITHUB}) tenant inside middleware: %s`, error?.message);
                        console.log(request.path, request.url);
                    }
                }
            }
        }
        catch (error) {
            console.log(`Error while getting integration (${contracts_1.IntegrationEnum.GITHUB}) tenant inside middleware: %s`, error?.message);
            console.log(request.path, request.url);
        }
        // Continue to the next middleware or route handler
        next();
    }
};
exports.GithubMiddleware = GithubMiddleware;
exports.GithubMiddleware = GithubMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.IntegrationTenantService])
], GithubMiddleware);
//# sourceMappingURL=github.middleware.js.map