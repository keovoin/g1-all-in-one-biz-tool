"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentSettingsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_settings_service_1 = require("../../services/document-settings.service");
const get_document_settings_query_1 = require("../get-document-settings.query");
let GetDocumentSettingsHandler = class GetDocumentSettingsHandler {
    constructor(documentSettingsService) {
        this.documentSettingsService = documentSettingsService;
    }
    /**
     * Handles the `GetDocumentSettingsQuery`: org defaults + read-only deployment capabilities.
     *
     * @param query - The query carrying the organization id.
     * @returns The settings envelope.
     */
    async execute(query) {
        return this.documentSettingsService.getSettings(query.organizationId);
    }
};
exports.GetDocumentSettingsHandler = GetDocumentSettingsHandler;
exports.GetDocumentSettingsHandler = GetDocumentSettingsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_settings_query_1.GetDocumentSettingsQuery),
    tslib_1.__metadata("design:paramtypes", [document_settings_service_1.DocumentSettingsService])
], GetDocumentSettingsHandler);
//# sourceMappingURL=get-document-settings.handler.js.map