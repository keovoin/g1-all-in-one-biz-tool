"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratePluginLicenseCommand = void 0;
class GeneratePluginLicenseCommand {
    constructor(subscriptionId, pluginId, tenantId, organizationId, userId) {
        this.subscriptionId = subscriptionId;
        this.pluginId = pluginId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.GeneratePluginLicenseCommand = GeneratePluginLicenseCommand;
GeneratePluginLicenseCommand.type = '[Plugin License] Generate';
//# sourceMappingURL=generate-plugin-license.command.js.map