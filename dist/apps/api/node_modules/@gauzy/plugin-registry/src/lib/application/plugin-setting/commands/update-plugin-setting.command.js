"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginSettingCommand = void 0;
class UpdatePluginSettingCommand {
    constructor(id, updateDto, tenantId, organizationId, userId) {
        this.id = id;
        this.updateDto = updateDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.UpdatePluginSettingCommand = UpdatePluginSettingCommand;
UpdatePluginSettingCommand.type = '[Plugin Setting] Update';
//# sourceMappingURL=update-plugin-setting.command.js.map