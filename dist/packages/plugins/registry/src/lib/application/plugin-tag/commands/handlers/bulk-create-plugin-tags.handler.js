"use strict";
var BulkCreatePluginTagsHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCreatePluginTagsHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const bulk_create_plugin_tags_command_1 = require("../bulk-create-plugin-tags.command");
/**
 * Handler for bulk creating plugin-tag relationships
 */
let BulkCreatePluginTagsHandler = BulkCreatePluginTagsHandler_1 = class BulkCreatePluginTagsHandler {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
        this.logger = new common_1.Logger(BulkCreatePluginTagsHandler_1.name);
    }
    /**
     * Execute the bulk create plugin-tags command
     *
     * @param command - The bulk create command
     * @returns Promise<IPluginTagBulkCreateResponse>
     */
    async execute(command) {
        try {
            this.logger.log(`Bulk creating plugin-tag relationships for plugin: ${command.input.pluginId}`);
            const result = await this.pluginTagService.bulkCreate(command.input);
            this.logger.log(`Successfully bulk created ${result.created} plugin-tag relationships, ${result.existing} already existed`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to bulk create plugin-tag relationships: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to bulk create plugin-tag relationships: ${error.message}`);
        }
    }
};
exports.BulkCreatePluginTagsHandler = BulkCreatePluginTagsHandler;
exports.BulkCreatePluginTagsHandler = BulkCreatePluginTagsHandler = BulkCreatePluginTagsHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(bulk_create_plugin_tags_command_1.BulkCreatePluginTagsCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], BulkCreatePluginTagsHandler);
//# sourceMappingURL=bulk-create-plugin-tags.handler.js.map