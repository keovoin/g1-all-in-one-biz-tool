"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantFeatureOrganizationCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const feature_organization_service_1 = require("./../../../feature/feature-organization.service");
const tenant_feature_organization_create_command_1 = require("../tenant-feature-organization.create.command");
let TenantFeatureOrganizationCreateHandler = class TenantFeatureOrganizationCreateHandler {
    constructor(_featureOrganizationService) {
        this._featureOrganizationService = _featureOrganizationService;
    }
    /**
     * Executes the TenantFeatureOrganizationCreateCommand. This method takes the command,
     * extracts the necessary input data, and passes it to the _featureOrganizationService
     * for processing. The service is responsible for creating or updating feature organizations
     * for tenants based on the provided input.
     *
     * @param command An instance of TenantFeatureOrganizationCreateCommand containing tenant and feature organization data.
     * @returns A Promise that resolves to an array of IFeatureOrganization, representing the updated or created feature organizations.
     */
    async execute(command) {
        const { input } = command;
        return await this._featureOrganizationService.updateTenantFeatureOrganizations(input);
    }
};
exports.TenantFeatureOrganizationCreateHandler = TenantFeatureOrganizationCreateHandler;
exports.TenantFeatureOrganizationCreateHandler = TenantFeatureOrganizationCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tenant_feature_organization_create_command_1.TenantFeatureOrganizationCreateCommand),
    tslib_1.__param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => feature_organization_service_1.FeatureOrganizationService))),
    tslib_1.__metadata("design:paramtypes", [feature_organization_service_1.FeatureOrganizationService])
], TenantFeatureOrganizationCreateHandler);
//# sourceMappingURL=tenant-feature-organization.create.handler.js.map