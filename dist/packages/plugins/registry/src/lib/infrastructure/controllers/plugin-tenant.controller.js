"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTenantController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const commands_1 = require("../../application/plugin-tenant/commands");
const queries_1 = require("../../application/plugin-tenant/queries");
const dto_1 = require("../../shared/dto");
let PluginTenantController = class PluginTenantController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Create a new plugin tenant relationship
     */
    async create(createDto) {
        return this.commandBus.execute(new commands_1.CreatePluginTenantCommand(createDto));
    }
    /**
     * Get all plugin tenants with optional filtering
     */
    async findAll(query) {
        return this.queryBus.execute(new queries_1.GetAllPluginTenantsQuery(query));
    }
    /**
     * Get plugin tenant statistics
     */
    async getStatistics(tenantId, organizationId) {
        return this.queryBus.execute(new queries_1.GetPluginTenantStatisticsQuery(tenantId, organizationId));
    }
    /**
     * Get plugin tenants by plugin ID
     */
    async findByPlugin(pluginId, skip, take) {
        return this.queryBus.execute(new queries_1.GetPluginTenantsByPluginQuery(pluginId, skip, take));
    }
    /**
     * Get plugin tenants by tenant ID
     */
    async findByTenant(tenantId, organizationId, skip, take) {
        return this.queryBus.execute(new queries_1.GetPluginTenantsByTenantQuery(tenantId, organizationId, skip, take));
    }
    /**
     * Check user access to a plugin
     */
    async checkAccess(userId, pluginId, tenantId, organizationId, userRoles = []) {
        return this.queryBus.execute(new queries_1.CheckPluginTenantAccessQuery(userId, pluginId, userRoles, tenantId, organizationId));
    }
    /**
     * Get plugin tenant by ID
     */
    async findOne(id) {
        return this.queryBus.execute(new queries_1.GetPluginTenantByIdQuery(id));
    }
    /**
     * Get quota information for a plugin tenant
     */
    async getQuotaInfo(id) {
        return this.queryBus.execute(new queries_1.GetPluginTenantQuotaInfoQuery(id));
    }
    /**
     * Get users for a plugin tenant (allowed, denied, or all)
     */
    async getPluginTenantUsers(id, type = 'all', skip, take, searchTerm) {
        return this.queryBus.execute(new queries_1.GetPluginTenantUsersQuery(id, type, skip, take, searchTerm));
    }
    /**
     * Manage users for a plugin tenant (allow, deny, remove)
     */
    async managePluginTenantUsers(id, dto) {
        return this.commandBus.execute(new commands_1.ManagePluginTenantUsersCommand(id, dto.userIds, dto.operation, dto.reason));
    }
    /**
     * Update plugin tenant
     */
    async update(id, updateDto) {
        return this.commandBus.execute(new commands_1.UpdatePluginTenantCommand(id, updateDto));
    }
    /**
     * Update plugin tenant configuration
     */
    async updateConfiguration(configDto) {
        return this.commandBus.execute(new commands_1.UpdatePluginTenantConfigurationCommand(configDto));
    }
    /**
     * Enable plugin tenant
     */
    async enable(id) {
        return this.commandBus.execute(new commands_1.EnablePluginTenantCommand(id));
    }
    /**
     * Disable plugin tenant
     */
    async disable(id) {
        return this.commandBus.execute(new commands_1.DisablePluginTenantCommand(id));
    }
    /**
     * Approve or reject plugin tenant
     */
    async updateApproval(approvalDto) {
        return this.commandBus.execute(new commands_1.ApprovePluginTenantCommand(approvalDto));
    }
    /**
     * Bulk update plugin tenants
     */
    async bulkUpdate(bulkDto) {
        return this.commandBus.execute(new commands_1.BulkUpdatePluginTenantCommand(bulkDto));
    }
    /**
     * Delete plugin tenant
     */
    async remove(id) {
        return this.commandBus.execute(new commands_1.DeletePluginTenantCommand(id));
    }
};
exports.PluginTenantController = PluginTenantController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create Plugin Tenant',
        description: 'Creates a new plugin tenant relationship with specified configuration and access controls'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Plugin tenant created successfully',
        type: Object
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Plugin tenant already exists'
    }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreatePluginTenantDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get All Plugin Tenants',
        description: 'Retrieves all plugin tenant relationships with optional filtering by various criteria'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin tenants retrieved successfully',
        type: [Object]
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.PluginTenantQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Plugin Tenant Statistics',
        description: 'Retrieves comprehensive statistics about plugin tenant usage and quotas'
    }),
    (0, swagger_1.ApiQuery)({ name: 'tenantId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Statistics retrieved successfully',
        type: Object
    }),
    (0, common_1.Get)('/statistics'),
    tslib_1.__param(0, (0, common_1.Query)('tenantId')),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "getStatistics", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Plugin Tenants by Plugin',
        description: 'Retrieves all tenant relationships for a specific plugin'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', type: 'string', description: 'Plugin ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin tenants retrieved successfully',
        type: [Object]
    }),
    (0, common_1.Get)('/by-plugin/:pluginId'),
    tslib_1.__param(0, (0, common_1.Param)('pluginId')),
    tslib_1.__param(1, (0, common_1.Query)('skip')),
    tslib_1.__param(2, (0, common_1.Query)('take')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "findByPlugin", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Plugin Tenants by Tenant',
        description: 'Retrieves all plugin relationships for a specific tenant/organization'
    }),
    (0, swagger_1.ApiParam)({ name: 'tenantId', type: 'string', description: 'Tenant ID' }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin tenants retrieved successfully',
        type: [Object]
    }),
    (0, common_1.Get)('/by-tenant/:tenantId'),
    tslib_1.__param(0, (0, common_1.Param)('tenantId')),
    tslib_1.__param(1, (0, common_1.Query)('organizationId')),
    tslib_1.__param(2, (0, common_1.Query)('skip')),
    tslib_1.__param(3, (0, common_1.Query)('take')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "findByTenant", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Check Plugin Access',
        description: 'Checks if a user has access to a specific plugin based on tenant configuration'
    }),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: String }),
    (0, swagger_1.ApiQuery)({ name: 'pluginId', type: String }),
    (0, swagger_1.ApiQuery)({ name: 'tenantId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Access check completed',
        type: Object
    }),
    (0, common_1.Get)('/check-access'),
    tslib_1.__param(0, (0, common_1.Query)('userId')),
    tslib_1.__param(1, (0, common_1.Query)('pluginId')),
    tslib_1.__param(2, (0, common_1.Query)('tenantId')),
    tslib_1.__param(3, (0, common_1.Query)('organizationId')),
    tslib_1.__param(4, (0, common_1.Query)('userRoles')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, String, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "checkAccess", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Plugin Tenant by ID',
        description: 'Retrieves a specific plugin tenant by its ID with full relation data'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Plugin Tenant ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin tenant retrieved successfully',
        type: Object
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Plugin tenant not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Plugin Tenant Quota Info',
        description: 'Retrieves quota and usage information for a specific plugin tenant'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Plugin Tenant ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Quota information retrieved successfully',
        type: Object
    }),
    (0, common_1.Get)(':id/quota'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "getQuotaInfo", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Plugin Tenant Users',
        description: 'Retrieves users assigned to a plugin tenant with their access type (allowed/denied)'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Plugin Tenant ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: ['allowed', 'denied', 'all'],
        description: 'Type of users to retrieve'
    }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number, description: 'Number of records to take' }),
    (0, swagger_1.ApiQuery)({ name: 'searchTerm', required: false, type: String, description: 'Search term for filtering users' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Users retrieved successfully',
        type: Object
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Plugin tenant not found'
    }),
    (0, common_1.Get)(':id/users'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)('type')),
    tslib_1.__param(2, (0, common_1.Query)('skip')),
    tslib_1.__param(3, (0, common_1.Query)('take')),
    tslib_1.__param(4, (0, common_1.Query)('searchTerm')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "getPluginTenantUsers", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Manage Plugin Tenant Users',
        description: 'Add or remove users from allowed/denied lists for a plugin tenant'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Plugin Tenant ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User management operation completed successfully',
        type: Object
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Plugin tenant or users not found'
    }),
    (0, common_1.Post)(':id/users'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.ManagePluginTenantUsersDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "managePluginTenantUsers", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update Plugin Tenant',
        description: 'Updates an existing plugin tenant configuration'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Plugin Tenant ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin tenant updated successfully',
        type: Object
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Plugin tenant not found'
    }),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdatePluginTenantDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update Plugin Tenant Configuration',
        description: 'Updates the configuration and preferences for a plugin tenant'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Configuration updated successfully',
        type: Object
    }),
    (0, common_1.Patch)('/configuration'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.PluginTenantConfigurationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "updateConfiguration", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Enable Plugin Tenant',
        description: 'Enables a plugin tenant, making it available for use'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Plugin Tenant ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin tenant enabled successfully',
        type: Object
    }),
    (0, common_1.Patch)(':id/enable'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "enable", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Disable Plugin Tenant',
        description: 'Disables a plugin tenant, making it unavailable for use'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Plugin Tenant ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin tenant disabled successfully',
        type: Object
    }),
    (0, common_1.Patch)(':id/disable'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "disable", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Approve/Reject Plugin Tenant',
        description: 'Approves or rejects a plugin tenant installation request'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin tenant approval status updated successfully',
        type: Object
    }),
    (0, common_1.Patch)('/approval'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.PluginTenantApprovalDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "updateApproval", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk Update Plugin Tenants',
        description: 'Performs bulk operations on multiple plugin tenants (enable, disable, approve, etc.)'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Bulk operation completed',
        type: Object
    }),
    (0, common_1.Patch)('/bulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.PluginTenantBulkOperationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "bulkUpdate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Plugin Tenant',
        description: 'Permanently deletes a plugin tenant relationship'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', description: 'Plugin Tenant ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Plugin tenant deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Plugin tenant not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTenantController.prototype, "remove", null);
exports.PluginTenantController = PluginTenantController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Tenant Management'),
    (0, common_1.Controller)('/plugin-tenants'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], PluginTenantController);
//# sourceMappingURL=plugin-tenant.controller.js.map