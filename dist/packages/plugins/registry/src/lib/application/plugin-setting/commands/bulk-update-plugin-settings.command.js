"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUpdatePluginSettingsCommand = void 0;
class BulkUpdatePluginSettingsCommand {
    constructor(bulkUpdateDto, tenantId, organizationId, userId) {
        this.bulkUpdateDto = bulkUpdateDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.BulkUpdatePluginSettingsCommand = BulkUpdatePluginSettingsCommand;
BulkUpdatePluginSettingsCommand.type = '[Plugin Setting] Bulk Update';
//# sourceMappingURL=bulk-update-plugin-settings.command.js.map