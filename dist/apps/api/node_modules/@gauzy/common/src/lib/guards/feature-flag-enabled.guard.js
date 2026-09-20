"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlagEnabledGuard = exports.flagFeatures = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const constants_1 = require("@gauzy/constants");
const contracts_1 = require("@gauzy/contracts");
/**
 * Check if a specific feature is enabled based on the environment variable.
 *
 * @param feature - The feature key to check.
 * @returns True if the feature is enabled, otherwise false.
 */
const featureEnabled = (feature) => {
    return process.env[feature] !== 'false';
};
/**
 * Object containing flag features for authentication.
 */
exports.flagFeatures = {
    /** Flag indicating whether email/password login is enabled. */
    FEATURE_EMAIL_PASSWORD_LOGIN: featureEnabled(contracts_1.FeatureEnum.FEATURE_EMAIL_PASSWORD_LOGIN),
    /** Flag indicating whether magic login is enabled. */
    FEATURE_MAGIC_LOGIN: featureEnabled(contracts_1.FeatureEnum.FEATURE_MAGIC_LOGIN),
    /** Flag indicating whether GitHub login is enabled. */
    FEATURE_GITHUB_LOGIN: featureEnabled(contracts_1.FeatureEnum.FEATURE_GITHUB_LOGIN),
    /** Flag indicating whether Facebook login is enabled. */
    FEATURE_FACEBOOK_LOGIN: featureEnabled(contracts_1.FeatureEnum.FEATURE_FACEBOOK_LOGIN),
    /** Flag indicating whether Google login is enabled. */
    FEATURE_GOOGLE_LOGIN: featureEnabled(contracts_1.FeatureEnum.FEATURE_GOOGLE_LOGIN),
    /** Flag indicating whether Twitter login is enabled. */
    FEATURE_TWITTER_LOGIN: featureEnabled(contracts_1.FeatureEnum.FEATURE_TWITTER_LOGIN),
    /** Flag indicating whether Microsoft login is enabled. */
    FEATURE_MICROSOFT_LOGIN: featureEnabled(contracts_1.FeatureEnum.FEATURE_MICROSOFT_LOGIN),
    /** Flag indicating whether LinkedIn login is enabled. */
    FEATURE_LINKEDIN_LOGIN: featureEnabled(contracts_1.FeatureEnum.FEATURE_LINKEDIN_LOGIN)
};
/**
 * Feature enabled/disabled guard
 *
 * @returns
 */
let FeatureFlagEnabledGuard = class FeatureFlagEnabledGuard {
    constructor(_reflector) {
        this._reflector = _reflector;
    }
    /**
     *
     * @param context
     * @returns
     */
    async canActivate(context) {
        /*
         * Retrieve metadata for a specified key for a specified set of features
         */
        const flag = this._reflector.getAllAndOverride(constants_1.FEATURE_METADATA, [
            context.getHandler(), // Returns a reference to the handler (method) that will be invoked next in the request pipeline.
            context.getClass() // Returns the *type* of the controller class which the current handler belongs to.
        ]);
        if (!!exports.flagFeatures[flag]) {
            return true;
        }
        /**
         * If the feature is not enabled, throw a NotFoundException.
         */
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        throw new common_1.NotFoundException(`Cannot ${request.method} ${request.url}`);
    }
};
exports.FeatureFlagEnabledGuard = FeatureFlagEnabledGuard;
exports.FeatureFlagEnabledGuard = FeatureFlagEnabledGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], FeatureFlagEnabledGuard);
//# sourceMappingURL=feature-flag-enabled.guard.js.map