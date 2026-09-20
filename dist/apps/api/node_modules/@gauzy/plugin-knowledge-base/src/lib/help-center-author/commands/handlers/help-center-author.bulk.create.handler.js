"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleAuthorsBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const __1 = require("..");
const help_center_author_service_1 = require("../../help-center-author.service");
let ArticleAuthorsBulkCreateHandler = class ArticleAuthorsBulkCreateHandler {
    constructor(helpCenterAuthorService) {
        this.helpCenterAuthorService = helpCenterAuthorService;
    }
    async execute(command) {
        const { input } = command;
        const { articleId, employeeIds, organizationId, tenantId } = input;
        let author;
        const createInput = [];
        for (const employeeId of employeeIds) {
            author = {
                articleId: articleId,
                employeeId: employeeId,
                organizationId,
                tenantId
            };
            createInput.push(author);
        }
        return await this.helpCenterAuthorService.createBulk(createInput);
    }
};
exports.ArticleAuthorsBulkCreateHandler = ArticleAuthorsBulkCreateHandler;
exports.ArticleAuthorsBulkCreateHandler = ArticleAuthorsBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(__1.ArticleAuthorsBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [help_center_author_service_1.HelpCenterAuthorService])
], ArticleAuthorsBulkCreateHandler);
//# sourceMappingURL=help-center-author.bulk.create.handler.js.map