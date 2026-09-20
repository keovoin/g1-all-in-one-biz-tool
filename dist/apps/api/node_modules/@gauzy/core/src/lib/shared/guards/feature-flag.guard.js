"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlagGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
const constants_1 = require("@gauzy/constants");
const feature_service_1 = require("./../../feature/feature.service");
/**
 * Feature enabled/disabled guard
 *
 * @returns
 */
let FeatureFlagGuard = class FeatureFlagGuard {
    constructor(cacheManager, _reflector, featureFlagService) {
        this.cacheManager = cacheManager;
        this._reflector = _reflector;
        this.featureFlagService = featureFlagService;
    }
    /**
     * Determines if the current request can be activated based on feature flag metadata.
     * @param context The execution context of the request.
     * @returns A boolean indicating whether access is allowed.
     */
    async canActivate(context) {
        // Retrieve permissions from metadata
        const targets = [
            context.getHandler(), // Returns a reference to the handler (method) that will be invoked next in the request pipeline.
            context.getClass() // Returns the *type* of the controller class which the current handler belongs to.
        ];
        // Retrieve metadata for a specified key for a specified set of features
        const flag = this._reflector.getAllAndOverride(constants_1.FEATURE_METADATA, targets);
        console.log('Guard: FeatureFlag checking', flag);
        const cacheKey = `featureFlag_${flag}`;
        const fromCache = await this.cacheManager.get(cacheKey);
        let isEnabled;
        if (fromCache == null) {
            isEnabled = await this.featureFlagService.isFeatureEnabled(flag);
            await this.cacheManager.set(cacheKey, isEnabled);
        }
        else {
            isEnabled = fromCache;
        }
        // Check if the feature is enabled
        if (isEnabled) {
            console.log(`Guard: FeatureFlag ${flag} enabled`);
            return true;
        }
        // If the feature is not enabled, throw a NotFoundException
        const { method, url } = context.switchToHttp().getRequest();
        throw new common_1.NotFoundException(`Cannot ${method} ${url}`);
    }
};
exports.FeatureFlagGuard = FeatureFlagGuard;
exports.FeatureFlagGuard = FeatureFlagGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.Reflector,
        feature_service_1.FeatureService])
], FeatureFlagGuard);
//# sourceMappingURL=feature-flag.guard.js.map