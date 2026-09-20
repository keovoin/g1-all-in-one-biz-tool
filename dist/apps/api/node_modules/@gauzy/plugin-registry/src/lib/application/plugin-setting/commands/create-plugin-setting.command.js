"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginSettingCommand = void 0;
class CreatePluginSettingCommand {
    constructor(createDto, tenantId, organizationId, userId) {
        this.createDto = createDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.CreatePluginSettingCommand = CreatePluginSettingCommand;
CreatePluginSettingCommand.type = '[Plugin Setting] Create';
//# sourceMappingURL=create-plugin-setting.command.js.map