"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActivePluginPlansQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_active_plugin_plans_query_1 = require("../get-active-plugin-plans.query");
let GetActivePluginPlansQueryHandler = class GetActivePluginPlansQueryHandler {
    constructor(pluginSubscriptionPlanService) {
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
    }
    async execute(query) {
        const { pluginId, type, relations } = query;
        try {
            return await this.pluginSubscriptionPlanService.getActivePlans(pluginId, type, relations);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get active plugin plans: ${error.message}`);
        }
    }
};
exports.GetActivePluginPlansQueryHandler = GetActivePluginPlansQueryHandler;
exports.GetActivePluginPlansQueryHandler = GetActivePluginPlansQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_active_plugin_plans_query_1.GetActivePluginPlansQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionPlanService])
], GetActivePluginPlansQueryHandler);
//# sourceMappingURL=get-active-plugin-plans.handler.js.map