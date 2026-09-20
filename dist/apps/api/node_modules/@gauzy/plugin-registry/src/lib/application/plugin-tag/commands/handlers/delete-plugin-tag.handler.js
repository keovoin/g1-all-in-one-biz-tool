"use strict";
var DeletePluginTagHandler_1, BulkDeletePluginTagsHandler_1, ReplacePluginTagsHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplacePluginTagsHandler = exports.BulkDeletePluginTagsHandler = exports.DeletePluginTagHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const delete_plugin_tag_command_1 = require("../delete-plugin-tag.command");
/**
 * Handler for deleting single plugin-tag relationship
 */
let DeletePluginTagHandler = DeletePluginTagHandler_1 = class DeletePluginTagHandler {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
        this.logger = new common_1.Logger(DeletePluginTagHandler_1.name);
    }
    /**
     * Execute the delete plugin-tag command
     *
     * @param command - The delete command
     * @returns Promise<DeleteResult>
     */
    async execute(command) {
        try {
            this.logger.log(`Deleting plugin-tag relationship: ${command.id}`);
            const result = await this.pluginTagService.delete(command.id);
            this.logger.log(`Successfully deleted plugin-tag relationship: ${command.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to delete plugin-tag relationship: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete plugin-tag relationship: ${error.message}`);
        }
    }
};
exports.DeletePluginTagHandler = DeletePluginTagHandler;
exports.DeletePluginTagHandler = DeletePluginTagHandler = DeletePluginTagHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_tag_command_1.DeletePluginTagCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], DeletePluginTagHandler);
/**
 * Handler for bulk deleting plugin-tag relationships
 */
let BulkDeletePluginTagsHandler = BulkDeletePluginTagsHandler_1 = class BulkDeletePluginTagsHandler {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
        this.logger = new common_1.Logger(BulkDeletePluginTagsHandler_1.name);
    }
    /**
     * Execute the bulk delete plugin-tags command
     *
     * @param command - The bulk delete command
     * @returns Promise<number>
     */
    async execute(command) {
        try {
            this.logger.log(`Bulk deleting plugin-tag relationships`);
            const deletedCount = await this.pluginTagService.bulkDelete(command.input);
            this.logger.log(`Successfully bulk deleted ${deletedCount} plugin-tag relationships`);
            return deletedCount;
        }
        catch (error) {
            this.logger.error(`Failed to bulk delete plugin-tag relationships: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to bulk delete plugin-tag relationships: ${error.message}`);
        }
    }
};
exports.BulkDeletePluginTagsHandler = BulkDeletePluginTagsHandler;
exports.BulkDeletePluginTagsHandler = BulkDeletePluginTagsHandler = BulkDeletePluginTagsHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_tag_command_1.BulkDeletePluginTagsCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], BulkDeletePluginTagsHandler);
/**
 * Handler for replacing all tags for a plugin
 */
let ReplacePluginTagsHandler = ReplacePluginTagsHandler_1 = class ReplacePluginTagsHandler {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
        this.logger = new common_1.Logger(ReplacePluginTagsHandler_1.name);
    }
    /**
     * Execute the replace plugin tags command
     *
     * @param command - The replace command
     * @returns Promise<IPluginTag[]>
     */
    async execute(command) {
        try {
            this.logger.log(`Replacing tags for plugin: ${command.pluginId}`);
            const result = await this.pluginTagService.replacePluginTags(command.pluginId, command.tagIds, command.tenantId, command.organizationId);
            this.logger.log(`Successfully replaced tags for plugin ${command.pluginId}: ${result.length} tags`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to replace plugin tags: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to replace plugin tags: ${error.message}`);
        }
    }
};
exports.ReplacePluginTagsHandler = ReplacePluginTagsHandler;
exports.ReplacePluginTagsHandler = ReplacePluginTagsHandler = ReplacePluginTagsHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_tag_command_1.ReplacePluginTagsCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], ReplacePluginTagsHandler);
//# sourceMappingURL=delete-plugin-tag.handler.js.map