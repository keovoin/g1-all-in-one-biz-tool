"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentCategoriesHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_category_service_1 = require("../../services/document-category.service");
const get_document_categories_query_1 = require("../get-document-categories.query");
let GetDocumentCategoriesHandler = class GetDocumentCategoriesHandler {
    constructor(documentCategoryService) {
        this.documentCategoryService = documentCategoryService;
    }
    /**
     * Handles the `GetDocumentCategoriesQuery`: the per-tenant/org catalog, sorted by name,
     * each item carrying `documentCount`.
     *
     * @param query - The query carrying pagination + org scope.
     * @returns The catalog page.
     */
    async execute(query) {
        return this.documentCategoryService.getCategories(query.params);
    }
};
exports.GetDocumentCategoriesHandler = GetDocumentCategoriesHandler;
exports.GetDocumentCategoriesHandler = GetDocumentCategoriesHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_categories_query_1.GetDocumentCategoriesQuery),
    tslib_1.__metadata("design:paramtypes", [document_category_service_1.DocumentCategoryService])
], GetDocumentCategoriesHandler);
//# sourceMappingURL=get-document-categories.handler.js.map