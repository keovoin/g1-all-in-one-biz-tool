"use strict";
var UpdatePluginTagHandler_1, BulkUpdatePluginTagsHandler_1, UpdatePluginTagsPriorityHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginTagsPriorityHandler = exports.BulkUpdatePluginTagsHandler = exports.UpdatePluginTagHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const update_plugin_tag_command_1 = require("../update-plugin-tag.command");
/**
 * Handler for updating single plugin-tag relationship
 */
let UpdatePluginTagHandler = UpdatePluginTagHandler_1 = class UpdatePluginTagHandler {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
        this.logger = new common_1.Logger(UpdatePluginTagHandler_1.name);
    }
    /**
     * Execute the update plugin-tag command
     *
     * @param command - The update command
     * @returns Promise<IPluginTag>
     */
    async execute(command) {
        try {
            this.logger.log(`Updating plugin-tag relationship: ${command.id}`);
            await this.pluginTagService.update(command.id, command.input);
            this.logger.log(`Successfully updated plugin-tag relationship: ${command.id}`);
            return this.pluginTagService.findOneByIdString(command.id);
        }
        catch (error) {
            this.logger.error(`Failed to update plugin-tag relationship: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update plugin-tag relationship: ${error.message}`);
        }
    }
};
exports.UpdatePluginTagHandler = UpdatePluginTagHandler;
exports.UpdatePluginTagHandler = UpdatePluginTagHandler = UpdatePluginTagHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_tag_command_1.UpdatePluginTagCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], UpdatePluginTagHandler);
/**
 * Handler for bulk updating plugin-tag relationships
 */
let BulkUpdatePluginTagsHandler = BulkUpdatePluginTagsHandler_1 = class BulkUpdatePluginTagsHandler {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
        this.logger = new common_1.Logger(BulkUpdatePluginTagsHandler_1.name);
    }
    /**
     * Execute the bulk update plugin-tags command
     *
     * @param command - The bulk update command
     * @returns Promise<IPluginTag[]>
     */
    async execute(command) {
        try {
            this.logger.log(`Bulk updating plugin-tag relationships`);
            const results = await this.pluginTagService.bulkUpdate(command.updates);
            this.logger.log(`Successfully bulk updated ${results.length} plugin-tag relationships`);
            return results;
        }
        catch (error) {
            this.logger.error(`Failed to bulk update plugin-tag relationships: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to bulk update plugin-tag relationships: ${error.message}`);
        }
    }
};
exports.BulkUpdatePluginTagsHandler = BulkUpdatePluginTagsHandler;
exports.BulkUpdatePluginTagsHandler = BulkUpdatePluginTagsHandler = BulkUpdatePluginTagsHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_tag_command_1.BulkUpdatePluginTagsCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], BulkUpdatePluginTagsHandler);
/**
 * Handler for updating priority order of plugin tags
 */
let UpdatePluginTagsPriorityHandler = UpdatePluginTagsPriorityHandler_1 = class UpdatePluginTagsPriorityHandler {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
        this.logger = new common_1.Logger(UpdatePluginTagsPriorityHandler_1.name);
    }
    /**
     * Execute the update plugin tags priority command
     *
     * @param command - The priority update command
     * @returns Promise<IPluginTag[]>
     */
    async execute(command) {
        try {
            this.logger.log(`Updating plugin tags priority order`);
            const result = await this.pluginTagService.updateTagsPriority(command.priorities);
            this.logger.log(`Successfully updated plugin tags priority order: ${result.length} tags`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to update plugin tags priority: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update plugin tags priority: ${error.message}`);
        }
    }
};
exports.UpdatePluginTagsPriorityHandler = UpdatePluginTagsPriorityHandler;
exports.UpdatePluginTagsPriorityHandler = UpdatePluginTagsPriorityHandler = UpdatePluginTagsPriorityHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_tag_command_1.UpdatePluginTagsPriorityCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], UpdatePluginTagsPriorityHandler);
//# sourceMappingURL=update-plugin-tag.handler.js.map