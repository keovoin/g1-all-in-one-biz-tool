"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSettingDeletedEvent = void 0;
class PluginSettingDeletedEvent {
    constructor(settingId, pluginId, key, value, tenantId, organizationId, userId, timestamp = new Date()) {
        this.settingId = settingId;
        this.pluginId = pluginId;
        this.key = key;
        this.value = value;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
        this.timestamp = timestamp;
    }
}
exports.PluginSettingDeletedEvent = PluginSettingDeletedEvent;
//# sourceMappingURL=plugin-setting-deleted.event.js.map