"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const help_center_author_bulk_delete_handler_1 = require("./help-center-author.bulk.delete.handler");
const help_center_author_bulk_create_handler_1 = require("./help-center-author.bulk.create.handler");
exports.CommandHandlers = [
    help_center_author_bulk_delete_handler_1.KnowledgeBaseArticleBulkDeleteHandler,
    help_center_author_bulk_create_handler_1.ArticleAuthorsBulkCreateHandler
];
//# sourceMappingURL=index.js.map