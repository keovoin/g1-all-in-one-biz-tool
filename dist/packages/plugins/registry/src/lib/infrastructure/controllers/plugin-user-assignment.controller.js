"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginUserAssignmentManagementController = exports.UserPluginAssignmentController = exports.PluginUserAssignmentController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const shared_1 = require("../../shared");
/**
 * Plugin User Assignment Controller
 * Handles user assignment operations for specific plugins
 */
let PluginUserAssignmentController = class PluginUserAssignmentController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Get all users assigned to a specific plugin
     */
    async getPluginUserAssignments(pluginId, skip, take) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        return this.queryBus.execute(new application_1.GetPluginUserAssignmentsQuery(pluginId, tenantId, organizationId, skip, take));
    }
    /**
     * Assign users to a plugin
     */
    async assignUsersToPlugin(pluginId, assignDto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        return this.commandBus.execute(new application_1.AssignUsersToPluginCommand(pluginId, assignDto.userIds, tenantId, organizationId, assignDto.reason));
    }
    /**
     * Unassign users from a plugin
     */
    async unassignUsersFromPlugin(pluginId, unassignDto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        return this.commandBus.execute(new application_1.UnassignUsersFromPluginCommand(pluginId, unassignDto.userIds, tenantId, organizationId, unassignDto.reason));
    }
};
exports.PluginUserAssignmentController = PluginUserAssignmentController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get users assigned to a plugin',
        description: 'Retrieve all users assigned to a specific plugin.'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', description: 'Number of records to skip', required: false, type: 'number' }),
    (0, swagger_1.ApiQuery)({ name: 'take', description: 'Number of records to take', required: false, type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved plugin user assignments'
    }),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('skip')),
    tslib_1.__param(2, (0, common_1.Query)('take')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginUserAssignmentController.prototype, "getPluginUserAssignments", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign users to a plugin',
        description: 'Assign one or more users to a specific plugin.'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: shared_1.AssignPluginUsersDTO }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Successfully assigned users to plugin'
    }),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.AssignPluginUsersDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginUserAssignmentController.prototype, "assignUsersToPlugin", null);
tslib_1.__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Unassign users from a plugin',
        description: 'Remove one or more users from a specific plugin.'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: shared_1.UnassignPluginUsersDTO }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully unassigned users from plugin'
    }),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.UnassignPluginUsersDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginUserAssignmentController.prototype, "unassignUsersFromPlugin", null);
exports.PluginUserAssignmentController = PluginUserAssignmentController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugins - User Assignment'),
    (0, common_1.Controller)('plugins/:pluginId/users'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], PluginUserAssignmentController);
/**
 * User Plugin Assignment Controller
 * Handles plugin assignment operations for specific users
 */
let UserPluginAssignmentController = class UserPluginAssignmentController {
    constructor(queryBus) {
        this.queryBus = queryBus;
    }
    /**
     * Get all plugins assigned to a specific user
     */
    async getUserPluginAssignments(userId, skip, take) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        return this.queryBus.execute(new application_1.GetUserPluginAssignmentsQuery(userId, tenantId, organizationId, skip, take));
    }
    /**
     * Check if a user has access to a specific plugin
     */
    async checkUserPluginAccess(userId, pluginId) {
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const tenantId = core_1.RequestContext.currentTenantId();
        return this.queryBus.execute(new application_1.CheckUserPluginAccessQuery(pluginId, userId, tenantId, organizationId));
    }
};
exports.UserPluginAssignmentController = UserPluginAssignmentController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get plugins assigned to a user',
        description: 'Retrieve all plugins assigned to a specific user.'
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', description: 'Number of records to skip', required: false, type: 'number' }),
    (0, swagger_1.ApiQuery)({ name: 'take', description: 'Number of records to take', required: false, type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved user plugin assignments'
    }),
    tslib_1.__param(0, (0, common_1.Param)('userId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('skip')),
    tslib_1.__param(2, (0, common_1.Query)('take')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], UserPluginAssignmentController.prototype, "getUserPluginAssignments", null);
tslib_1.__decorate([
    (0, common_1.Get)(':pluginId/access'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check user plugin access',
        description: 'Check if a user has access to a specific plugin.'
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully checked user plugin access'
    }),
    tslib_1.__param(0, (0, common_1.Param)('userId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserPluginAssignmentController.prototype, "checkUserPluginAccess", null);
exports.UserPluginAssignmentController = UserPluginAssignmentController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Users - Plugin Assignment'),
    (0, common_1.Controller)('users/:userId/plugins'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus])
], UserPluginAssignmentController);
/**
 * Plugin User Assignment Management Controller
 * Handles general management operations for plugin user assignments
 */
let PluginUserAssignmentManagementController = class PluginUserAssignmentManagementController {
    constructor(queryBus) {
        this.queryBus = queryBus;
    }
    /**
     * Get all plugin user assignments
     */
    async getAllPluginUserAssignments(skip, take) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        return this.queryBus.execute(new application_1.GetAllPluginUserAssignmentsQuery(tenantId, organizationId, skip, take));
    }
};
exports.PluginUserAssignmentManagementController = PluginUserAssignmentManagementController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all plugin user assignments',
        description: 'Retrieve all plugin user assignments.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'skip', description: 'Number of records to skip', required: false, type: 'number' }),
    (0, swagger_1.ApiQuery)({ name: 'take', description: 'Number of records to take', required: false, type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved all plugin user assignments'
    }),
    tslib_1.__param(0, (0, common_1.Query)('skip')),
    tslib_1.__param(1, (0, common_1.Query)('take')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginUserAssignmentManagementController.prototype, "getAllPluginUserAssignments", null);
exports.PluginUserAssignmentManagementController = PluginUserAssignmentManagementController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugins - User Assignment Management'),
    (0, common_1.Controller)('plugin-user-assignments'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus])
], PluginUserAssignmentManagementController);
//# sourceMappingURL=plugin-user-assignment.controller.js.map