"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginCategoriesHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_categories_query_1 = require("../get-plugin-categories.query");
let GetPluginCategoriesHandler = class GetPluginCategoriesHandler {
    constructor(pluginCategoryService) {
        this.pluginCategoryService = pluginCategoryService;
    }
    async execute(query) {
        const { options } = query;
        try {
            return await this.pluginCategoryService.findAll(options);
        }
        catch (error) {
            throw new Error(`Failed to get plugin categories: ${error.message}`);
        }
    }
};
exports.GetPluginCategoriesHandler = GetPluginCategoriesHandler;
exports.GetPluginCategoriesHandler = GetPluginCategoriesHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_categories_query_1.GetPluginCategoriesQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginCategoryService])
], GetPluginCategoriesHandler);
//# sourceMappingURL=get-plugin-categories-query.handler.js.map