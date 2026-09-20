"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginCategory = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const plugin_setting_entity_1 = require("./plugin-setting.entity");
const plugin_entity_1 = require("./plugin.entity");
let PluginCategory = class PluginCategory extends core_1.TenantOrganizationBaseEntity {
    /*
     * Domain Methods
     */
    /**
     * Check if this category is a root category (has no parent)
     */
    isRoot() {
        return !this.parentId;
    }
    /**
     * Check if this category has children
     */
    hasChildren() {
        return this.children && this.children.length > 0;
    }
    /**
     * Check if this category can be deleted
     */
    canBeDeleted() {
        return !this.hasChildren() && (!this.plugins || this.plugins.length === 0);
    }
};
exports.PluginCategory = PluginCategory;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Category name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Category name is required' }),
    (0, class_validator_1.IsString)({ message: 'Category name must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'Category name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Category name must not exceed 100 characters' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], PluginCategory.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Category description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Description must not exceed 500 characters' }),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginCategory.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Category slug for URL-friendly identification' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Category slug is required' }),
    (0, class_validator_1.IsString)({ message: 'Slug must be a string' }),
    (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' }),
    (0, class_validator_1.MinLength)(2, { message: 'Slug must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Slug must not exceed 100 characters' }),
    (0, core_1.MultiORMColumn)({ unique: true }),
    tslib_1.__metadata("design:type", String)
], PluginCategory.prototype, "slug", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Category color for UI representation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Color must be a string' }),
    (0, class_validator_1.Matches)(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: 'Color must be a valid hex color' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginCategory.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Category icon identifier' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Icon must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Icon identifier must not exceed 50 characters' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginCategory.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Display order for sorting' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Order must be a number' }),
    (0, core_1.MultiORMColumn)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], PluginCategory.prototype, "order", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Category metadata (JSON object)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be a valid JSON object' }),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], PluginCategory.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Parent category ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((category) => category.parent),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PluginCategory.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => PluginCategory, description: 'Parent category' }),
    (0, typeorm_1.TreeParent)(),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginCategory.prototype, "parent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [PluginCategory], description: 'Child categories' }),
    (0, typeorm_1.TreeChildren)({ cascade: true }),
    tslib_1.__metadata("design:type", Object)
], PluginCategory.prototype, "children", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, description: 'Plugins in this category' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_entity_1.Plugin, (plugin) => plugin.category, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Object)
], PluginCategory.prototype, "plugins", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, description: 'Default settings for plugins in this category' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_setting_entity_1.PluginSetting, (setting) => setting.category, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], PluginCategory.prototype, "settings", void 0);
exports.PluginCategory = PluginCategory = tslib_1.__decorate([
    (0, typeorm_1.Tree)('closure-table'),
    (0, core_1.MultiORMEntity)('plugin_categories')
], PluginCategory);
//# sourceMappingURL=plugin-category.entity.js.map