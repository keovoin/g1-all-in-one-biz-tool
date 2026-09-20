"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@gauzy/config");
const constants_1 = require("@gauzy/constants");
let StatsGuard = class StatsGuard {
    constructor(_reflector) {
        this._reflector = _reflector;
        this.loggingEnabled = false;
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
        const featureFlag = this._reflector.getAllAndOverride(constants_1.FEATURE_METADATA, targets);
        // Check if the feature is enabled
        if (featureFlag) {
            // Check if the feature is enabled
            const isEnabled = !!config_1.gauzyToggleFeatures[featureFlag];
            if (this.loggingEnabled) {
                // Log the feature flag and its status
                console.log(`Guard: FeatureFlag ${featureFlag} is ${isEnabled ? 'enabled' : 'disabled'}`);
            }
            // If the feature is enabled, proceed with the request
            if (isEnabled) {
                return true;
            }
        }
        // If the feature is not enabled, throw a NotFoundException
        const { method, url } = context.switchToHttp().getRequest();
        throw new common_1.NotFoundException(`Cannot ${method} ${url}`);
    }
};
exports.StatsGuard = StatsGuard;
exports.StatsGuard = StatsGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], StatsGuard);
//# sourceMappingURL=stats.guard.js.map