"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSubscriptionPlanByIdQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_subscription_plan_by_id_query_1 = require("../get-plugin-subscription-plan-by-id.query");
let GetPluginSubscriptionPlanByIdQueryHandler = class GetPluginSubscriptionPlanByIdQueryHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(query) {
        const { id, relations } = query;
        try {
            return await this.pluginSubscriptionPlanService.getPlanById(id, relations);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get plugin subscription plan: ${error.message}`);
        }
    }
};
exports.GetPluginSubscriptionPlanByIdQueryHandler = GetPluginSubscriptionPlanByIdQueryHandler;
exports.GetPluginSubscriptionPlanByIdQueryHandler = GetPluginSubscriptionPlanByIdQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_subscription_plan_by_id_query_1.GetPluginSubscriptionPlanByIdQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], GetPluginSubscriptionPlanByIdQueryHandler);
//# sourceMappingURL=get-plugin-subscription-plan-by-id.handler.js.map