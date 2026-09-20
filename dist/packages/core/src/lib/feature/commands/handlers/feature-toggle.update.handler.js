"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureToggleUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const feature_organization_service_1 = require("../../../feature/feature-organization.service");
const feature_toggle_update_command_1 = require("../feature-toggle.update.command");
let FeatureToggleUpdateHandler = class FeatureToggleUpdateHandler {
    constructor(_featureOrganizationService) {
        this._featureOrganizationService = _featureOrganizationService;
    }
    async execute(command) {
        const { input } = command;
        return await this._featureOrganizationService.updateFeatureOrganization(input);
    }
};
exports.FeatureToggleUpdateHandler = FeatureToggleUpdateHandler;
exports.FeatureToggleUpdateHandler = FeatureToggleUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(feature_toggle_update_command_1.FeatureToggleUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [feature_organization_service_1.FeatureOrganizationService])
], FeatureToggleUpdateHandler);
//# sourceMappingURL=feature-toggle.update.handler.js.map