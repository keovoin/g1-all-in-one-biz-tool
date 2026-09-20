"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSettingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../../core/crud");
const decorators_1 = require("../../shared/decorators");
const pipes_1 = require("../../shared/pipes");
const guards_1 = require("../../shared/guards");
const tenant_setting_service_1 = require("./tenant-setting.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let TenantSettingController = class TenantSettingController extends crud_1.CrudController {
    constructor(tenantSettingService, commandBus) {
        super(tenantSettingService);
        this.tenantSettingService = tenantSettingService;
        this.commandBus = commandBus;
    }
    async getGlobalSettings() {
        return this.commandBus.execute(new commands_1.GlobalSettingGetCommand());
    }
    async getSettings() {
        return this.commandBus.execute(new commands_1.TenantSettingGetCommand());
    }
    async findById(id) {
        return this.tenantSettingService.findOneByIdString(id);
    }
    async saveSettings(entity) {
        return await this.commandBus.execute(new commands_1.TenantSettingSaveCommand(entity));
    }
    async saveDynamicSettings(entity) {
        return this.commandBus.execute(new commands_1.TenantSettingSaveCommand(entity));
    }
    async saveGlobalSettings(entity) {
        return this.commandBus.execute(new commands_1.GlobalSettingSaveCommand(entity));
    }
    async validateWasabiConfiguration(entity) {
        return await this.tenantSettingService.verifyWasabiConfiguration(entity);
    }
};
exports.TenantSettingController = TenantSettingController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get global settings (tenantId = NULL)'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Global settings retrieved successfully.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.GLOBAL_SETTING),
    (0, common_1.Get)('global'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TenantSettingController.prototype, "getGlobalSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get tenant settings'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Tenant settings retrieved successfully.'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TenantSettingController.prototype, "getSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find record by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Record retrieved successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TenantSettingController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Tenant settings create/updated successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Tenant settings create/updated successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateTenantSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TenantSettingController.prototype, "saveSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Save dynamic tenant settings',
        description: 'Creates or updates tenant settings with dynamic key-value pairs (e.g., monitoring settings).'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Dynamic settings saved successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/dynamic'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.DynamicSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TenantSettingController.prototype, "saveDynamicSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Save global settings (tenantId = NULL)',
        description: 'Creates or updates global settings that serve as defaults for all tenants.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Global settings saved successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.GLOBAL_SETTING),
    (0, common_1.Post)('/global'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.DynamicSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TenantSettingController.prototype, "saveGlobalSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Wasabi file storage configuration validator.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Wasabi file storage configuration validated successfully.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    (0, common_1.Post)('/wasabi/validate'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.WasabiS3ProviderConfigDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TenantSettingController.prototype, "validateWasabiConfiguration", null);
exports.TenantSettingController = TenantSettingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TenantSetting'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TENANT_SETTING),
    (0, common_1.Controller)('/tenant-setting'),
    tslib_1.__metadata("design:paramtypes", [tenant_setting_service_1.TenantSettingService, cqrs_1.CommandBus])
], TenantSettingController);
//# sourceMappingURL=tenant-setting.controller.js.map