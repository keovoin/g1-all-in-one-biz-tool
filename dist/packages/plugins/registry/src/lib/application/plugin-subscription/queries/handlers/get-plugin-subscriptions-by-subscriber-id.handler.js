"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSubscriptionsBySubscriberIdQueryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_subscriptions_by_subscriber_id_query_1 = require("../get-plugin-subscriptions-by-subscriber-id.query");
let GetPluginSubscriptionsBySubscriberIdQueryHandler = class GetPluginSubscriptionsBySubscriberIdQueryHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
    }
    async execute(query) {
        const { subscriberId, relations } = query;
        try {
            // Build where condition for finding subscriptions by subscriber ID
            const whereCondition = {
                subscriberId
            };
            // Find all subscriptions for the specified subscriber
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
            console.error(`Error finding plugin subscriptions by subscriber ID ${subscriberId}:`, error);
            return { items: [], total: 0 };
        }
    }
};
exports.GetPluginSubscriptionsBySubscriberIdQueryHandler = GetPluginSubscriptionsBySubscriberIdQueryHandler;
exports.GetPluginSubscriptionsBySubscriberIdQueryHandler = GetPluginSubscriptionsBySubscriberIdQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_subscriptions_by_subscriber_id_query_1.GetPluginSubscriptionsBySubscriberIdQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], GetPluginSubscriptionsBySubscriberIdQueryHandler);
//# sourceMappingURL=get-plugin-subscriptions-by-subscriber-id.handler.js.map