"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPluginAccessQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const check_plugin_access_query_1 = require("../check-plugin-access.query");
let CheckPluginAccessQueryHandler = class CheckPluginAccessQueryHandler {
    constructor(pluginSubscriptionAccessService) {
        this.pluginSubscriptionAccessService = pluginSubscriptionAccessService;
    }
    async execute(query) {
        const { accessCheckDto, tenantId, organizationId } = query;
        try {
            // Use centralized subscription access service
            const hasAccess = await this.pluginSubscriptionAccessService.validatePluginAccess(accessCheckDto.pluginId, tenantId, organizationId, accessCheckDto.subscriberId);
            let subscription = null;
            if (hasAccess) {
                subscription = await this.pluginSubscriptionAccessService.findApplicableSubscription(accessCheckDto.pluginId, tenantId, organizationId, accessCheckDto.subscriberId);
            }
            return { hasAccess, subscription };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to check plugin access: ${error.message}`);
        }
    }
};
exports.CheckPluginAccessQueryHandler = CheckPluginAccessQueryHandler;
exports.CheckPluginAccessQueryHandler = CheckPluginAccessQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(check_plugin_access_query_1.CheckPluginAccessQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionAccessService])
], CheckPluginAccessQueryHandler);
//# sourceMappingURL=check-plugin-access.handler.js.map