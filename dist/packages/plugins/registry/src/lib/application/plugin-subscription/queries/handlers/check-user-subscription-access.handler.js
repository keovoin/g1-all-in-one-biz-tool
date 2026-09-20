"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckUserSubscriptionAccessQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const check_user_subscription_access_query_1 = require("../check-user-subscription-access.query");
let CheckUserSubscriptionAccessQueryHandler = class CheckUserSubscriptionAccessQueryHandler {
    constructor(subscriptionAccessService) {
        this.subscriptionAccessService = subscriptionAccessService;
    }
    /**
     * Execute user-specific subscription access check query
     * Validates if a specific user has access to the plugin
     */
    async execute(query) {
        const { pluginId, userId, tenantId, organizationId } = query;
        try {
            const details = await this.subscriptionAccessService.getSubscriptionDetails(pluginId, tenantId, organizationId, userId);
            return {
                hasAccess: details.hasAccess,
                accessLevel: details.accessLevel,
                canAssign: details.canAssign,
                requiresSubscription: details.requiresSubscription,
                subscription: details.subscription,
                canActivate: details.canActivate
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to check user subscription access: ${error.message}`);
        }
    }
};
exports.CheckUserSubscriptionAccessQueryHandler = CheckUserSubscriptionAccessQueryHandler;
exports.CheckUserSubscriptionAccessQueryHandler = CheckUserSubscriptionAccessQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(check_user_subscription_access_query_1.CheckUserSubscriptionAccessQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionAccessService])
], CheckUserSubscriptionAccessQueryHandler);
//# sourceMappingURL=check-user-subscription-access.handler.js.map