"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDocumentCommand = void 0;
class DeleteDocumentCommand {
    constructor(id, strategy = 'subtree') {
        this.id = id;
        this.strategy = strategy;
    }
}
exports.DeleteDocumentCommand = DeleteDocumentCommand;
DeleteDocumentCommand.type = '[Document] Delete';
//# sourceMappingURL=delete-document.command.js.map