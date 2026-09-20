"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSubscriptionsQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_subscriptions_query_1 = require("../get-plugin-subscriptions.query");
let GetPluginSubscriptionsQueryHandler = class GetPluginSubscriptionsQueryHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
    }
    async execute(query) {
        const { query: subscriptionQuery } = query;
        try {
            return this.pluginSubscriptionService.findAll({
                where: subscriptionQuery,
                relations: ['plugin', 'tenant', 'subscriber', 'pluginTenant'],
                order: { createdAt: 'DESC' }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get plugin subscriptions: ${error.message}`);
        }
    }
};
exports.GetPluginSubscriptionsQueryHandler = GetPluginSubscriptionsQueryHandler;
exports.GetPluginSubscriptionsQueryHandler = GetPluginSubscriptionsQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_subscriptions_query_1.GetPluginSubscriptionsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], GetPluginSubscriptionsQueryHandler);
//# sourceMappingURL=get-plugin-subscriptions.handler.js.map