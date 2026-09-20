"use strict";
var ActivepiecesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivepiecesController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const activepieces_service_1 = require("./activepieces.service");
const dto_1 = require("./dto");
let ActivepiecesController = ActivepiecesController_1 = class ActivepiecesController {
    constructor(activepiecesService) {
        this.activepiecesService = activepiecesService;
        this.logger = new common_1.Logger(ActivepiecesController_1.name);
    }
    /**
     * Set up ActivePieces integration with API key
     */
    async setupIntegration(input) {
        try {
            return await this.activepiecesService.setupIntegration(input.apiKey, input.organizationId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to set up ActivePieces integration', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to set up ActivePieces integration', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Create or update ActivePieces connection (upsert)
     */
    async upsertConnection(input) {
        try {
            return await this.activepiecesService.upsertConnection(input);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to upsert ActivePieces connection', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to upsert ActivePieces connection', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * List connections for a project
     */
    async listConnections(integrationId, params) {
        try {
            return await this.activepiecesService.listConnections(params, integrationId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to list ActivePieces connections', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to list ActivePieces connections', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get tenant connections
     */
    async getTenantConnections(integrationId, projectId) {
        try {
            return await this.activepiecesService.getTenantConnections(projectId, integrationId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to get tenant ActivePieces connections', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to get tenant ActivePieces connections', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get ActivePieces connection details
     */
    async getConnection(integrationId) {
        try {
            return await this.activepiecesService.getConnection(integrationId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to get ActivePieces connection: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Delete ActivePieces connection
     */
    async deleteConnection(integrationId) {
        try {
            const deleted = await this.activepiecesService.deleteConnection(integrationId);
            if (!deleted) {
                throw new common_1.HttpException('ActivePieces connection not found', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to delete ActivePieces connection: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Check if ActivePieces integration is enabled
     */
    async getIntegrationStatus(integrationId) {
        try {
            const enabled = await this.activepiecesService.isIntegrationEnabled(integrationId);
            return { enabled };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to get integration status: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Get integration tenant information
     */
    async getIntegrationTenant(integrationId) {
        try {
            return await this.activepiecesService.getIntegrationTenant(integrationId);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('Failed to get ActivePieces integration', { message: error?.message, stack: error?.stack });
            throw new common_1.HttpException('Failed to get ActivePieces integration tenant', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ActivepiecesController = ActivepiecesController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set up ActivePieces integration with API key' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully set up ActivePieces integration'
    }),
    (0, common_1.Post)('/setup'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.SetupActivepiecesIntegrationDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesController.prototype, "setupIntegration", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create or update ActivePieces connection' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Successfully created or updated ActivePieces connection'
    }),
    (0, common_1.Post)('/connection'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateActivepiecesIntegrationDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesController.prototype, "upsertConnection", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List ActivePieces connections for a project' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns list of ActivePieces connections'
    }),
    (0, common_1.Get)('/connections/:integrationId'),
    (0, swagger_1.ApiParam)({ name: 'integrationId', description: 'Integration UUID' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.ActivepiecesConnectionsListQueryDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesController.prototype, "listConnections", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get ActivePieces connections for current tenant' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns tenant ActivePieces connections'
    }),
    (0, common_1.Get)('/connections/tenant/:integrationId/:projectId'),
    (0, swagger_1.ApiParam)({ name: 'integrationId', description: 'Integration UUID' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'ActivePieces project ID' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('projectId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesController.prototype, "getTenantConnections", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get ActivePieces connection details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns ActivePieces connection details'
    }),
    (0, common_1.Get)('/connection/:integrationId'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesController.prototype, "getConnection", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete ActivePieces connection' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Successfully deleted ActivePieces connection'
    }),
    (0, common_1.Delete)('/connection/:integrationId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_DELETE),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesController.prototype, "deleteConnection", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if ActivePieces integration is enabled' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns integration status'
    }),
    (0, common_1.Get)('/status/:integrationId'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesController.prototype, "getIntegrationStatus", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get ActivePieces integration tenant information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns integration tenant information'
    }),
    (0, common_1.Get)('/integration-tenant/:integrationId'),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    tslib_1.__param(0, (0, common_1.Param)('integrationId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ActivepiecesController.prototype, "getIntegrationTenant", null);
exports.ActivepiecesController = ActivepiecesController = ActivepiecesController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('ActivePieces Integration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard),
    (0, common_1.Controller)('/integration/activepieces'),
    tslib_1.__metadata("design:paramtypes", [activepieces_service_1.ActivepiecesService])
], ActivepiecesController);
//# sourceMappingURL=activepieces.controller.js.map