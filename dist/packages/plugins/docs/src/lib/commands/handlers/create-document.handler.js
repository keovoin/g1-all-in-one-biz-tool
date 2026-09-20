"use strict";
var CreateDocumentHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDocumentHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const document_knowledge_service_1 = require("../../services/document-knowledge.service");
const document_service_1 = require("../../services/document.service");
const document_settings_service_1 = require("../../services/document-settings.service");
const create_document_command_1 = require("../create-document.command");
let CreateDocumentHandler = CreateDocumentHandler_1 = class CreateDocumentHandler {
    constructor(documentService, documentKnowledgeService, documentSettingsService) {
        this.documentService = documentService;
        this.documentKnowledgeService = documentKnowledgeService;
        this.documentSettingsService = documentSettingsService;
        this.logger = new common_1.Logger(CreateDocumentHandler_1.name);
    }
    /**
     * Handles the `CreateDocumentCommand`: creates a FOLDER or PAGE node and, when asked for,
     * enqueues it into AI knowledge.
     *
     * The knowledge import lives here rather than inside `DocumentService.createDocument()` for a
     * DI reason: `DocumentKnowledgeService` already depends on `DocumentService`, so injecting it
     * the other way round would close a provider cycle. A command handler sits above both.
     *
     * @param command - The command carrying the create payload.
     * @returns The newly created document.
     */
    async execute(command) {
        const document = await this.documentService.createDocument(command.input);
        if (await this.shouldImportToKnowledge(command, document)) {
            try {
                // The canonical import path: it enforces the indexability rules, sets `QUEUED`,
                // enqueues the right pipeline stage and emits the knowledge event.
                await this.documentKnowledgeService.importToKnowledge(document.id);
            }
            catch (error) {
                // Importing into knowledge is an enrichment, never a precondition of authoring —
                // a queue or capability failure must not fail the create.
                this.logger.warn(`Failed to import document ${document.id} into AI knowledge on create: ${error.message}`);
            }
        }
        return document;
    }
    /**
     * Whether this create should enqueue the new document into AI knowledge
     * (`02-domain-model.md` §11.4/§12).
     *
     * 🛑 The DTO whitelists `importToKnowledge`, so it has to mean something: it used to be parsed
     * and then dropped while the row was written `knowledgeStatus: NONE` unconditionally — silent
     * acceptance is the one behavior the spec rules out.
     *
     * The explicit payload flag wins; when it is omitted the organization's
     * `importToKnowledgeDefault` decides — the same precedence the upload path applies. FOLDER
     * nodes are never indexable, so they never ask.
     *
     * @param command The create command.
     * @param document The freshly created document.
     * @returns True when the knowledge import should run.
     */
    async shouldImportToKnowledge(command, document) {
        if (document.kind !== contracts_1.DocumentKindEnum.PAGE) {
            return false;
        }
        if (command.input.importToKnowledge !== undefined) {
            return command.input.importToKnowledge === true;
        }
        try {
            const defaults = await this.documentSettingsService.getDefaults(document.organizationId);
            return defaults.importToKnowledgeDefault === true;
        }
        catch (error) {
            this.logger.warn(`Failed to read the knowledge-import default: ${error.message}`);
            return false;
        }
    }
};
exports.CreateDocumentHandler = CreateDocumentHandler;
exports.CreateDocumentHandler = CreateDocumentHandler = CreateDocumentHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_document_command_1.CreateDocumentCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_knowledge_service_1.DocumentKnowledgeService,
        document_settings_service_1.DocumentSettingsService])
], CreateDocumentHandler);
//# sourceMappingURL=create-document.handler.js.map