"use strict";
var CreatePluginTagHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginTagHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const create_plugin_tag_command_1 = require("../create-plugin-tag.command");
/**
 * Handler for creating plugin-tag relationships
 */
let CreatePluginTagHandler = CreatePluginTagHandler_1 = class CreatePluginTagHandler {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
        this.logger = new common_1.Logger(CreatePluginTagHandler_1.name);
    }
    /**
     * Execute the create plugin-tag command
     *
     * @param command - The create command
     * @returns Promise<IPluginTag>
     */
    async execute(command) {
        try {
            this.logger.log(`Creating plugin-tag relationship: ${JSON.stringify(command.input)}`);
            const pluginTag = await this.pluginTagService.create(command.input);
            this.logger.log(`Successfully created plugin-tag relationship with ID: ${pluginTag.id}`);
            return pluginTag;
        }
        catch (error) {
            this.logger.error(`Failed to create plugin-tag relationship: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to create plugin-tag relationship: ${error.message}`);
        }
    }
};
exports.CreatePluginTagHandler = CreatePluginTagHandler;
exports.CreatePluginTagHandler = CreatePluginTagHandler = CreatePluginTagHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_plugin_tag_command_1.CreatePluginTagCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], CreatePluginTagHandler);
//# sourceMappingURL=create-plugin-tag.handler.js.map