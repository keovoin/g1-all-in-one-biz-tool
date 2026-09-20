"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPluginSubscriptionPlansQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const list_plugin_subscription_plans_query_1 = require("../list-plugin-subscription-plans.query");
let ListPluginSubscriptionPlansQueryHandler = class ListPluginSubscriptionPlansQueryHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(query) {
        const { queryDto } = query;
        try {
            // Convert DTO to find input format
            const findInput = {
                pluginId: queryDto.pluginId,
                type: queryDto.type,
                billingPeriod: queryDto.billingPeriod,
                isActive: queryDto.isActive,
                isPopular: queryDto.isPopular,
                isRecommended: queryDto.isRecommended
            };
            return await this.pluginSubscriptionPlanService.searchPlans(findInput);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to list plugin subscription plans: ${error.message}`);
        }
    }
};
exports.ListPluginSubscriptionPlansQueryHandler = ListPluginSubscriptionPlansQueryHandler;
exports.ListPluginSubscriptionPlansQueryHandler = ListPluginSubscriptionPlansQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(list_plugin_subscription_plans_query_1.ListPluginSubscriptionPlansQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], ListPluginSubscriptionPlansQueryHandler);
//# sourceMappingURL=list-plugin-subscription-plans.handler.js.map