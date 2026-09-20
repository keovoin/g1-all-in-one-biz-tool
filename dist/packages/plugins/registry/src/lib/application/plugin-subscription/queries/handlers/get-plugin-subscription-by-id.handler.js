"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSubscriptionByIdQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_subscription_by_id_query_1 = require("../get-plugin-subscription-by-id.query");
let GetPluginSubscriptionByIdQueryHandler = class GetPluginSubscriptionByIdQueryHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
    }
    async execute(query) {
        const { id, relations } = query;
        try {
            const subscription = await this.pluginSubscriptionService.findOneByIdString(id, {
                relations: relations || ['plugin', 'pluginTenant', 'subscriber']
            });
            if (!subscription) {
                throw new common_1.NotFoundException(`Plugin subscription with ID ${id} not found`);
            }
            return subscription;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException(`Failed to get plugin subscription: ${error.message}`);
        }
    }
};
exports.GetPluginSubscriptionByIdQueryHandler = GetPluginSubscriptionByIdQueryHandler;
exports.GetPluginSubscriptionByIdQueryHandler = GetPluginSubscriptionByIdQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_subscription_by_id_query_1.GetPluginSubscriptionByIdQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], GetPluginSubscriptionByIdQueryHandler);
//# sourceMappingURL=get-plugin-subscription-by-id.handler.js.map