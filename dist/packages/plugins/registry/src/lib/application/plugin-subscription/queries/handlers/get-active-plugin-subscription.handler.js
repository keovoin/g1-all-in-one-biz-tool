"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActivePluginSubscriptionQueryHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const get_active_plugin_subscription_query_1 = require("../get-active-plugin-subscription.query");
let GetActivePluginSubscriptionQueryHandler = class GetActivePluginSubscriptionQueryHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        /**
         * Active subscription statuses that qualify as "active"
         */
        this.ACTIVE_STATUSES = [
            contracts_1.PluginSubscriptionStatus.ACTIVE,
            contracts_1.PluginSubscriptionStatus.TRIAL,
            contracts_1.PluginSubscriptionStatus.PENDING
        ];
    }
    /**
     * Executes the query to retrieve an active plugin subscription
     * @param query - Query containing plugin, tenant, organization, and subscriber information
     * @returns The active subscription or null if not found/expired
     */
    async execute(query) {
        const { pluginId, tenantId, organizationId, subscriberId } = query;
        const whereConditions = this.buildWhereConditions(pluginId, tenantId, organizationId, subscriberId);
        const subscription = await this.findSubscription(whereConditions);
        return this.validateSubscription(subscription);
    }
    /**
     * Builds the where conditions for the subscription query
     */
    buildWhereConditions(pluginId, tenantId, organizationId, subscriberId) {
        const whereConditions = {
            pluginId,
            tenantId,
            status: (0, typeorm_1.In)(this.ACTIVE_STATUSES)
        };
        if (organizationId) {
            whereConditions.organizationId = organizationId;
        }
        if (subscriberId) {
            whereConditions.subscriberId = subscriberId;
        }
        return whereConditions;
    }
    /**
     * Fetches the most recent subscription matching the criteria
     */
    async findSubscription(whereConditions) {
        const { success, record } = await this.pluginSubscriptionService.findOneOrFailByOptions({
            where: whereConditions,
            order: { createdAt: 'DESC' },
            relations: ['plugin', 'plan', 'subscriber', 'parent']
        });
        if (!success) {
            throw new common_1.NotFoundException('No active plugin subscription found.');
        }
        return record;
    }
    /**
     * Validates that the subscription exists and is not expired
     */
    validateSubscription(subscription) {
        if (!subscription || subscription.isExpired) {
            return null;
        }
        return subscription;
    }
};
exports.GetActivePluginSubscriptionQueryHandler = GetActivePluginSubscriptionQueryHandler;
exports.GetActivePluginSubscriptionQueryHandler = GetActivePluginSubscriptionQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_active_plugin_subscription_query_1.GetActivePluginSubscriptionQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], GetActivePluginSubscriptionQueryHandler);
//# sourceMappingURL=get-active-plugin-subscription.handler.js.map