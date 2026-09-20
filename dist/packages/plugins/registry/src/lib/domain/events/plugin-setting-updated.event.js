"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSettingUpdatedEvent = void 0;
class PluginSettingUpdatedEvent {
    constructor(settingId, pluginId, key, newValue, previousValue, tenantId, organizationId, userId, timestamp = new Date()) {
        this.settingId = settingId;
        this.pluginId = pluginId;
        this.key = key;
        this.newValue = newValue;
        this.previousValue = previousValue;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
        this.timestamp = timestamp;
    }
}
exports.PluginSettingUpdatedEvent = PluginSettingUpdatedEvent;
//# sourceMappingURL=plugin-setting-updated.event.js.map