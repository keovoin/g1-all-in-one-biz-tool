"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpublishPluginCommand = void 0;
class UnpublishPluginCommand {
    constructor(pluginId, reason, tenantId, organizationId, userId) {
        this.pluginId = pluginId;
        this.reason = reason;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.UnpublishPluginCommand = UnpublishPluginCommand;
UnpublishPluginCommand.type = '[Plugin] Unpublish';
//# sourceMappingURL=unpublish-plugin.command.js.map