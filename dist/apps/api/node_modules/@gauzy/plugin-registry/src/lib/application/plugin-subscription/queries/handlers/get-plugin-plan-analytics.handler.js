"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginPlanAnalyticsQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_plan_analytics_query_1 = require("../get-plugin-plan-analytics.query");
let GetPluginPlanAnalyticsQueryHandler = class GetPluginPlanAnalyticsQueryHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(query) {
        const { analyticsDto } = query;
        try {
            const dateFrom = analyticsDto.dateFrom ? new Date(analyticsDto.dateFrom) : undefined;
            const dateTo = analyticsDto.dateTo ? new Date(analyticsDto.dateTo) : undefined;
            return await this.pluginSubscriptionPlanService.getPlanAnalytics(analyticsDto.planId, dateFrom, dateTo);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get plugin plan analytics: ${error.message}`);
        }
    }
};
exports.GetPluginPlanAnalyticsQueryHandler = GetPluginPlanAnalyticsQueryHandler;
exports.GetPluginPlanAnalyticsQueryHandler = GetPluginPlanAnalyticsQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_plan_analytics_query_1.GetPluginPlanAnalyticsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], GetPluginPlanAnalyticsQueryHandler);
//# sourceMappingURL=get-plugin-plan-analytics.handler.js.map