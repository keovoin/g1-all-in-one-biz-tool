"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovePluginCommand = void 0;
class ApprovePluginCommand {
    constructor(pluginId, reviewerId, approvalNotes, tenantId, organizationId) {
        this.pluginId = pluginId;
        this.reviewerId = reviewerId;
        this.approvalNotes = approvalNotes;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.ApprovePluginCommand = ApprovePluginCommand;
ApprovePluginCommand.type = '[Plugin] Approve';
//# sourceMappingURL=approve-plugin.command.js.map