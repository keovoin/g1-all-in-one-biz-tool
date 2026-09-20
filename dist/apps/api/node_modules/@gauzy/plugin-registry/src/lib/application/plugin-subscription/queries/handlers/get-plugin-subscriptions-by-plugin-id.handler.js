"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSubscriptionsByPluginIdQueryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_subscriptions_by_plugin_id_query_1 = require("../get-plugin-subscriptions-by-plugin-id.query");
let GetPluginSubscriptionsByPluginIdQueryHandler = class GetPluginSubscriptionsByPluginIdQueryHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
    }
    async execute(query) {
        const { pluginId, relations } = query;
        try {
            // Build where condition for finding subscriptions by plugin ID
            const whereCondition = {
                pluginId
            };
            // Find all subscriptions for the specified plugin
            return this.pluginSubscriptionService.findAll({
                where: whereCondition,
                relations: relations || ['plugin', 'plan', 'subscriber', 'pluginTenant'],
                order: {
                    createdAt: 'DESC'
                }
            });
        }
        catch (error) {
            // Log error and return empty array instead of throwing
            console.error(`Error finding plugin subscriptions by plugin ID ${pluginId}:`, error);
            return { items: [], total: 0 };
        }
    }
};
exports.GetPluginSubscriptionsByPluginIdQueryHandler = GetPluginSubscriptionsByPluginIdQueryHandler;
exports.GetPluginSubscriptionsByPluginIdQueryHandler = GetPluginSubscriptionsByPluginIdQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_subscriptions_by_plugin_id_query_1.GetPluginSubscriptionsByPluginIdQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], GetPluginSubscriptionsByPluginIdQueryHandler);
//# sourceMappingURL=get-plugin-subscriptions-by-plugin-id.handler.js.map