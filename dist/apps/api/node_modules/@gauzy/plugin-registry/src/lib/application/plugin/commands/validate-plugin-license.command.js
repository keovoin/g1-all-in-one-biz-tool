"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePluginLicenseCommand = void 0;
class ValidatePluginLicenseCommand {
    constructor(pluginId, licenseKey, tenantId, organizationId, userId) {
        this.pluginId = pluginId;
        this.licenseKey = licenseKey;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.ValidatePluginLicenseCommand = ValidatePluginLicenseCommand;
ValidatePluginLicenseCommand.type = '[Plugin License] Validate';
//# sourceMappingURL=validate-plugin-license.command.js.map