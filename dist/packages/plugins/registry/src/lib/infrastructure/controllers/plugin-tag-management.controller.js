"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagPluginsController = exports.PluginRecommendationsController = exports.PluginTagsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@gauzy/common");
const core_1 = require("@gauzy/core");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const domain_1 = require("../../domain");
const shared_1 = require("../../shared");
/**
 * Plugin Tags Management Controller
 * Handles tag-related operations for plugins
 */
let PluginTagsController = class PluginTagsController {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
    }
    /**
     * Get all tags for a specific plugin
     */
    async getPluginTags(pluginId) {
        const result = await this.pluginTagService.findAll({
            where: { pluginId },
            relations: ['tag']
        });
        return result.items;
    }
    /**
     * Replace all tags for a plugin
     */
    async replacePluginTags(pluginId, replaceDto) {
        return this.pluginTagService.replacePluginTags(pluginId, replaceDto.tagIds, replaceDto.tenantId, replaceDto.organizationId);
    }
};
exports.PluginTagsController = PluginTagsController;
tslib_1.__decorate([
    (0, common_2.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tags for a plugin',
        description: 'Retrieve all tags associated with a specific plugin.'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Successfully retrieved plugin tags',
        type: domain_1.PluginTag,
        isArray: true
    }),
    (0, common_1.Public)(),
    tslib_1.__param(0, (0, common_2.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTagsController.prototype, "getPluginTags", null);
tslib_1.__decorate([
    (0, common_2.Put)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Replace all tags for a plugin',
        description: 'Remove all existing tags from a plugin and associate it with a new set of tags.'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: shared_1.ReplacePluginTagsDTO }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Successfully replaced plugin tags',
        type: domain_1.PluginTag,
        isArray: true
    }),
    tslib_1.__param(0, (0, common_2.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_2.Body)(new common_2.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.ReplacePluginTagsDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTagsController.prototype, "replacePluginTags", null);
exports.PluginTagsController = PluginTagsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugins - Tag Management'),
    (0, common_2.Controller)('plugins/:pluginId/tags'),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], PluginTagsController);
/**
 * Plugin Recommendations Controller
 * Handles plugin recommendation and similarity operations
 */
let PluginRecommendationsController = class PluginRecommendationsController {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
    }
    /**
     * Find similar plugins based on shared tags
     */
    async getPluginWithSimilar(pluginId, similar, limit) {
        const result = {};
        if (similar) {
            result.similar = await this.pluginTagService.findSimilarPlugins(pluginId, limit || 10);
        }
        return result;
    }
};
exports.PluginRecommendationsController = PluginRecommendationsController;
tslib_1.__decorate([
    (0, common_2.Get)('similar'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get plugin with optional similar plugins',
        description: 'Get plugin details with optional similar plugins based on shared tags.'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiQuery)({
        name: 'similar',
        required: false,
        description: 'Include similar plugins in response',
        type: 'boolean'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of similar plugins to return',
        type: 'number'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Successfully retrieved plugin information',
        schema: {
            type: 'object',
            properties: {
                similar: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            pluginId: { type: 'string', format: 'uuid' },
                            sharedTagsCount: { type: 'number' }
                        }
                    }
                }
            }
        }
    }),
    (0, common_1.Public)(),
    tslib_1.__param(0, (0, common_2.Param)('pluginId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_2.Query)('similar')),
    tslib_1.__param(2, (0, common_2.Query)('limit', new common_2.ParseIntPipe({ optional: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Boolean, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginRecommendationsController.prototype, "getPluginWithSimilar", null);
exports.PluginRecommendationsController = PluginRecommendationsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugins - Recommendations'),
    (0, common_2.Controller)('plugins/:pluginId'),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], PluginRecommendationsController);
/**
 * Tag Plugins Controller
 * Handles plugin operations for specific tags
 */
let TagPluginsController = class TagPluginsController {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
    }
    /**
     * Get all plugins for a specific tag
     */
    async getTagPlugins(tagId) {
        const result = await this.pluginTagService.findAll({
            where: { tagId },
            relations: ['plugin']
        });
        return result.items;
    }
};
exports.TagPluginsController = TagPluginsController;
tslib_1.__decorate([
    (0, common_2.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get plugins for a tag',
        description: 'Retrieve all plugins associated with a specific tag.'
    }),
    (0, swagger_1.ApiParam)({ name: 'tagId', description: 'Tag ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Successfully retrieved tag plugins',
        type: domain_1.PluginTag,
        isArray: true
    }),
    tslib_1.__param(0, (0, common_2.Param)('tagId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TagPluginsController.prototype, "getTagPlugins", null);
exports.TagPluginsController = TagPluginsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Tags - Plugin Management'),
    (0, common_2.Controller)('tags/:tagId/plugins'),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTagService])
], TagPluginsController);
//# sourceMappingURL=plugin-tag-management.controller.js.map