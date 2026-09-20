"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseCategoryBulkDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const help_center_article_service_1 = require("./../../../help-center-article/help-center-article.service");
const help_center_menu_bulk_delete_command_1 = require("../help-center.menu.bulk.delete.command");
let KnowledgeBaseCategoryBulkDeleteHandler = class KnowledgeBaseCategoryBulkDeleteHandler {
    constructor(helpCenterArticle) {
        this.helpCenterArticle = helpCenterArticle;
    }
    async execute(command) {
        const { id: categoryId } = command;
        const articles = await this.helpCenterArticle.getArticlesByCategoryId(categoryId);
        if (!articles?.length) {
            return;
        }
        const articleIds = articles.map((article) => article.id);
        await this.helpCenterArticle.deleteMany(articleIds);
    }
};
exports.KnowledgeBaseCategoryBulkDeleteHandler = KnowledgeBaseCategoryBulkDeleteHandler;
exports.KnowledgeBaseCategoryBulkDeleteHandler = KnowledgeBaseCategoryBulkDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(help_center_menu_bulk_delete_command_1.KnowledgeBaseCategoryBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [help_center_article_service_1.HelpCenterArticleService])
], KnowledgeBaseCategoryBulkDeleteHandler);
//# sourceMappingURL=help-center.menu.bulk.delete.handler.js.map