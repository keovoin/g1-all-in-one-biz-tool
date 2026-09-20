"use strict";
var PluginSubscriptionSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionSubscriber = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const plugin_subscription_entity_1 = require("../../domain/entities/plugin-subscription.entity");
let PluginSubscriptionSubscriber = PluginSubscriptionSubscriber_1 = class PluginSubscriptionSubscriber {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(PluginSubscriptionSubscriber_1.name);
        dataSource.subscribers.push(this);
    }
    /**
     * Indicates that this subscriber only listens to PluginSubscription events
     */
    listenTo() {
        return plugin_subscription_entity_1.PluginSubscription;
    }
    /**
     * Called after entity is loaded from the database
     * Computes dynamic properties and validates subscription state
     */
    async afterLoad(entity) {
        if (!entity || !entity.id) {
            return;
        }
        try {
            this.logger.debug(`Processing afterLoad for plugin subscription: ${entity.id}`);
            // Auto-update status if expired
            this.updateStatusIfExpired(entity);
            // Log subscription state for debugging
            this.logSubscriptionState(entity);
        }
        catch (error) {
            this.logger.error(`Error in afterLoad for plugin subscription ${entity.id}: ${error.message}`, error.stack);
        }
    }
    /**
     * Updates subscription status to EXPIRED if end date has passed
     * This ensures status is accurate when entity is loaded
     */
    updateStatusIfExpired(entity) {
        if (entity.endDate &&
            entity.endDate <= new Date() &&
            entity.status !== contracts_1.PluginSubscriptionStatus.EXPIRED &&
            entity.status !== contracts_1.PluginSubscriptionStatus.CANCELLED) {
            this.logger.debug(`Subscription ${entity.id} has expired, updating status`);
            // Note: This updates the in-memory entity only
            // Actual persistence should be handled by a scheduled job
            entity.status = contracts_1.PluginSubscriptionStatus.EXPIRED;
        }
    }
    /**
     * Logs subscription state information for monitoring and debugging
     */
    logSubscriptionState(entity) {
        const state = {
            id: entity.id,
            status: entity.status,
            scope: entity.scope,
            subscriberId: entity.subscriberId,
            isActive: entity.isSubscriptionActive,
            isExpired: entity.isExpired,
            isInTrial: entity.isInTrial,
            isExpiringSoon: entity.isExpiringSoon,
            daysUntilExpiration: entity.daysUntilExpiration,
            nextBillingDate: entity.nextBillingDate,
            isBillingDue: entity.isBillingDue
        };
        this.logger.debug(`Subscription state for ${entity.id}: ${JSON.stringify(state)}`);
    }
};
exports.PluginSubscriptionSubscriber = PluginSubscriptionSubscriber;
exports.PluginSubscriptionSubscriber = PluginSubscriptionSubscriber = PluginSubscriptionSubscriber_1 = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], PluginSubscriptionSubscriber);
//# sourceMappingURL=plugin-subscription.subscriber.js.map