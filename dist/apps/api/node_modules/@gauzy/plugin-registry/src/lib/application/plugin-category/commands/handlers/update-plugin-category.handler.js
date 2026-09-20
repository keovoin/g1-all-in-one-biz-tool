"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginCategoryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const update_plugin_category_command_1 = require("../update-plugin-category.command");
let UpdatePluginCategoryHandler = class UpdatePluginCategoryHandler {
    constructor(pluginCategoryService) {
        this.pluginCategoryService = pluginCategoryService;
    }
    async execute(command) {
        const { id, input } = command;
        try {
            // Check if category exists
            const existingCategory = await this.pluginCategoryService.findOneByIdString(id);
            if (!existingCategory) {
                throw new common_1.NotFoundException(`Plugin category with ID '${id}' not found`);
            }
            // Validate slug uniqueness if it's being changed
            if (input.slug && input.slug !== existingCategory.slug) {
                const categoryWithSlug = await this.pluginCategoryService.findOneByWhereOptions({
                    slug: input.slug,
                    tenantId: existingCategory.tenantId,
                    organizationId: existingCategory.organizationId
                });
                if (categoryWithSlug && categoryWithSlug.id !== id) {
                    throw new common_1.ConflictException(`Plugin category with slug '${input.slug}' already exists`);
                }
            }
            // Validate parent category if provided
            if (input.parentId) {
                const parentCategory = await this.pluginCategoryService.findOneByIdString(input.parentId);
                if (!parentCategory) {
                    throw new common_1.BadRequestException(`Parent category with ID '${input.parentId}' not found`);
                }
                // Prevent setting self as parent
                if (input.parentId === id) {
                    throw new common_1.BadRequestException('Category cannot be its own parent');
                }
                // Prevent circular references (basic check)
                const isDescendant = await this.pluginCategoryService.isDescendantOf(input.parentId, id);
                if (isDescendant) {
                    throw new common_1.BadRequestException('Cannot set a descendant category as parent (circular reference)');
                }
            }
            // Update the category using domain service
            return this.pluginCategoryService.update(id, input);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update plugin category: ${error.message}`);
        }
    }
};
exports.UpdatePluginCategoryHandler = UpdatePluginCategoryHandler;
exports.UpdatePluginCategoryHandler = UpdatePluginCategoryHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_category_command_1.UpdatePluginCategoryCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginCategoryService])
], UpdatePluginCategoryHandler);
//# sourceMappingURL=update-plugin-category.handler.js.map