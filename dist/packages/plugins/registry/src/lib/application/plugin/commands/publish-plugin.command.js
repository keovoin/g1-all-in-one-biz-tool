"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishPluginCommand = void 0;
class PublishPluginCommand {
    constructor(publishDto, tenantId, organizationId, userId) {
        this.publishDto = publishDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.PublishPluginCommand = PublishPluginCommand;
PublishPluginCommand.type = '[Plugin] Publish';
//# sourceMappingURL=publish-plugin.command.js.map