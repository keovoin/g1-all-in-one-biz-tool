"use strict";
var MakeComMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeComMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const utils_1 = require("@gauzy/utils");
let MakeComMiddleware = MakeComMiddleware_1 = class MakeComMiddleware {
    constructor(cacheManager, _integrationTenantService) {
        this.cacheManager = cacheManager;
        this._integrationTenantService = _integrationTenantService;
        this.logger = new common_1.Logger(MakeComMiddleware_1.name);
    }
    /**
     * Middleware to handle Make.com integration requests
     * @param request - Express request object
     * @param _response - Express response object
     * @param next - Express next function
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
                        this.logger.log(`Make.com integration settings loading for tenantId: ${tenantId}, organizationId: ${organizationId}, integrationId: ${integrationId}`);
                        const cacheKey = `integrationTenantSettings_${tenantId}_${organizationId}_${integrationId}`;
                        let integrationTenantSettings = await this.cacheManager.get(cacheKey);
                        if (!integrationTenantSettings) {
                            this.logger.log(`Make.com integration settings NOT loaded from Cache for tenantId: ${tenantId}, organizationId: ${organizationId}, integrationId: ${integrationId}`);
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
                            if (fromDb?.settings?.length) {
                                integrationTenantSettings = fromDb.settings;
                                const ttl = 5 * 60; // 5 min expressed in seconds
                                await this.cacheManager.set(cacheKey, integrationTenantSettings, ttl);
                                this.logger.log(`Make.com integration settings loaded from DB for tenantId: ${tenantId}, organizationId: ${organizationId}, integrationId: ${integrationId}`);
                            }
                        }
                        else {
                            this.logger.log(`Make.com integration settings loaded from Cache for tenantId: ${tenantId}, organizationId: ${organizationId}, integrationId: ${integrationId}`);
                        }
                        if (integrationTenantSettings?.length) {
                            /** Create an 'integration' object and assign properties to it. */
                            request['integration'] = {
                                // Assign properties to the integration object
                                id: integrationId,
                                name: contracts_1.IntegrationEnum.MakeCom,
                                // Convert the 'settings' array to an object using the 'settingsName' and 'settingsValue' properties
                                settings: (0, utils_1.arrayToObject)(integrationTenantSettings, 'settingsName', 'settingsValue')
                            };
                        }
                        else {
                            return next(new common_1.NotFoundException('Make.com integration settings not found'));
                        }
                    }
                    catch (error) {
                        this.logger.error(`Error while getting integration (${contracts_1.IntegrationEnum.MakeCom}) tenant: %s`, error?.message);
                        this.logger.error(request.path, request.url);
                    }
                }
            }
        }
        catch (error) {
            this.logger.error(`Error while getting integration (${contracts_1.IntegrationEnum.MakeCom}) tenant inside middleware: %s`, error?.message);
            this.logger.error(request.path, request.url);
        }
        // Continue to the next middleware or route handler
        next();
    }
};
exports.MakeComMiddleware = MakeComMiddleware;
exports.MakeComMiddleware = MakeComMiddleware = MakeComMiddleware_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.IntegrationTenantService])
], MakeComMiddleware);
//# sourceMappingURL=make-com.middleware.js.map