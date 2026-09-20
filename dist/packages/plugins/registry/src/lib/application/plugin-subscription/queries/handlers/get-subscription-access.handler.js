"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubscriptionAccessQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_subscription_access_query_1 = require("../get-subscription-access.query");
let GetSubscriptionAccessQueryHandler = class GetSubscriptionAccessQueryHandler {
    constructor(subscriptionAccessService) {
        this.subscriptionAccessService = subscriptionAccessService;
    }
    /**
     * Execute subscription access check query
     * Returns detailed access information including permission to assign
     */
    async execute(query) {
        const { pluginId, tenantId, organizationId, userId } = query;
        try {
            return this.subscriptionAccessService.getSubscriptionDetails(pluginId, tenantId, organizationId, userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get subscription access: ${error.message}`);
        }
    }
};
exports.GetSubscriptionAccessQueryHandler = GetSubscriptionAccessQueryHandler;
exports.GetSubscriptionAccessQueryHandler = GetSubscriptionAccessQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_subscription_access_query_1.GetSubscriptionAccessQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionAccessService])
], GetSubscriptionAccessQueryHandler);
//# sourceMappingURL=get-subscription-access.handler.js.map