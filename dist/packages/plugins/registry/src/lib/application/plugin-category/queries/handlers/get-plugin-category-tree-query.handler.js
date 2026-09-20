"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginCategoryTreeHandler = void 0;
class GetPluginCategoryTreeHandler {
    constructor(pluginCategoryService) {
        this.pluginCategoryService = pluginCategoryService;
    }
    async execute(query) {
        const { options } = query;
        try {
            return await this.pluginCategoryService.getTree(options);
        }
        catch (error) {
            throw new Error(`Failed to get plugin category tree: ${error.message}`);
        }
    }
}
exports.GetPluginCategoryTreeHandler = GetPluginCategoryTreeHandler;
//# sourceMappingURL=get-plugin-category-tree-query.handler.js.map