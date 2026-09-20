"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginSubscriptionPlanCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const delete_plugin_subscription_plan_command_1 = require("../delete-plugin-subscription-plan.command");
let DeletePluginSubscriptionPlanCommandHandler = class DeletePluginSubscriptionPlanCommandHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(command) {
        const { id } = command;
        try {
            await this.pluginSubscriptionPlanService.deletePlan(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to delete plugin subscription plan: ${error.message}`);
        }
    }
};
exports.DeletePluginSubscriptionPlanCommandHandler = DeletePluginSubscriptionPlanCommandHandler;
exports.DeletePluginSubscriptionPlanCommandHandler = DeletePluginSubscriptionPlanCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_subscription_plan_command_1.DeletePluginSubscriptionPlanCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], DeletePluginSubscriptionPlanCommandHandler);
//# sourceMappingURL=delete-plugin-subscription-plan.handler.js.map