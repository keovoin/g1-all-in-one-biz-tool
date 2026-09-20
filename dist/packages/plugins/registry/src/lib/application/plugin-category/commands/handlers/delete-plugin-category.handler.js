"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginCategoryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const delete_plugin_category_command_1 = require("../delete-plugin-category.command");
let DeletePluginCategoryHandler = class DeletePluginCategoryHandler {
    constructor(pluginCategoryService) {
        this.pluginCategoryService = pluginCategoryService;
    }
    async execute(command) {
        const { id } = command;
        try {
            // Check if category exists
            const existingCategory = await this.pluginCategoryService.findOneByIdString(id, {
                relations: ['children', 'plugins']
            });
            if (!existingCategory) {
                throw new common_1.NotFoundException(`Plugin category with ID '${id}' not found`);
            }
            // Check if category has children
            if (existingCategory.children && existingCategory.children.length > 0) {
                throw new common_1.BadRequestException(`Cannot delete category '${existingCategory.name}' because it has ${existingCategory.children.length} child categories`);
            }
            // Check if category has plugins assigned
            if (existingCategory.plugins && existingCategory.plugins.length > 0) {
                throw new common_1.BadRequestException(`Cannot delete category '${existingCategory.name}' because it has ${existingCategory.plugins.length} plugins assigned`);
            }
            // Delete the category using domain service
            return await this.pluginCategoryService.delete(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete plugin category: ${error.message}`);
        }
    }
};
exports.DeletePluginCategoryHandler = DeletePluginCategoryHandler;
exports.DeletePluginCategoryHandler = DeletePluginCategoryHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_category_command_1.DeletePluginCategoryCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginCategoryService])
], DeletePluginCategoryHandler);
//# sourceMappingURL=delete-plugin-category.handler.js.map