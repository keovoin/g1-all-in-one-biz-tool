"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyPluginPlanCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const copy_plugin_plan_command_1 = require("../copy-plugin-plan.command");
let CopyPluginPlanCommandHandler = class CopyPluginPlanCommandHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(command) {
        const { copyDto, tenantId, organizationId } = command;
        try {
            return await this.pluginSubscriptionPlanService.copyPlan(copyDto.sourcePlanId, copyDto.newName, copyDto.newDescription, copyDto.newPrice, tenantId, organizationId);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to copy plugin subscription plan: ${error.message}`);
        }
    }
};
exports.CopyPluginPlanCommandHandler = CopyPluginPlanCommandHandler;
exports.CopyPluginPlanCommandHandler = CopyPluginPlanCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(copy_plugin_plan_command_1.CopyPluginPlanCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], CopyPluginPlanCommandHandler);
//# sourceMappingURL=copy-plugin-plan.handler.js.map