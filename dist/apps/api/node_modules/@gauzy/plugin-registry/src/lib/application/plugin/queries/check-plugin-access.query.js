"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPluginAccessQuery = void 0;
class CheckPluginAccessQuery {
    constructor(accessCheckDto, tenantId, organizationId) {
        this.accessCheckDto = accessCheckDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.CheckPluginAccessQuery = CheckPluginAccessQuery;
CheckPluginAccessQuery.type = '[Plugin Subscription] Check Access';
//# sourceMappingURL=check-plugin-access.query.js.map