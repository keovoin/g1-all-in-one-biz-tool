"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectPluginCommand = void 0;
class RejectPluginCommand {
    constructor(pluginId, reviewerId, rejectionReason, rejectionNotes, tenantId, organizationId) {
        this.pluginId = pluginId;
        this.reviewerId = reviewerId;
        this.rejectionReason = rejectionReason;
        this.rejectionNotes = rejectionNotes;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.RejectPluginCommand = RejectPluginCommand;
RejectPluginCommand.type = '[Plugin] Reject';
//# sourceMappingURL=reject-plugin.command.js.map