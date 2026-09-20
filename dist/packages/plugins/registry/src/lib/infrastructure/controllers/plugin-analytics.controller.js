"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginAnalyticsController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const plugin_tag_service_1 = require("../../domain/services/plugin-tag.service");
/**
 * Plugin Analytics Controller
 * Provides analytics and statistics for various plugin-related data
 */
let PluginAnalyticsController = class PluginAnalyticsController {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
    }
    /**
     * Get plugin-tag analytics
     *
     * @param tenantId Optional tenant ID filter
     * @param organizationId Optional organization ID filter
     * @returns Plugin-tag analytics and statistics
     */
    async getTagAnalytics(tenantId, organizationId) {
        return this.pluginTagService.getStatistics(tenantId, organizationId);
    }
};
exports.PluginAnalyticsController = PluginAnalyticsController;
tslib_1.__decorate([
    (0, common_1.Get)('tags'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get plugin-tag analytics',
        description: 'Retrieve analytics and statistics about plugin-tag relationships including most popular tags and most tagged plugins.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'tenantId', required: false, description: 'Filter analytics by tenant ID' }),
    (0, swagger_1.ApiQuery)({ name: 'organizationId', required: false, description: 'Filter analytics by organization ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved plugin-tag analytics',
        schema: {
            type: 'object',
            properties: {
                totalRelationships: { type: 'number' },
                taggedPlugins: { type: 'number' },
                usedTags: { type: 'number' },
                popularTags: { type: 'array', items: { type: 'object' } },
                mostTaggedPlugins: { type: 'array', items: { type: 'object' } }
            }
        }
    }),
    tslib_1.__param(0, (0, common_1.Query)('tenantId', new common_1.ParseUUIDPipe({ optional: true }))),
    tslib_1.__param(1, (0, common_1.Query)('organizationId', new common_1.ParseUUIDPipe({ optional: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginAnalyticsController.prototype, "getTagAnalytics", null);
exports.PluginAnalyticsController = PluginAnalyticsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Analytics'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('plugins/analytics'),
    tslib_1.__metadata("design:paramtypes", [plugin_tag_service_1.PluginTagService])
], PluginAnalyticsController);
//# sourceMappingURL=plugin-analytics.controller.js.map