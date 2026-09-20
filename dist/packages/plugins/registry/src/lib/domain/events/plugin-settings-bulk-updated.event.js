"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSettingsBulkUpdatedEvent = void 0;
class PluginSettingsBulkUpdatedEvent {
    constructor(pluginId, changedSettings, pluginTenantId, tenantId, organizationId, userId, timestamp = new Date()) {
        this.pluginId = pluginId;
        this.changedSettings = changedSettings;
        this.pluginTenantId = pluginTenantId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
        this.timestamp = timestamp;
    }
}
exports.PluginSettingsBulkUpdatedEvent = PluginSettingsBulkUpdatedEvent;
//# sourceMappingURL=plugin-settings-bulk-updated.event.js.map