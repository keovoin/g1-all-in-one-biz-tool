"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetExpiringSubscriptionsQueryHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const get_expiring_subscriptions_query_1 = require("../get-expiring-subscriptions.query");
let GetExpiringSubscriptionsQueryHandler = class GetExpiringSubscriptionsQueryHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
    }
    async execute(query) {
        const { days } = query;
        try {
            // Calculate date range for expiring subscriptions
            const today = new Date();
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + days);
            // Set time to end of day for futureDate to include full day
            futureDate.setHours(23, 59, 59, 999);
            // Find subscriptions that expire within the specified number of days
            const expiringSubscriptions = await this.pluginSubscriptionService.find({
                where: {
                    // Only active and trial subscriptions that have an end date
                    status: (0, typeorm_1.In)([
                        contracts_1.PluginSubscriptionStatus.ACTIVE,
                        contracts_1.PluginSubscriptionStatus.TRIAL,
                        contracts_1.PluginSubscriptionStatus.PENDING
                    ]),
                    endDate: (0, typeorm_1.Between)(today, futureDate)
                },
                relations: ['plugin', 'plan', 'subscriber', 'pluginTenant'],
                order: {
                    endDate: 'ASC'
                }
            });
            // Also find trial subscriptions that are expiring within the specified period
            const { items: expiringTrialSubscriptions } = await this.pluginSubscriptionService.findAll({
                where: {
                    status: contracts_1.PluginSubscriptionStatus.TRIAL,
                    trialEndDate: (0, typeorm_1.Between)(today, futureDate)
                },
                relations: ['plugin', 'plan', 'subscriber', 'pluginTenant'],
                order: {
                    trialEndDate: 'ASC'
                }
            });
            // Combine both results and remove duplicates based on subscription ID
            const allExpiringSubscriptions = [...(expiringSubscriptions || []), ...(expiringTrialSubscriptions || [])];
            const uniqueSubscriptions = allExpiringSubscriptions.filter((subscription, index, self) => index === self.findIndex((s) => s.id === subscription.id));
            // Sort by expiration date (earliest first)
            uniqueSubscriptions.sort((a, b) => {
                const aExpDate = a.endDate || a.trialEndDate;
                const bExpDate = b.endDate || b.trialEndDate;
                if (!aExpDate && !bExpDate)
                    return 0;
                if (!aExpDate)
                    return 1;
                if (!bExpDate)
                    return -1;
                return aExpDate.getTime() - bExpDate.getTime();
            });
            return uniqueSubscriptions;
        }
        catch (error) {
            // Log error and return empty array instead of throwing
            console.error('Error finding expiring subscriptions:', error);
            return [];
        }
    }
};
exports.GetExpiringSubscriptionsQueryHandler = GetExpiringSubscriptionsQueryHandler;
exports.GetExpiringSubscriptionsQueryHandler = GetExpiringSubscriptionsQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_expiring_subscriptions_query_1.GetExpiringSubscriptionsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], GetExpiringSubscriptionsQueryHandler);
//# sourceMappingURL=get-expiring-subscriptions.handler.js.map