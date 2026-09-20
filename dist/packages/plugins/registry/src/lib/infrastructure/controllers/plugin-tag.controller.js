"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTagController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@gauzy/common");
const core_1 = require("@gauzy/core");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const plugin_tag_entity_1 = require("../../domain/entities/plugin-tag.entity");
const plugin_tag_service_1 = require("../../domain/services/plugin-tag.service");
const plugin_tag_dto_1 = require("../../shared/dto/plugin-tag.dto");
/**
 * PluginTag Relationship Controller
 *
 * Pure RESTful API controller for managing plugin-tag relationship entities.
 * Focuses solely on CRUD operations for the plugin-tag relationship resource.
 *
 * Features:
 * - Standard CRUD operations for plugin-tag relationships
 * - Batch operations for bulk relationship management
 * - Query-based filtering and aggregation
 * - Multi-tenant support
 * - Full REST compliance
 *
 * Related Controllers:
 * - PluginTagsController: /plugins/{id}/tags (managing tags for a specific plugin)
 * - TagPluginsController: /tags/{id}/plugins (managing plugins for a specific tag)
 * - PluginRecommendationsController: /plugins/{id}?similar=true (plugin recommendations)
 */
let PluginTagController = class PluginTagController {
    constructor(pluginTagService) {
        this.pluginTagService = pluginTagService;
    }
    /**
     * Get all plugin-tag relationships with optional filtering
     *
     * @param options Pagination and filtering options
     * @param filter Query filters
     * @param aggregate Type of aggregation (count, etc.)
     * @returns Paginated list of plugin-tag relationships or redirects to count endpoint
     */
    async findAll(options, filter, aggregate) {
        // For count aggregation, users should use GET /plugin-tags?aggregate=count which internally calls the count method
        if (aggregate === 'count') {
            // Return count data in IPagination format for consistency
            const count = await this.pluginTagService.count({ where: filter });
            return {
                items: [],
                total: count
            };
        }
        return this.pluginTagService.findAll({
            ...options,
            where: filter
        });
    }
    /**
     * Get a specific plugin-tag relationship by ID
     *
     * @param id Plugin-tag relationship ID
     * @returns Plugin-tag relationship details
     */
    async findById(id) {
        return this.pluginTagService.findOneByIdString(id, {
            relations: ['plugin', 'tag']
        });
    }
    /**
     * Create a new plugin-tag relationship
     *
     * @param createDto Plugin-tag creation data
     * @returns Created plugin-tag relationship
     */
    async create(createDto) {
        return this.pluginTagService.create(createDto);
    }
    /**
     * Update a plugin-tag relationship
     *
     * @param id Plugin-tag relationship ID
     * @param updateDto Update data
     * @returns Updated plugin-tag relationship
     */
    async update(id, updateDto) {
        return this.pluginTagService.update(id, updateDto);
    }
    /**
     * Delete a plugin-tag relationship
     *
     * @param id Plugin-tag relationship ID
     * @returns Deletion result
     */
    async delete(id) {
        return this.pluginTagService.delete(id);
    }
    /**
     * Batch create plugin-tag relationships
     */
    async batchCreate(bulkCreateDto) {
        return this.pluginTagService.bulkCreate(bulkCreateDto);
    }
    /**
     * Batch delete plugin-tag relationships
     */
    async batchDelete(bulkDeleteDto) {
        const deleted = await this.pluginTagService.bulkDelete(bulkDeleteDto);
        return { deleted };
    }
};
exports.PluginTagController = PluginTagController;
tslib_1.__decorate([
    (0, common_2.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all plugin-tag relationships',
        description: 'Retrieve a paginated list of plugin-tag relationships with optional filtering by plugin, tag, or tenant/organization. Use ?aggregate=count for count aggregation.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Successfully retrieved plugin-tag relationships',
        type: plugin_tag_entity_1.PluginTag,
        isArray: true
    }),
    (0, swagger_1.ApiQuery)({ name: 'pluginId', required: false, description: 'Filter by plugin ID' }),
    (0, swagger_1.ApiQuery)({ name: 'tagId', required: false, description: 'Filter by tag ID' }),
    (0, swagger_1.ApiQuery)({ name: 'pluginIds', required: false, description: 'Filter by multiple plugin IDs (comma-separated)' }),
    (0, swagger_1.ApiQuery)({ name: 'tagIds', required: false, description: 'Filter by multiple tag IDs (comma-separated)' }),
    (0, swagger_1.ApiQuery)({
        name: 'aggregate',
        required: false,
        description: 'Type of aggregation: count (redirects to count endpoint)'
    }),
    (0, common_1.Public)(),
    tslib_1.__param(0, (0, common_2.Query)()),
    tslib_1.__param(1, (0, common_2.Query)(new common_2.ValidationPipe({ transform: true }))),
    tslib_1.__param(2, (0, common_2.Query)('aggregate')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, plugin_tag_dto_1.FindPluginTagDTO, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTagController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_2.Get)(':id'),
    (0, common_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get plugin-tag relationship by ID',
        description: 'Retrieve a specific plugin-tag relationship by its unique identifier.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin-tag relationship ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Successfully retrieved plugin-tag relationship',
        type: plugin_tag_entity_1.PluginTag
    }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.NOT_FOUND,
        description: 'Plugin-tag relationship not found'
    }),
    tslib_1.__param(0, (0, common_2.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTagController.prototype, "findById", null);
tslib_1.__decorate([
    (0, common_2.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create plugin-tag relationship',
        description: "Create a new relationship between a plugin and a tag. Validates that the relationship doesn't already exist."
    }),
    (0, swagger_1.ApiBody)({ type: plugin_tag_dto_1.CreatePluginTagDTO }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.CREATED,
        description: 'Successfully created plugin-tag relationship',
        type: plugin_tag_entity_1.PluginTag
    }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or relationship already exists'
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    tslib_1.__param(0, (0, common_2.Body)(new common_2.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [plugin_tag_dto_1.CreatePluginTagDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTagController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_2.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update plugin-tag relationship',
        description: 'Update properties of an existing plugin-tag relationship such as priority or featured status.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin-tag relationship ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: plugin_tag_dto_1.UpdatePluginTagDTO }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Successfully updated plugin-tag relationship',
        type: plugin_tag_entity_1.PluginTag
    }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.NOT_FOUND,
        description: 'Plugin-tag relationship not found'
    }),
    tslib_1.__param(0, (0, common_2.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_2.Body)(new common_2.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, plugin_tag_dto_1.UpdatePluginTagDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTagController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_2.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete plugin-tag relationship',
        description: 'Remove a specific plugin-tag relationship by its ID.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin-tag relationship ID', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Successfully deleted plugin-tag relationship'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.NOT_FOUND,
        description: 'Plugin-tag relationship not found'
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    tslib_1.__param(0, (0, common_2.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTagController.prototype, "delete", null);
tslib_1.__decorate([
    (0, common_2.Post)('batch'),
    (0, swagger_1.ApiOperation)({
        summary: 'Batch create plugin-tag relationships',
        description: 'Associate multiple tags with a single plugin in one operation. Skips existing relationships.'
    }),
    (0, swagger_1.ApiBody)({ type: plugin_tag_dto_1.BulkCreatePluginTagDTO }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.CREATED,
        description: 'Successfully created plugin-tag relationships',
        schema: {
            type: 'object',
            properties: {
                created: { type: 'number', description: 'Number of relationships created' },
                existing: { type: 'number', description: 'Number of relationships that already existed' },
                pluginTags: { type: 'array', items: { $ref: '#/components/schemas/PluginTag' } }
            }
        }
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    tslib_1.__param(0, (0, common_2.Body)(new common_2.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [plugin_tag_dto_1.BulkCreatePluginTagDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTagController.prototype, "batchCreate", null);
tslib_1.__decorate([
    (0, common_2.Delete)('batch'),
    (0, swagger_1.ApiOperation)({
        summary: 'Batch delete plugin-tag relationships',
        description: 'Remove multiple plugin-tag relationships based on various criteria such as plugin ID, tag ID, or specific relationship IDs.'
    }),
    (0, swagger_1.ApiBody)({ type: plugin_tag_dto_1.BulkDeletePluginTagDTO }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Successfully deleted plugin-tag relationships',
        schema: {
            type: 'object',
            properties: {
                deleted: { type: 'number', description: 'Number of relationships deleted' }
            }
        }
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    tslib_1.__param(0, (0, common_2.Body)(new common_2.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [plugin_tag_dto_1.BulkDeletePluginTagDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginTagController.prototype, "batchDelete", null);
exports.PluginTagController = PluginTagController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Tags'),
    (0, common_2.Controller)('plugin-tags'),
    tslib_1.__metadata("design:paramtypes", [plugin_tag_service_1.PluginTagService])
], PluginTagController);
//# sourceMappingURL=plugin-tag.controller.js.map