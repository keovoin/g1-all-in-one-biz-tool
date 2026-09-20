"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginSettingCommand = void 0;
class DeletePluginSettingCommand {
    constructor(id, tenantId, organizationId, userId) {
        this.id = id;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.DeletePluginSettingCommand = DeletePluginSettingCommand;
DeletePluginSettingCommand.type = '[Plugin Setting] Delete';
//# sourceMappingURL=delete-plugin-setting.command.js.map