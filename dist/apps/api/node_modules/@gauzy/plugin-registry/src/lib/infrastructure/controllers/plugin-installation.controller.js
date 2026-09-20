"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginInstallationController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const core_2 = require("../../core");
const shared_1 = require("../../shared");
let PluginInstallationController = class PluginInstallationController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async create(id, body) {
        return this.commandBus.execute(new application_1.InstallPluginCommand(id, body));
    }
    async remove(pluginId, installationId) {
        await this.commandBus.execute(new application_1.UninstallPluginCommand(pluginId, installationId));
        return { message: 'Plugin installation removed successfully', statusCode: common_1.HttpStatus.NO_CONTENT };
    }
};
exports.PluginInstallationController = PluginInstallationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Install a plugin with a specific version',
        description: 'Creates a new plugin installation for the current tenant. Requires a valid subscription for the plugin.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'pluginId',
        description: 'Unique identifier of the plugin',
        type: String,
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Plugin installation created successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Valid subscription required or insufficient permissions'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid plugin ID or version ID'
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    (0, common_1.UseGuards)(core_2.PluginSubscriptionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_INSTALL),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.InstallPluginDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginInstallationController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Uninstall a plugin',
        description: 'Removes a plugin installation by ID'
    }),
    (0, swagger_1.ApiParam)({
        name: 'pluginId',
        description: 'Unique identifier of the plugin',
        type: String,
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, swagger_1.ApiParam)({
        name: 'installationId',
        description: 'Unique identifier of the plugin installation',
        type: String,
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Plugin installation removed successfully'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_UNINSTALL),
    (0, common_1.Delete)(':installationId'),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('installationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginInstallationController.prototype, "remove", null);
exports.PluginInstallationController = PluginInstallationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Installation'),
    (0, common_1.Controller)('/plugins/:pluginId/installations'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], PluginInstallationController);
//# sourceMappingURL=plugin-installation.controller.js.map