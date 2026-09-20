"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureToggleController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const unleash_client_1 = require("unleash-client");
const contracts_1 = require("@gauzy/contracts");
const common_2 = require("@gauzy/common");
const config_1 = require("@gauzy/config");
const feature_entity_1 = require("./feature.entity");
const feature_service_1 = require("./feature.service");
const feature_organization_service_1 = require("./feature-organization.service");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const dto_1 = require("./../shared/dto");
const pipes_1 = require("../shared/pipes");
const commands_1 = require("./commands");
const dto_2 = require("./dto");
const feature_organization_query_dto_1 = require("./dto/feature-organization-query.dto");
const { unleashConfig } = config_1.environment;
let FeatureToggleController = class FeatureToggleController {
    constructor(_featureService, _featureOrganizationService, _commandBus) {
        this._featureService = _featureService;
        this._featureOrganizationService = _featureOrganizationService;
        this._commandBus = _commandBus;
    }
    async getFeatureToggleDefinitions() {
        let featureToggles = [];
        // load toggles definitions from Unleash if it's enabled
        if (unleashConfig.url) {
            featureToggles = (0, unleash_client_1.getFeatureToggleDefinitions)();
            // only support gauzy feature and removed other
            const featureEnums = Object.values(contracts_1.FeatureEnum);
            if (featureToggles) {
                featureToggles = featureToggles.filter((toggle) => featureEnums.includes(toggle.name));
            }
        }
        return featureToggles;
    }
    async getParentFeatureList(options) {
        try {
            return await this._featureService.getParentFeatures(options.relations);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getFeaturesOrganization(params) {
        try {
            return await this._featureOrganizationService.findAll({
                where: {
                    ...(params.tenantId
                        ? {
                            tenantId: params.tenantId
                        }
                        : {}),
                    ...(params.organizationId
                        ? {
                            organizationId: params.organizationId
                        }
                        : {})
                },
                relations: params.relations || []
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async findAll() {
        try {
            return await this._featureService.findAll();
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async enabledDisabledFeature(input) {
        return await this._commandBus.execute(new commands_1.FeatureToggleUpdateCommand(input));
    }
};
exports.FeatureToggleController = FeatureToggleController;
tslib_1.__decorate([
    (0, common_1.Get)('/definition'),
    (0, common_2.Public)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FeatureToggleController.prototype, "getFeatureToggleDefinitions", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all parent features.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found feature',
        type: feature_entity_1.Feature
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW),
    (0, common_1.Get)('/parent'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.RelationsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], FeatureToggleController.prototype, "getParentFeatureList", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all feature organizations.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found feature',
        type: feature_entity_1.Feature
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW),
    (0, common_1.Get)('/organizations'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [feature_organization_query_dto_1.FeatureOrganizationQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], FeatureToggleController.prototype, "getFeaturesOrganization", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all features.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found feature',
        type: feature_entity_1.Feature
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW),
    (0, common_1.Get)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FeatureToggleController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Enabled or disabled features' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created/updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_2.CreateFeatureToggleDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], FeatureToggleController.prototype, "enabledDisabledFeature", null);
exports.FeatureToggleController = FeatureToggleController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Feature'),
    (0, common_1.Controller)('/feature/toggle'),
    tslib_1.__metadata("design:paramtypes", [feature_service_1.FeatureService,
        feature_organization_service_1.FeatureOrganizationService,
        cqrs_1.CommandBus])
], FeatureToggleController);
//# sourceMappingURL=feature-toggle.controller.js.map