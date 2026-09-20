"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPluginSettingValueCommand = void 0;
class SetPluginSettingValueCommand {
    constructor(setValueDto, tenantId, organizationId, userId) {
        this.setValueDto = setValueDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.SetPluginSettingValueCommand = SetPluginSettingValueCommand;
SetPluginSettingValueCommand.type = '[Plugin Setting] Set Value';
//# sourceMappingURL=set-plugin-setting-value.command.js.map