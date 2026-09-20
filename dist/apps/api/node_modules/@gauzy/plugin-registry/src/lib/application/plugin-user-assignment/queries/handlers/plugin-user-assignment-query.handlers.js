"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPluginUserAssignmentsQueryHandler = exports.CheckUserPluginAccessQueryHandler = exports.GetUserPluginAssignmentsQueryHandler = exports.GetPluginUserAssignmentsQueryHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const plugin_user_assignment_queries_1 = require("../../queries/plugin-user-assignment.queries");
/**
 * Handler for getting plugin user assignments
 */
let GetPluginUserAssignmentsQueryHandler = class GetPluginUserAssignmentsQueryHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    async execute(query) {
        const { pluginId, tenantId, organizationId, skip, take } = query;
        // Use context values if not provided
        const currentTenantId = tenantId || core_1.RequestContext.currentTenantId();
        const currentOrgId = organizationId || core_1.RequestContext.currentOrganizationId();
        if (!currentTenantId) {
            return {
                items: [],
                total: 0
            };
        }
        // Use PluginTenantService to find plugin tenants by plugin ID with pagination
        const result = await this.pluginTenantService.findByPluginId(pluginId, ['plugin', 'allowedRoles', 'allowedUsers', 'deniedUsers', 'approvedBy'], skip, take);
        // Filter by tenant and organization
        const filteredTenants = result.items.filter((tenant) => {
            if (tenant.tenantId !== currentTenantId) {
                return false;
            }
            if (currentOrgId && tenant.organizationId !== currentOrgId) {
                return false;
            }
            return true;
        });
        return {
            items: filteredTenants,
            total: result.total
        };
    }
};
exports.GetPluginUserAssignmentsQueryHandler = GetPluginUserAssignmentsQueryHandler;
exports.GetPluginUserAssignmentsQueryHandler = GetPluginUserAssignmentsQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(plugin_user_assignment_queries_1.GetPluginUserAssignmentsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], GetPluginUserAssignmentsQueryHandler);
/**
 * Handler for getting user plugin assignments
 */
let GetUserPluginAssignmentsQueryHandler = class GetUserPluginAssignmentsQueryHandler {
    constructor(userAssignmentService, pluginTenantService) {
        this.userAssignmentService = userAssignmentService;
        this.pluginTenantService = pluginTenantService;
    }
    async execute(query) {
        const { userId, tenantId, organizationId, skip, take } = query;
        // Use context values if not provided
        const currentTenantId = tenantId || core_1.RequestContext.currentTenantId();
        const currentOrgId = organizationId || core_1.RequestContext.currentOrganizationId();
        const currentUserId = userId || core_1.RequestContext.currentUserId();
        if (!currentTenantId || !currentUserId) {
            return {
                items: [],
                total: 0
            };
        }
        // Get all plugin tenants for this tenant/organization using PluginTenantService with pagination
        const result = await this.pluginTenantService.findByTenantId(currentTenantId, currentOrgId, ['plugin', 'allowedRoles', 'allowedUsers', 'deniedUsers'], skip, take);
        // Filter plugins the user has access to
        const accessiblePluginTenants = [];
        for (const pluginTenant of result.items) {
            const hasAccess = await this.userAssignmentService.hasUserAccessToPlugin({ pluginTenantId: pluginTenant.id }, currentUserId);
            if (hasAccess) {
                accessiblePluginTenants.push(pluginTenant);
            }
        }
        return {
            items: accessiblePluginTenants,
            total: result.total
        };
    }
};
exports.GetUserPluginAssignmentsQueryHandler = GetUserPluginAssignmentsQueryHandler;
exports.GetUserPluginAssignmentsQueryHandler = GetUserPluginAssignmentsQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(plugin_user_assignment_queries_1.GetUserPluginAssignmentsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginUserAssignmentService,
        domain_1.PluginTenantService])
], GetUserPluginAssignmentsQueryHandler);
/**
 * Handler for checking user plugin access
 */
let CheckUserPluginAccessQueryHandler = class CheckUserPluginAccessQueryHandler {
    constructor(userAssignmentService) {
        this.userAssignmentService = userAssignmentService;
    }
    async execute(query) {
        const { pluginId, userId, tenantId, organizationId } = query;
        // Use context values if not provided
        const currentTenantId = tenantId || core_1.RequestContext.currentTenantId();
        const currentOrgId = organizationId || core_1.RequestContext.currentOrganizationId();
        const currentUserId = userId || core_1.RequestContext.currentUserId();
        if (!currentTenantId || !currentUserId) {
            return { hasAccess: false };
        }
        const hasAccess = await this.userAssignmentService.hasUserAccessToPlugin({
            pluginId,
            tenantId: currentTenantId,
            organizationId: currentOrgId
        }, currentUserId);
        return { hasAccess };
    }
};
exports.CheckUserPluginAccessQueryHandler = CheckUserPluginAccessQueryHandler;
exports.CheckUserPluginAccessQueryHandler = CheckUserPluginAccessQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(plugin_user_assignment_queries_1.CheckUserPluginAccessQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginUserAssignmentService])
], CheckUserPluginAccessQueryHandler);
/**
 * Handler for getting all plugin user assignments
 */
let GetAllPluginUserAssignmentsQueryHandler = class GetAllPluginUserAssignmentsQueryHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    async execute(query) {
        const { tenantId, organizationId, skip, take } = query;
        // Use context values if not provided
        const currentTenantId = tenantId || core_1.RequestContext.currentTenantId();
        const currentOrgId = organizationId || core_1.RequestContext.currentOrganizationId();
        if (!currentTenantId) {
            return {
                items: [],
                total: 0
            };
        }
        // Use PluginTenantService to get all plugin tenants for this tenant/organization with pagination
        return this.pluginTenantService.findByTenantId(currentTenantId, currentOrgId, ['plugin', 'allowedRoles', 'allowedUsers', 'deniedUsers', 'approvedBy'], skip, take);
    }
};
exports.GetAllPluginUserAssignmentsQueryHandler = GetAllPluginUserAssignmentsQueryHandler;
exports.GetAllPluginUserAssignmentsQueryHandler = GetAllPluginUserAssignmentsQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(plugin_user_assignment_queries_1.GetAllPluginUserAssignmentsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], GetAllPluginUserAssignmentsQueryHandler);
//# sourceMappingURL=plugin-user-assignment-query.handlers.js.map