"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSettingsMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const jwt = require("jsonwebtoken");
const tenant_setting_service_1 = require("./tenant-setting.service");
let TenantSettingsMiddleware = class TenantSettingsMiddleware {
    constructor(cacheManager, tenantSettingService) {
        this.cacheManager = cacheManager;
        this.tenantSettingService = tenantSettingService;
        this.logging = false;
    }
    /**
     * Middleware to retrieve and cache tenant settings based on the JWT token in the request headers.
     *
     * @param {Request} _request - The incoming HTTP request object.
     * @param {Response} _response - The outgoing HTTP response object.
     * @param {NextFunction} next - The next middleware function to call.
     *
     * @returns {Promise<void>} - Proceeds to the next middleware after attaching tenant settings to the request.
     *
     * @throws {Error} - Logs errors if tenant settings retrieval fails.
     */
    async use(_request, _response, next) {
        try {
            const authHeader = _request.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                // Decode JWT token
                const decodedToken = jwt.decode(token);
                let tenantSettings = {};
                if (decodedToken && decodedToken.tenantId) {
                    const tenantId = decodedToken.tenantId;
                    if (this.logging) {
                        console.log('Getting Tenant settings from Cache for tenantId: %s', tenantId);
                    }
                    const cacheKey = `tenantSettings_${tenantId}`;
                    // Attempt to fetch from cache
                    tenantSettings = await this.cacheManager.get(cacheKey);
                    if (!tenantSettings) {
                        if (this.logging) {
                            console.log('Tenant settings NOT loaded from Cache for tenantId: %s', tenantId);
                        }
                        // Fetch tenant settings from DB
                        tenantSettings = await this.tenantSettingService.getSettings({
                            where: { tenantId }
                        });
                        if (tenantSettings) {
                            const ttl = 5 * 60 * 1000; // Cache TTL: 5 minutes
                            await this.cacheManager.set(cacheKey, tenantSettings, ttl);
                            if (this.logging) {
                                console.log('Tenant settings loaded from DB and stored in Cache for tenantId: %s', tenantId);
                            }
                        }
                    }
                    else {
                        if (this.logging) {
                            console.log('Tenant settings loaded from Cache for tenantId: %s', tenantId);
                        }
                    }
                    // Load resolved settings (Global DB + Tenant DB cascade)
                    const resolvedSettings = await this.loadResolvedSettings(tenantId);
                    if (resolvedSettings) {
                        _request['resolvedSettings'] = resolvedSettings;
                    }
                }
                if (tenantSettings) {
                    // Attach tenant settings to request
                    _request['tenantSettings'] = tenantSettings;
                }
            }
        }
        catch (error) {
            console.error('Error while getting Tenant settings: %s', error?.message);
            console.error(_request.path, _request.url);
        }
        next();
    }
    /**
     * Loads resolved settings with cascade: Global DB (tenantId=NULL) → Tenant DB.
     */
    async loadResolvedSettings(tenantId) {
        const cacheKey = `resolvedSettings_${tenantId}`;
        let settings = await this.cacheManager.get(cacheKey);
        if (!settings) {
            const globalSettings = await this.tenantSettingService.getGlobalSettings();
            const tenantSettings = await this.tenantSettingService.getSettings({ where: { tenantId } });
            settings = { ...globalSettings, ...tenantSettings };
            if (Object.keys(settings).length > 0) {
                await this.cacheManager.set(cacheKey, settings, 5 * 60 * 1000);
            }
        }
        return Object.keys(settings).length > 0 ? settings : null;
    }
};
exports.TenantSettingsMiddleware = TenantSettingsMiddleware;
exports.TenantSettingsMiddleware = TenantSettingsMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, tenant_setting_service_1.TenantSettingService])
], TenantSettingsMiddleware);
//# sourceMappingURL=tenant-settings.middleware.js.map