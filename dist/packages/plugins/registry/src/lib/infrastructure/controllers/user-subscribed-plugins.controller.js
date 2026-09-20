"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscribedPluginsController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const domain_1 = require("../../domain");
/**
 * User Subscribed Plugins Controller
 * Provides endpoint to retrieve all plugins where the current user has an active subscription
 */
let UserSubscribedPluginsController = class UserSubscribedPluginsController {
    constructor(queryBus) {
        this.queryBus = queryBus;
    }
    /**
     * Get all plugins where the current user has an active subscription
     */
    async getSubscribedPlugins(status, skip, take, relations) {
        const userId = core_1.RequestContext.currentUserId();
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        return this.queryBus.execute(new application_1.GetUserSubscribedPluginsQuery(userId, tenantId, organizationId, {
            status,
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            relations: relations || []
        }));
    }
};
exports.UserSubscribedPluginsController = UserSubscribedPluginsController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get plugins with user subscription',
        description: 'Retrieves all plugins where the current authenticated user has an active or trialing subscription. Supports pagination and status filtering.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: contracts_1.PluginSubscriptionStatus,
        description: 'Filter by subscription status (defaults to ACTIVE and TRIALING)'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'skip',
        required: false,
        type: Number,
        description: 'Number of records to skip for pagination'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'take',
        required: false,
        type: Number,
        description: 'Number of records to take for pagination (default: 10)'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'relations',
        required: false,
        isArray: true,
        description: 'Additional relations to include in plugin results'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.OK,
        description: 'Subscribed plugins retrieved successfully.',
        type: domain_1.Plugin,
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access - user must be authenticated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: contracts_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden - insufficient permissions.'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('status')),
    tslib_1.__param(1, (0, common_1.Query)('skip')),
    tslib_1.__param(2, (0, common_1.Query)('take')),
    tslib_1.__param(3, (0, common_1.Query)('relations')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array, Number, Number, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], UserSubscribedPluginsController.prototype, "getSubscribedPlugins", null);
exports.UserSubscribedPluginsController = UserSubscribedPluginsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('User Subscribed Plugins'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('plugins/subscriptions/me'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus])
], UserSubscribedPluginsController);
//# sourceMappingURL=user-subscribed-plugins.controller.js.map