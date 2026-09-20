"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSubscriptionPlansByPluginIdQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_subscription_plans_by_plugin_id_query_1 = require("../get-plugin-subscription-plans-by-plugin-id.query");
let GetPluginSubscriptionPlansByPluginIdQueryHandler = class GetPluginSubscriptionPlansByPluginIdQueryHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(query) {
        const { pluginId, relations } = query;
        try {
            return await this.pluginSubscriptionPlanService.getByPluginId(pluginId, relations);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get plugin subscription plans: ${error.message}`);
        }
    }
};
exports.GetPluginSubscriptionPlansByPluginIdQueryHandler = GetPluginSubscriptionPlansByPluginIdQueryHandler;
exports.GetPluginSubscriptionPlansByPluginIdQueryHandler = GetPluginSubscriptionPlansByPluginIdQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_subscription_plans_by_plugin_id_query_1.GetPluginSubscriptionPlansByPluginIdQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], GetPluginSubscriptionPlansByPluginIdQueryHandler);
//# sourceMappingURL=get-plugin-subscription-plans-by-plugin-id.handler.js.map