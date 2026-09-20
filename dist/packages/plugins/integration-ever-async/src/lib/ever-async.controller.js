"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverAsyncController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const ever_async_integration_service_1 = require("./ever-async-integration.service");
const dto_1 = require("./dto");
let EverAsyncController = class EverAsyncController {
    constructor(service) {
        this.service = service;
    }
    setupIntegration(dto, organizationId) {
        return this.service.setupIntegration(dto, organizationId);
    }
    getSettings(organizationId) {
        return this.service.getSettings(organizationId);
    }
    getOptions(organizationId) {
        return this.service.getOptions(organizationId);
    }
    updateSettings(dto, organizationId) {
        return this.service.updateSettings(dto, organizationId);
    }
    rotateCredentials(organizationId) {
        return this.service.rotateCredentials(organizationId);
    }
    verifyConnection(dto) {
        return this.service.verifyConnection(dto.serverUrl);
    }
    getStatus(organizationId) {
        return this.service.getStatus(organizationId);
    }
    removeIntegration(integrationTenantId, organizationId) {
        return this.service.removeIntegration(integrationTenantId, organizationId);
    }
};
exports.EverAsyncController = EverAsyncController;
tslib_1.__decorate([
    (0, common_1.Post)('/setup'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD),
    (0, core_1.UseValidationPipe)(),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'Connect Ever Async and return its read-only credential once.' }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ConfigureEverAsyncIntegrationDto, String]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncController.prototype, "setupIntegration", null);
tslib_1.__decorate([
    (0, common_1.Get)('/settings'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncController.prototype, "getSettings", null);
tslib_1.__decorate([
    (0, common_1.Get)('/options'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncController.prototype, "getOptions", null);
tslib_1.__decorate([
    (0, common_1.Put)('/settings'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, core_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.UpdateEverAsyncSettingsDto, String]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncController.prototype, "updateSettings", null);
tslib_1.__decorate([
    (0, common_1.Post)('/credentials/rotate'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncController.prototype, "rotateCredentials", null);
tslib_1.__decorate([
    (0, common_1.Post)('/verify'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, core_1.UseValidationPipe)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check server reachability. This does not install or authenticate a chat integration.' }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.VerifyEverAsyncConnectionDto]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncController.prototype, "verifyConnection", null);
tslib_1.__decorate([
    (0, common_1.Get)('/status'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncController.prototype, "getStatus", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/:integrationTenantId'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Param)('integrationTenantId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], EverAsyncController.prototype, "removeIntegration", null);
exports.EverAsyncController = EverAsyncController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Ever Async Integration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('/integration/ever-async'),
    tslib_1.__metadata("design:paramtypes", [ever_async_integration_service_1.EverAsyncIntegrationService])
], EverAsyncController);
//# sourceMappingURL=ever-async.controller.js.map