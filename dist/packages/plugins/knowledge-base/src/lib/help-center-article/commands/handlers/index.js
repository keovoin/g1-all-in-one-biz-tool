"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const help_center_article_update_handler_1 = require("./help-center-article.update.handler");
const help_center_menu_bulk_delete_handler_1 = require("./help-center.menu.bulk.delete.handler");
exports.CommandHandlers = [
    help_center_menu_bulk_delete_handler_1.KnowledgeBaseCategoryBulkDeleteHandler,
    help_center_article_update_handler_1.HelpCenterArticleUpdateHandler
];
//# sourceMappingURL=index.js.map