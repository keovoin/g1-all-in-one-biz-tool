"use strict";
var Plugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const plugin_category_entity_1 = require("./plugin-category.entity");
const plugin_setting_entity_1 = require("./plugin-setting.entity");
const plugin_subscription_plan_entity_1 = require("./plugin-subscription-plan.entity");
const plugin_subscription_entity_1 = require("./plugin-subscription.entity");
const plugin_tag_entity_1 = require("./plugin-tag.entity");
const plugin_tenant_entity_1 = require("./plugin-tenant.entity");
const plugin_version_entity_1 = require("./plugin-version.entity");
let Plugin = Plugin_1 = class Plugin extends core_1.BaseEntity {
    // Business Logic Methods
    /**
     * Check if the plugin is published and available for installation
     */
    isPublished() {
        return this.status === contracts_1.PluginStatus.ACTIVE && this.isActive === true;
    }
    /**
     * Get the latest version of the plugin
     */
    getLatestVersion() {
        if (!this.versions || this.versions.length === 0) {
            return undefined;
        }
        // Sort versions by release date (most recent first)
        return this.versions
            .filter((version) => version.releaseDate)
            .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())[0];
    }
    /**
     * Check if the plugin requires subscription for usage
     */
    requiresPayment() {
        return this.requiresSubscription === true;
    }
    /**
     * Check if the plugin has been uploaded by a specific user
     */
    isUploadedBy(userId) {
        return this.uploadedById === userId;
    }
    /**
     * Mark plugin as downloaded and increment download count
     */
    markAsDownloaded() {
        this.downloadCount = (this.downloadCount || 0) + 1;
        this.lastDownloadedAt = new Date();
    }
    /**
     * Check if plugin can be activated
     */
    canBeActivated() {
        return this.isPublished() && this.versions && this.versions.length > 0;
    }
    /**
     * Get total download count across all versions
     */
    getTotalDownloadCount() {
        if (!this.versions || this.versions.length === 0) {
            return 0;
        }
        return this.versions.reduce((total, version) => total + (version.downloadCount || 0), 0);
    }
    /**
     * Check if plugin has valid subscription plans
     */
    hasValidSubscriptionPlans() {
        return this.hasPlan === true && this.subscriptionPlans && this.subscriptionPlans.length > 0;
    }
    /**
     * Validate plugin data integrity
     */
    validate() {
        const errors = [];
        if (!this.name || this.name.trim().length === 0) {
            errors.push('Plugin name is required');
        }
        if (!this.type) {
            errors.push('Plugin type is required');
        }
        if (!this.status) {
            errors.push('Plugin status is required');
        }
        if (this.requiresSubscription && (!this.subscriptionPlans || this.subscriptionPlans.length === 0)) {
            errors.push('Plugin requiring subscription must have at least one subscription plan');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // Static Methods
    /**
     * Create a new plugin instance with default values
     */
    static create(data) {
        const plugin = new Plugin_1();
        Object.assign(plugin, {
            status: contracts_1.PluginStatus.ACTIVE,
            type: contracts_1.PluginType.DESKTOP,
            isActive: true,
            requiresSubscription: false,
            downloadCount: 0,
            versions: [],
            ...data
        });
        return plugin;
    }
    /**
     * Create a plugin for a specific platform type
     */
    static createForPlatform(name, type, description) {
        return Plugin_1.create({
            name,
            type,
            description,
            uploadedAt: new Date()
        });
    }
    /**
     * Create a desktop plugin
     */
    static createDesktopPlugin(name, description) {
        return Plugin_1.createForPlatform(name, contracts_1.PluginType.DESKTOP, description);
    }
    /**
     * Create a web plugin
     */
    static createWebPlugin(name, description) {
        return Plugin_1.createForPlatform(name, contracts_1.PluginType.WEB, description);
    }
    /**
     * Create a mobile plugin
     */
    static createMobilePlugin(name, description) {
        return Plugin_1.createForPlatform(name, contracts_1.PluginType.MOBILE, description);
    }
    /**
     * Validate plugin name format
     */
    static isValidName(name) {
        if (!name || typeof name !== 'string')
            return false;
        const trimmed = name.trim();
        return trimmed.length >= 3 && trimmed.length <= 100 && /^[a-zA-Z0-9._-]+$/.test(trimmed);
    }
    /**
     * Validate plugin status
     */
    static isValidStatus(status) {
        return Object.values(contracts_1.PluginStatus).includes(status);
    }
    /**
     * Validate plugin type
     */
    static isValidType(type) {
        return Object.values(contracts_1.PluginType).includes(type);
    }
    /**
     * Get all available plugin statuses
     */
    static getAvailableStatuses() {
        return Object.values(contracts_1.PluginStatus);
    }
    /**
     * Get all available plugin types
     */
    static getAvailableTypes() {
        return Object.values(contracts_1.PluginType);
    }
    /**
     * Get plugins that are published and active
     */
    static getPublishedStatuses() {
        return [contracts_1.PluginStatus.ACTIVE];
    }
    /**
     * Compare two plugins by name
     */
    static compareName(a, b) {
        return a.name.localeCompare(b.name);
    }
    /**
     * Compare two plugins by upload date (newest first)
     */
    static compareUploadDate(a, b) {
        if (!a.uploadedAt && !b.uploadedAt)
            return 0;
        if (!a.uploadedAt)
            return 1;
        if (!b.uploadedAt)
            return -1;
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }
    /**
     * Compare two plugins by download count (most downloaded first)
     */
    static compareDownloadCount(a, b) {
        return (b.downloadCount || 0) - (a.downloadCount || 0);
    }
    /**
     * Filter plugins by status
     */
    static filterByStatus(plugins, status) {
        return plugins.filter((plugin) => plugin.status === status);
    }
    /**
     * Filter plugins by type
     */
    static filterByType(plugins, type) {
        return plugins.filter((plugin) => plugin.type === type);
    }
    /**
     * Filter published plugins
     */
    static filterPublished(plugins) {
        return plugins.filter((plugin) => plugin.isPublished());
    }
    /**
     * Filter plugins that require subscription
     */
    static filterPaid(plugins) {
        return plugins.filter((plugin) => plugin.requiresPayment());
    }
    /**
     * Filter free plugins
     */
    static filterFree(plugins) {
        return plugins.filter((plugin) => !plugin.requiresPayment());
    }
    /**
     * Search plugins by name or description
     */
    static search(plugins, query) {
        if (!query || query.trim().length === 0)
            return plugins;
        const searchTerm = query.toLowerCase().trim();
        return plugins.filter((plugin) => plugin.name.toLowerCase().includes(searchTerm) ||
            (plugin.description && plugin.description.toLowerCase().includes(searchTerm)) ||
            (plugin.author && plugin.author.toLowerCase().includes(searchTerm)));
    }
    /**
     * Get plugins uploaded by a specific user
     */
    static filterByUploader(plugins, uploaderId) {
        return plugins.filter((plugin) => plugin.isUploadedBy(uploaderId));
    }
    /**
     * Group plugins by type
     */
    static groupByType(plugins) {
        const groups = Object.values(contracts_1.PluginType).reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {});
        plugins.forEach((plugin) => {
            if (groups[plugin.type]) {
                groups[plugin.type].push(plugin);
            }
        });
        return groups;
    }
    /**
     * Group plugins by status
     */
    static groupByStatus(plugins) {
        const groups = Object.values(contracts_1.PluginStatus).reduce((acc, status) => {
            acc[status] = [];
            return acc;
        }, {});
        plugins.forEach((plugin) => {
            if (groups[plugin.status]) {
                groups[plugin.status].push(plugin);
            }
        });
        return groups;
    }
    /**
     * Get statistics for a collection of plugins
     */
    static getStatistics(plugins) {
        const stats = {
            total: plugins.length,
            published: 0,
            byType: Object.values(contracts_1.PluginType).reduce((acc, type) => ({ ...acc, [type]: 0 }), {}),
            byStatus: Object.values(contracts_1.PluginStatus).reduce((acc, status) => ({ ...acc, [status]: 0 }), {}),
            paid: 0,
            free: 0,
            totalDownloads: 0
        };
        plugins.forEach((plugin) => {
            if (plugin.isPublished())
                stats.published++;
            stats.byType[plugin.type]++;
            stats.byStatus[plugin.status]++;
            if (plugin.requiresPayment()) {
                stats.paid++;
            }
            else {
                stats.free++;
            }
            stats.totalDownloads += plugin.downloadCount || 0;
        });
        return stats;
    }
};
exports.Plugin = Plugin;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin name is required' }),
    (0, class_validator_1.IsString)({ message: 'Plugin name must be a string' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginType, description: 'Type of the plugin' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginType, { message: 'Invalid plugin type' }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', enum: contracts_1.PluginType, default: contracts_1.PluginType.DESKTOP }),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginStatus, description: 'Status of the plugin' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginStatus, { message: 'Invalid plugin status' }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', enum: contracts_1.PluginStatus, default: contracts_1.PluginStatus.ACTIVE }),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Plugin is active or not', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Plugin.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin category ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true, relationId: true }),
    (0, core_1.ColumnIndex)(),
    (0, typeorm_1.RelationId)((plugin) => plugin.category),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object, description: 'Plugin category' }),
    (0, core_1.MultiORMManyToOne)(() => plugin_category_entity_1.PluginCategory, (category) => category.plugins, {
        onDelete: 'SET NULL',
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Plugin.prototype, "category", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Array, description: 'Versions of the plugin' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_version_entity_1.PluginVersion, (version) => version.plugin, { onDelete: 'SET NULL' }),
    tslib_1.__metadata("design:type", Array)
], Plugin.prototype, "versions", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin author', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Author must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "author", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin license', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'License must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "license", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Homepage URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Homepage URL must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "homepage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Repository URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Repository URL must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "repository", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => core_1.User, description: 'User who uploaded the plugin', required: false }),
    (0, core_1.MultiORMManyToOne)(() => core_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Plugin.prototype, "uploadedBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((plugin) => plugin.uploadedBy),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Plugin.prototype, "uploadedById", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'Upload date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'UploadedAt must be a valid date' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Plugin.prototype, "uploadedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Is subscription plan enabled', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Plugin.prototype, "requiresSubscription", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the plugin is featured', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Plugin.prototype, "isFeatured", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the plugin is verified by Gauzy', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Plugin.prototype, "isVerified", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'Last downloaded date', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'LastDownloadedAt must be a valid date' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Plugin.prototype, "lastDownloadedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, description: 'Plugin tenants for this plugin' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_tenant_entity_1.PluginTenant, (tenant) => tenant.plugin, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Plugin.prototype, "pluginTenants", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, description: 'Plugin settings' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_setting_entity_1.PluginSetting, (setting) => setting.plugin, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Plugin.prototype, "settings", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, description: 'Plugin subscriptions' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_subscription_entity_1.PluginSubscription, (subscription) => subscription.plugin, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Plugin.prototype, "subscriptions", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, description: 'Plugin subscription plans' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_subscription_plan_entity_1.PluginSubscriptionPlan, (plan) => plan.plugin, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Plugin.prototype, "subscriptionPlans", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, description: 'Plugin tag relationships' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_tag_entity_1.PluginTag, (pluginTag) => pluginTag.plugin, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Plugin.prototype, "pluginTags", void 0);
exports.Plugin = Plugin = Plugin_1 = tslib_1.__decorate([
    (0, typeorm_1.Index)(['name'], { unique: true }),
    (0, typeorm_1.Index)(['status', 'type']),
    (0, typeorm_1.Index)(['status', 'isFeatured']),
    (0, core_1.MultiORMEntity)('plugins')
], Plugin);
//# sourceMappingURL=plugin.entity.js.map