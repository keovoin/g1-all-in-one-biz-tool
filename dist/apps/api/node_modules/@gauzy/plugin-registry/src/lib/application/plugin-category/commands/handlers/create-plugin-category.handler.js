"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginCategoryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const create_plugin_category_command_1 = require("../create-plugin-category.command");
let CreatePluginCategoryHandler = class CreatePluginCategoryHandler {
    constructor(pluginCategoryService) {
        this.pluginCategoryService = pluginCategoryService;
    }
    async execute(command) {
        const { input } = command;
        try {
            // Validate slug uniqueness
            const { success } = await this.pluginCategoryService.findOneOrFailByWhereOptions({
                slug: input.slug
            });
            if (success) {
                throw new common_1.ConflictException(`Plugin category with slug '${input.slug}' already exists`);
            }
            // Validate parent category if provided
            if (input.parentId) {
                const { success } = await this.pluginCategoryService.findOneOrFailByIdString(input.parentId);
                if (!success) {
                    throw new common_1.BadRequestException(`Parent category with ID '${input.parentId}' not found`);
                }
            }
            // Create the category using domain service
            return this.pluginCategoryService.save(input);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to create plugin category: ${error.message}`);
        }
    }
};
exports.CreatePluginCategoryHandler = CreatePluginCategoryHandler;
exports.CreatePluginCategoryHandler = CreatePluginCategoryHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_plugin_category_command_1.CreatePluginCategoryCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginCategoryService])
], CreatePluginCategoryHandler);
//# sourceMappingURL=create-plugin-category.handler.js.map