"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseArticleBulkDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const utils_1 = require("@gauzy/utils");
const __1 = require("..");
const help_center_author_service_1 = require("../../help-center-author.service");
let KnowledgeBaseArticleBulkDeleteHandler = class KnowledgeBaseArticleBulkDeleteHandler {
    constructor(helpCenterAuthorService) {
        this.helpCenterAuthorService = helpCenterAuthorService;
    }
    async execute(command) {
        const { id } = command;
        const authors = await this.helpCenterAuthorService.findByArticleId(id);
        const ids = authors.map((item) => item.id);
        if ((0, utils_1.isNotEmpty)(ids)) {
            await this.helpCenterAuthorService.deleteBulk(ids);
        }
        return;
    }
};
exports.KnowledgeBaseArticleBulkDeleteHandler = KnowledgeBaseArticleBulkDeleteHandler;
exports.KnowledgeBaseArticleBulkDeleteHandler = KnowledgeBaseArticleBulkDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(__1.KnowledgeBaseArticleBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [help_center_author_service_1.HelpCenterAuthorService])
], KnowledgeBaseArticleBulkDeleteHandler);
//# sourceMappingURL=help-center-author.bulk.delete.handler.js.map