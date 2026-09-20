"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentSettingsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_settings_service_1 = require("../../services/document-settings.service");
const update_document_settings_command_1 = require("../update-document-settings.command");
let UpdateDocumentSettingsHandler = class UpdateDocumentSettingsHandler {
    constructor(documentSettingsService) {
        this.documentSettingsService = documentSettingsService;
    }
    /**
     * Handles the `UpdateDocumentSettingsCommand`: partial update of the org-defaults block.
     *
     * @param command - The command carrying the organization id and defaults payload.
     * @returns The updated settings envelope.
     */
    async execute(command) {
        return this.documentSettingsService.updateSettings(command.organizationId, command.input);
    }
};
exports.UpdateDocumentSettingsHandler = UpdateDocumentSettingsHandler;
exports.UpdateDocumentSettingsHandler = UpdateDocumentSettingsHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_document_settings_command_1.UpdateDocumentSettingsCommand),
    tslib_1.__metadata("design:paramtypes", [document_settings_service_1.DocumentSettingsService])
], UpdateDocumentSettingsHandler);
//# sourceMappingURL=update-document-settings.handler.js.map