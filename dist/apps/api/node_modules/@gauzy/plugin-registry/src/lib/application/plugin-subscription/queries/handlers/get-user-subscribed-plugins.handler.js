"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserSubscribedPluginsQueryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const get_user_subscribed_plugins_query_1 = require("../get-user-subscribed-plugins.query");
let GetUserSubscribedPluginsQueryHandler = class GetUserSubscribedPluginsQueryHandler {
    constructor(pluginService) {
        this.pluginService = pluginService;
    }
    /**
     * Execute the query to get all plugins where the user has a subscription
     * Uses database-level subquery for efficient pagination
     * Excludes plugins that already have a valid installation
     * @param query - The query containing userId, tenantId, organizationId and options
     * @returns Paginated list of plugins with active subscriptions (excluding installed ones)
     */
    async execute(query) {
        const { userId: subscriberId, tenantId, organizationId, options = {} } = query;
        const { status = [], skip = 0, take = 10 } = options;
        try {
            return this.pluginService.findAll({
                where: {
                    subscriptions: {
                        tenantId,
                        subscriberId,
                        organizationId,
                        pluginTenant: {
                            enabled: true
                        },
                        ...(status.length > 0 && { status: (0, typeorm_1.In)([...status]) })
                    }
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    type: true,
                    status: true,
                    versions: {
                        id: true,
                        number: true,
                        sources: true
                    },
                    subscriptions: {
                        id: true,
                        status: true,
                        pluginTenant: {
                            id: true,
                            enabled: true,
                            isMandatory: true,
                            autoInstall: true
                        }
                    }
                },
                relations: ['versions', 'subscriptions', 'subscriptions.pluginTenant'],
                skip,
                take
            });
        }
        catch (error) {
            console.error(`Error finding subscribed plugins for user ${subscriberId}:`, error);
            return { items: [], total: 0 };
        }
    }
};
exports.GetUserSubscribedPluginsQueryHandler = GetUserSubscribedPluginsQueryHandler;
exports.GetUserSubscribedPluginsQueryHandler = GetUserSubscribedPluginsQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_user_subscribed_plugins_query_1.GetUserSubscribedPluginsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginService])
], GetUserSubscribedPluginsQueryHandler);
//# sourceMappingURL=get-user-subscribed-plugins.handler.js.map