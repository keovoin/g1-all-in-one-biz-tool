"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTag = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const plugin_entity_1 = require("./plugin.entity");
/**
 * PluginTag Entity
 *
 * Represents the many-to-many relationship between plugins and tags.
 * This entity allows plugins to be categorized and organized using a flexible tagging system.
 *
 * Business Logic:
 * - A plugin can have multiple tags
 * - A tag can be associated with multiple plugins
 * - Tags help in plugin discovery, categorization, and filtering
 * - Supports tenant and organization-level isolation
 * - Maintains referential integrity with cascade delete operations
 *
 * Use Cases:
 * - Plugin marketplace filtering and search
 * - Plugin categorization and organization
 * - Plugin recommendation systems
 * - Analytics and reporting on plugin usage patterns
 */
let PluginTag = class PluginTag extends core_1.TenantOrganizationBaseEntity {
};
exports.PluginTag = PluginTag;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => plugin_entity_1.Plugin,
        description: 'The plugin associated with this tag relationship'
    }),
    (0, core_1.MultiORMManyToOne)(() => plugin_entity_1.Plugin, (plugin) => plugin.pluginTags, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginTag.prototype, "plugin", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'ID reference to the plugin',
        format: 'uuid'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin ID must be a valid UUID' }),
    (0, typeorm_1.RelationId)((pluginTag) => pluginTag.plugin),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: false, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PluginTag.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => core_1.Tag,
        description: 'The tag associated with this plugin relationship'
    }),
    (0, core_1.MultiORMManyToOne)(() => core_1.Tag, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginTag.prototype, "tag", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'ID reference to the tag',
        format: 'uuid'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tag ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Tag ID must be a valid UUID' }),
    (0, typeorm_1.RelationId)((pluginTag) => pluginTag.tag),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: false, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PluginTag.prototype, "tagId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Date,
        description: 'Date when the tag was applied to the plugin'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({
        type: (0, config_1.isBetterSqlite3)() ? 'text' : 'timestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP'
    }),
    tslib_1.__metadata("design:type", Date)
], PluginTag.prototype, "appliedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'ID of the user who applied the tag',
        format: 'uuid'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Applied by must be a valid UUID' }),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginTag.prototype, "appliedById", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Priority or weight of this tag association (higher values = higher priority)',
        minimum: 0,
        maximum: 100,
        default: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({
        type: 'integer',
        nullable: true,
        default: 50,
        comment: 'Priority weight for tag association (0-100, higher = more important)'
    }),
    tslib_1.__metadata("design:type", Number)
], PluginTag.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether this tag association is featured',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({
        type: 'boolean',
        default: false,
        comment: 'Indicates if this tag association should be featured/highlighted'
    }),
    tslib_1.__metadata("design:type", Boolean)
], PluginTag.prototype, "isFeatured", void 0);
exports.PluginTag = PluginTag = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('plugin_tags'),
    (0, typeorm_1.Index)(['pluginId', 'tagId'], { unique: true }),
    (0, typeorm_1.Index)(['pluginId', 'tenantId', 'organizationId']),
    (0, typeorm_1.Index)(['tagId', 'tenantId', 'organizationId'])
], PluginTag);
//# sourceMappingURL=plugin-tag.entity.js.map