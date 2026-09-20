"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplacePluginTagsDTO = exports.FindTagsByPluginsDTO = exports.FindPluginsByTagsDTO = exports.BulkDeletePluginTagDTO = exports.BulkCreatePluginTagDTO = exports.FindPluginTagDTO = exports.UpdatePluginTagDTO = exports.CreatePluginTagDTO = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Data Transfer Object for creating plugin-tag relationships
 */
class CreatePluginTagDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO)) {
}
exports.CreatePluginTagDTO = CreatePluginTagDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Plugin ID to associate with the tag',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginTagDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Tag ID to associate with the plugin',
        format: 'uuid',
        example: '987fcdeb-51a2-43d1-9f4e-123456789abc'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tag ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Tag ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], CreatePluginTagDTO.prototype, "tagId", void 0);
/**
 * Data Transfer Object for updating plugin-tag relationships
 */
class UpdatePluginTagDTO extends (0, swagger_1.PartialType)(CreatePluginTagDTO) {
}
exports.UpdatePluginTagDTO = UpdatePluginTagDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Priority or weight of this tag association',
        minimum: 0,
        maximum: 100,
        example: 75
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Priority must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Priority must be at least 0' }),
    (0, class_validator_1.Max)(100, { message: 'Priority must be at most 100' }),
    (0, class_transformer_1.Type)(() => Number),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginTagDTO.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether this tag association is featured',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Is featured must be a boolean' }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePluginTagDTO.prototype, "isFeatured", void 0);
/**
 * Data Transfer Object for finding plugin-tag relationships
 */
class FindPluginTagDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO)) {
}
exports.FindPluginTagDTO = FindPluginTagDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Filter by plugin ID',
        format: 'uuid'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], FindPluginTagDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Filter by tag ID',
        format: 'uuid'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Tag ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], FindPluginTagDTO.prototype, "tagId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Filter by multiple plugin IDs',
        example: ['123e4567-e89b-12d3-a456-426614174000', '987fcdeb-51a2-43d1-9f4e-123456789abc']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Plugin IDs must be an array' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each plugin ID must be a valid UUID' }),
    (0, class_transformer_1.Transform)(({ value }) => Array.isArray(value) ? value : [value]),
    tslib_1.__metadata("design:type", Array)
], FindPluginTagDTO.prototype, "pluginIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Filter by multiple tag IDs',
        example: ['456e7890-f12b-34c5-d678-901234567def', 'abc12345-6789-def0-1234-56789abcdef0']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Tag IDs must be an array' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each tag ID must be a valid UUID' }),
    (0, class_transformer_1.Transform)(({ value }) => Array.isArray(value) ? value : [value]),
    tslib_1.__metadata("design:type", Array)
], FindPluginTagDTO.prototype, "tagIds", void 0);
/**
 * Data Transfer Object for bulk creating plugin-tag relationships
 */
class BulkCreatePluginTagDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO)) {
}
exports.BulkCreatePluginTagDTO = BulkCreatePluginTagDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Plugin ID to associate with multiple tags',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], BulkCreatePluginTagDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Array of tag IDs to associate with the plugin',
        example: ['456e7890-f12b-34c5-d678-901234567def', 'abc12345-6789-def0-1234-56789abcdef0']
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tag IDs are required' }),
    (0, class_validator_1.IsArray)({ message: 'Tag IDs must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Tag IDs array cannot be empty' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one tag ID is required' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each tag ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", Array)
], BulkCreatePluginTagDTO.prototype, "tagIds", void 0);
/**
 * Data Transfer Object for bulk deleting plugin-tag relationships
 */
class BulkDeletePluginTagDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO)) {
}
exports.BulkDeletePluginTagDTO = BulkDeletePluginTagDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Plugin ID to remove tags from',
        format: 'uuid'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], BulkDeletePluginTagDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Tag ID to remove from plugins',
        format: 'uuid'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Tag ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", String)
], BulkDeletePluginTagDTO.prototype, "tagId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Specific plugin-tag relationship IDs to delete',
        example: ['rel123-456-789', 'rel987-654-321']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'IDs must be an array' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", Array)
], BulkDeletePluginTagDTO.prototype, "ids", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Tag IDs to disassociate from a plugin',
        example: ['tag123-456-789', 'tag987-654-321']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Tag IDs must be an array' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each tag ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", Array)
], BulkDeletePluginTagDTO.prototype, "tagIds", void 0);
/**
 * Data Transfer Object for finding plugins by tags
 */
class FindPluginsByTagsDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO)) {
}
exports.FindPluginsByTagsDTO = FindPluginsByTagsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Array of tag IDs to filter plugins by',
        example: ['tag123-456-789', 'tag987-654-321']
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tag IDs are required' }),
    (0, class_validator_1.IsArray)({ message: 'Tag IDs must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Tag IDs array cannot be empty' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each tag ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", Array)
], FindPluginsByTagsDTO.prototype, "tagIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['any', 'all'],
        description: 'Match type - "any" for plugins with any of the tags, "all" for plugins with all tags',
        example: 'any',
        default: 'any'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['any', 'all'], { message: 'Match type must be "any" or "all"' }),
    tslib_1.__metadata("design:type", String)
], FindPluginsByTagsDTO.prototype, "matchType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Include tag information in the response',
        example: false,
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Include tags must be a boolean' }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    tslib_1.__metadata("design:type", Boolean)
], FindPluginsByTagsDTO.prototype, "includeTags", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Include plugin details in the response',
        example: true,
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Include plugin details must be a boolean' }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    tslib_1.__metadata("design:type", Boolean)
], FindPluginsByTagsDTO.prototype, "includePluginDetails", void 0);
/**
 * Data Transfer Object for finding tags by plugins
 */
class FindTagsByPluginsDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO)) {
}
exports.FindTagsByPluginsDTO = FindTagsByPluginsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Array of plugin IDs to filter tags by',
        example: ['plugin123-456-789', 'plugin987-654-321']
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin IDs are required' }),
    (0, class_validator_1.IsArray)({ message: 'Plugin IDs must be an array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Plugin IDs array cannot be empty' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each plugin ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", Array)
], FindTagsByPluginsDTO.prototype, "pluginIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Include plugin information in the response',
        example: false,
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Include plugins must be a boolean' }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    tslib_1.__metadata("design:type", Boolean)
], FindTagsByPluginsDTO.prototype, "includePlugins", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Include tag statistics (usage count, etc.)',
        example: false,
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Include statistics must be a boolean' }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    tslib_1.__metadata("design:type", Boolean)
], FindTagsByPluginsDTO.prototype, "includeStatistics", void 0);
/**
 * Data Transfer Object for replacing all tags for a plugin
 */
class ReplacePluginTagsDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO)) {
}
exports.ReplacePluginTagsDTO = ReplacePluginTagsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'New array of tag IDs to associate with the plugin (replaces all existing tags)',
        example: ['tag123-456-789', 'tag987-654-321']
    }),
    (0, class_validator_1.IsArray)({ message: 'Tag IDs must be an array' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: 'Each tag ID must be a valid UUID' }),
    tslib_1.__metadata("design:type", Array)
], ReplacePluginTagsDTO.prototype, "tagIds", void 0);
//# sourceMappingURL=plugin-tag.dto.js.map