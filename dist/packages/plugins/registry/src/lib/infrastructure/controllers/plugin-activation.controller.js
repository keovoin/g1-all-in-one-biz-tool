"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginActivationController = exports.UpdateInstallationStatusDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const application_1 = require("../../application");
const core_2 = require("../../core");
var InstallationStatus;
(function (InstallationStatus) {
    InstallationStatus["ACTIVE"] = "active";
    InstallationStatus["INACTIVE"] = "inactive";
})(InstallationStatus || (InstallationStatus = {}));
// DTO for status update
class UpdateInstallationStatusDTO {
}
exports.UpdateInstallationStatusDTO = UpdateInstallationStatusDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: InstallationStatus }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(InstallationStatus, { message: 'Invalid installation status' }),
    tslib_1.__metadata("design:type", String)
], UpdateInstallationStatusDTO.prototype, "status", void 0);
let PluginActivationController = class PluginActivationController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async updateStatus(pluginId, installationId, { status }) {
        switch (status) {
            case InstallationStatus.ACTIVE:
                return this.commandBus.execute(new application_1.ActivatePluginCommand(pluginId, installationId));
            case InstallationStatus.INACTIVE:
                return this.commandBus.execute(new application_1.DeactivatePluginCommand(installationId));
            default:
                throw new common_1.BadRequestException(`Invalid status value ${status}`);
        }
    }
};
exports.PluginActivationController = PluginActivationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update plugin installation status',
        description: 'Activate or deactivate a plugin installation by updating its status'
    }),
    (0, swagger_1.ApiParam)({
        name: 'pluginId',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin',
        required: true
    }),
    (0, swagger_1.ApiParam)({
        name: 'installationId',
        type: String,
        format: 'uuid',
        description: 'UUID of the plugin installation',
        required: true
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['active', 'inactive'],
                    description: 'New status for the installation'
                }
            },
            required: ['status']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: contracts_1.HttpStatus.OK, description: 'Plugin installation status updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: contracts_1.HttpStatus.NOT_FOUND, description: 'Plugin installation not found.' }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to modify this plugin installation.'
    }),
    (0, swagger_1.ApiResponse)({ status: contracts_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' }),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.UseGuards)(core_2.PluginSubscriptionAccessGuard),
    (0, common_1.Patch)(':installationId'),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('installationId', core_1.UUIDValidationPipe)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, UpdateInstallationStatusDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginActivationController.prototype, "updateStatus", null);
exports.PluginActivationController = PluginActivationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Installation Management'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiSecurity)('api_key'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('/plugins/:pluginId/installations'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], PluginActivationController);
//# sourceMappingURL=plugin-activation.controller.js.map