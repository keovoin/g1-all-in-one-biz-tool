"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaneController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const plane_integration_service_1 = require("./plane-integration.service");
const configure_plane_integration_dto_1 = require("./dto/configure-plane-integration.dto");
const update_plane_settings_dto_1 = require("./dto/update-plane-settings.dto");
let PlaneController = class PlaneController {
    constructor(planeIntegrationService) {
        this.planeIntegrationService = planeIntegrationService;
    }
    /**
     * Configure Plane integration for the current tenant.
     * Auto-generates API key and secret.
     */
    async setupIntegration(dto, organizationId) {
        return await this.planeIntegrationService.setupIntegration(dto, organizationId);
    }
    /**
     * Get current Plane integration settings for the tenant.
     * Does NOT return API key or secret.
     */
    async getSettings(organizationId) {
        return await this.planeIntegrationService.getSettings(organizationId);
    }
    /**
     * Update Plane UI URLs for the current tenant.
     */
    async updateSettings(dto, organizationId) {
        return await this.planeIntegrationService.updateSettings(dto, organizationId);
    }
    /**
     * Remove/archive Plane integration for the tenant.
     */
    async removeIntegration(integrationTenantId) {
        return await this.planeIntegrationService.removeIntegration(integrationTenantId);
    }
    /**
     * Regenerate API key and secret for the Plane integration.
     */
    async regenerateApiKey(organizationId) {
        return await this.planeIntegrationService.regenerateApiKey(organizationId);
    }
    /**
     * Check if Plane integration is enabled for the current tenant.
     */
    async getStatus() {
        return await this.planeIntegrationService.getStatus();
    }
};
exports.PlaneController = PlaneController;
tslib_1.__decorate([
    (0, common_1.Post)('/setup'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD),
    (0, core_1.UseValidationPipe)(),
    (0, swagger_1.ApiOperation)({ summary: 'Configure Plane integration for the current tenant.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Plane integration configured successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Plane integration already configured.' }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [configure_plane_integration_dto_1.ConfigurePlaneIntegrationDto, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PlaneController.prototype, "setupIntegration", null);
tslib_1.__decorate([
    (0, common_1.Get)('/settings'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Get Plane integration settings for the current tenant.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plane integration not configured.' }),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PlaneController.prototype, "getSettings", null);
tslib_1.__decorate([
    (0, common_1.Put)('/settings'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, core_1.UseValidationPipe)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update Plane integration settings.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plane integration not configured.' }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [update_plane_settings_dto_1.UpdatePlaneSettingsDto, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PlaneController.prototype, "updateSettings", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/:integrationTenantId'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_DELETE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove Plane integration for the current tenant.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration removed successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plane integration not configured.' }),
    tslib_1.__param(0, (0, common_1.Param)('integrationTenantId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PlaneController.prototype, "removeIntegration", null);
tslib_1.__decorate([
    (0, common_1.Post)('/regenerate-key'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Regenerate Plane integration API key and secret.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'API key regenerated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plane integration not configured.' }),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PlaneController.prototype, "regenerateApiKey", null);
tslib_1.__decorate([
    (0, common_1.Get)('/status'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, swagger_1.ApiOperation)({ summary: 'Check Plane integration status for the current tenant.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status retrieved successfully.' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PlaneController.prototype, "getStatus", null);
exports.PlaneController = PlaneController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plane Integration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('/integration/plane'),
    tslib_1.__metadata("design:paramtypes", [plane_integration_service_1.PlaneIntegrationService])
], PlaneController);
//# sourceMappingURL=plane.controller.js.map