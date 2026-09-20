"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginCategoryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_category_query_1 = require("../get-plugin-category.query");
let GetPluginCategoryHandler = class GetPluginCategoryHandler {
    constructor(pluginCategoryService) {
        this.pluginCategoryService = pluginCategoryService;
    }
    async execute(query) {
        const { id, relations } = query;
        try {
            const category = await this.pluginCategoryService.findOneByIdString(id, {
                relations: relations || ['parent', 'children', 'plugins']
            });
            if (!category) {
                throw new common_1.NotFoundException(`Plugin category with ID '${id}' not found`);
            }
            return category;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to get plugin category: ${error.message}`);
        }
    }
};
exports.GetPluginCategoryHandler = GetPluginCategoryHandler;
exports.GetPluginCategoryHandler = GetPluginCategoryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_category_query_1.GetPluginCategoryQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginCategoryService])
], GetPluginCategoryHandler);
//# sourceMappingURL=get-plugin-category-query.handler.js.map