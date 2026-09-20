"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginSubscriptionCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const update_plugin_subscription_command_1 = require("../update-plugin-subscription.command");
let UpdatePluginSubscriptionCommandHandler = class UpdatePluginSubscriptionCommandHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
    }
    async execute(command) {
        const { id, updateDto } = command;
        try {
            return this.pluginSubscriptionService.update(id, updateDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to update plugin subscription: ${error.message}`);
        }
    }
};
exports.UpdatePluginSubscriptionCommandHandler = UpdatePluginSubscriptionCommandHandler;
exports.UpdatePluginSubscriptionCommandHandler = UpdatePluginSubscriptionCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_subscription_command_1.UpdatePluginSubscriptionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], UpdatePluginSubscriptionCommandHandler);
//# sourceMappingURL=update-plugin-subscription.handler.js.map