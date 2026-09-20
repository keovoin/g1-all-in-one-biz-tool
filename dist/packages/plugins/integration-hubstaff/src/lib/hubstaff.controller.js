"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubstaffController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const hubstaff_service_1 = require("./hubstaff.service");
let HubstaffController = class HubstaffController {
    constructor(_hubstaffService) {
        this._hubstaffService = _hubstaffService;
    }
    /**
     * Get Hubstaff token by integration ID
     *
     * @param integrationId The ID of the integration
     * @returns Integration setting containing the Hubstaff token
     */
    async getHubstaffTokenByIntegration(integrationId) {
        return await this._hubstaffService.getHubstaffToken(integrationId);
    }
    /**
     * Refresh Hubstaff token by integration ID
     *
     * @param integrationId The ID of the integration
     * @returns An object carrying the refreshed `access_token` and its optional metadata
     * (`token_type`, `expires_in`, `scope`). The refresh token itself is rotated server-side and is
     * deliberately NOT part of the response.
     */
    async refreshHubstaffTokenByIntegration(integrationId) {
        return await this._hubstaffService.refreshToken(integrationId);
    }
    /**
     * Create a new Hubstaff integration
     *
     * @param body The input data for creating the integration
     * @returns The created integration tenant
     */
    async create(body) {
        return await this._hubstaffService.addIntegration(body);
    }
    /**
     * Get organizations from Hubstaff
     *
     * @param token The authentication token
     * @returns List of Hubstaff organizations
     */
    async getOrganizations(token) {
        return await this._hubstaffService.fetchOrganizations(token);
    }
    /**
     * Get projects for a specific organization from Hubstaff
     *
     * @param organizationId The ID of the organization
     * @param token The authentication token
     * @returns List of projects for the organization
     */
    async getProjects(organizationId, token) {
        return await this._hubstaffService.fetchOrganizationProjects({
            token,
            organizationId
        });
    }
    /**
     * Sync projects data with Hubstaff
     *
     * @param input The input data for syncing projects
     * @returns List of integration maps after syncing
     */
    async syncProjects(input) {
        return await this._hubstaffService.syncProjects(input);
    }
    /**
     * Sync organizations data with Hubstaff
     *
     * @param input The input data for syncing organizations
     * @returns List of integration maps after syncing
     */
    async syncOrganizations(input) {
        return await this._hubstaffService.syncOrganizations(input);
    }
    /**
     * Automatically sync data for an integration with Hubstaff
     *
     * @param integrationId The ID of the integration
     * @param body The input data for auto-sync
     * @returns Result of the auto-sync operation
     */
    async autoSync(integrationId, body) {
        return await this._hubstaffService.autoSync({
            ...body,
            integrationId
        });
    }
};
exports.HubstaffController = HubstaffController;
tslib_1.__decorate([
    (0, common_1.Get)('/token/:integrationId'),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HubstaffController.prototype, "getHubstaffTokenByIntegration", null);
tslib_1.__decorate([
    (0, common_1.Get)('/refresh-token/:integrationId'),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HubstaffController.prototype, "refreshHubstaffTokenByIntegration", null);
tslib_1.__decorate([
    (0, common_1.Post)('/integration'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HubstaffController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)('/organizations'),
    tslib_1.__param(0, (0, common_1.Query)('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HubstaffController.prototype, "getOrganizations", null);
tslib_1.__decorate([
    (0, common_1.Get)('/projects/:organizationId'),
    tslib_1.__param(0, (0, common_1.Param)('organizationId')),
    tslib_1.__param(1, (0, common_1.Query)('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], HubstaffController.prototype, "getProjects", null);
tslib_1.__decorate([
    (0, common_1.Post)('/sync-projects'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HubstaffController.prototype, "syncProjects", null);
tslib_1.__decorate([
    (0, common_1.Post)('/sync-organizations'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HubstaffController.prototype, "syncOrganizations", null);
tslib_1.__decorate([
    (0, common_1.Post)('/auto-sync/:integrationId'),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HubstaffController.prototype, "autoSync", null);
exports.HubstaffController = HubstaffController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Hubstaff Integrations'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration/hubstaff'),
    tslib_1.__metadata("design:paramtypes", [hubstaff_service_1.HubstaffService])
], HubstaffController);
//# sourceMappingURL=hubstaff.controller.js.map