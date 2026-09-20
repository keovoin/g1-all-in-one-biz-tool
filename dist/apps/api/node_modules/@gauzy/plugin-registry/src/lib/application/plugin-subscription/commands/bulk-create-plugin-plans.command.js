"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCreatePluginPlansCommand = void 0;
class BulkCreatePluginPlansCommand {
    constructor(plans, tenantId, organizationId, userId) {
        this.plans = plans;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.BulkCreatePluginPlansCommand = BulkCreatePluginPlansCommand;
BulkCreatePluginPlansCommand.type = '[Plugin Subscription Plan] Create Multiple';
//# sourceMappingURL=bulk-create-plugin-plans.command.js.map