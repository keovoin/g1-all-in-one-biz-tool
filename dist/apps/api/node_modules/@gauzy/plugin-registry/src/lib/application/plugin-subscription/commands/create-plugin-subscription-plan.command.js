"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginSubscriptionPlanCommand = void 0;
class CreatePluginSubscriptionPlanCommand {
    constructor(createDto, tenantId, organizationId, userId) {
        this.createDto = createDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.CreatePluginSubscriptionPlanCommand = CreatePluginSubscriptionPlanCommand;
CreatePluginSubscriptionPlanCommand.type = '[Plugin Subscription Plan] Create';
//# sourceMappingURL=create-plugin-subscription-plan.command.js.map