"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginSubscriptionPlanCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const update_plugin_subscription_plan_command_1 = require("../update-plugin-subscription-plan.command");
let UpdatePluginSubscriptionPlanCommandHandler = class UpdatePluginSubscriptionPlanCommandHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(command) {
        const { id, updateDto } = command;
        try {
            return await this.pluginSubscriptionPlanService.updatePlan(id, updateDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to update plugin subscription plan: ${error.message}`);
        }
    }
};
exports.UpdatePluginSubscriptionPlanCommandHandler = UpdatePluginSubscriptionPlanCommandHandler;
exports.UpdatePluginSubscriptionPlanCommandHandler = UpdatePluginSubscriptionPlanCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_subscription_plan_command_1.UpdatePluginSubscriptionPlanCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], UpdatePluginSubscriptionPlanCommandHandler);
//# sourceMappingURL=update-plugin-subscription-plan.handler.js.map