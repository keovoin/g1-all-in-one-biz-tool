"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPluginUserAssignmentsQuery = exports.CheckUserPluginAccessQuery = exports.GetUserPluginAssignmentsQuery = exports.GetPluginUserAssignmentsQuery = void 0;
/**
 * Query to get plugin user assignments
 */
class GetPluginUserAssignmentsQuery {
    constructor(pluginId, tenantId, organizationId, skip, take) {
        this.pluginId = pluginId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.skip = skip;
        this.take = take;
    }
}
exports.GetPluginUserAssignmentsQuery = GetPluginUserAssignmentsQuery;
GetPluginUserAssignmentsQuery.type = '[Plugin User Assignment] Get Plugin User Assignments';
/**
 * Query to get user plugin assignments
 */
class GetUserPluginAssignmentsQuery {
    constructor(userId, tenantId, organizationId, skip, take) {
        this.userId = userId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.skip = skip;
        this.take = take;
    }
}
exports.GetUserPluginAssignmentsQuery = GetUserPluginAssignmentsQuery;
GetUserPluginAssignmentsQuery.type = '[Plugin User Assignment] Get User Plugin Assignments';
/**
 * Query to check user plugin access
 */
class CheckUserPluginAccessQuery {
    constructor(pluginId, userId, tenantId, organizationId) {
        this.pluginId = pluginId;
        this.userId = userId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.CheckUserPluginAccessQuery = CheckUserPluginAccessQuery;
CheckUserPluginAccessQuery.type = '[Plugin User Assignment] Check User Plugin Access';
/**
 * Query to get all plugin user assignments
 */
class GetAllPluginUserAssignmentsQuery {
    constructor(tenantId, organizationId, skip, take) {
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.skip = skip;
        this.take = take;
    }
}
exports.GetAllPluginUserAssignmentsQuery = GetAllPluginUserAssignmentsQuery;
GetAllPluginUserAssignmentsQuery.type = '[Plugin User Assignment] Get All Plugin User Assignments';
//# sourceMappingURL=plugin-user-assignment.queries.js.map