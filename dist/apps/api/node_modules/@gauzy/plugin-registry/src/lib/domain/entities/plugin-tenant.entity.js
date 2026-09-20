"use strict";
var PluginTenant_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTenant = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const plugin_setting_entity_1 = require("./plugin-setting.entity");
const plugin_subscription_entity_1 = require("./plugin-subscription.entity");
const plugin_entity_1 = require("./plugin.entity");
/**
 * PluginTenant Entity
 * Manages plugin installation and configuration at the tenant/organization level
 * Handles access control, usage limits, and tenant-specific customizations
 */
let PluginTenant = PluginTenant_1 = class PluginTenant extends core_1.TenantOrganizationBaseEntity {
    /*
    |--------------------------------------------------------------------------
    | @VirtualColumn
    |--------------------------------------------------------------------------
    */
    get isQuotaExceeded() {
        return !this.canInstallMore() || !this.canAddMoreUsers();
    }
    get hasLimits() {
        return ((this.maxInstallations !== null && this.maxInstallations !== undefined && this.maxInstallations !== -1) ||
            (this.maxActiveUsers !== null && this.maxActiveUsers !== undefined && this.maxActiveUsers !== -1));
    }
    get installationUtilization() {
        if (!this.maxInstallations || this.maxInstallations === -1)
            return 0;
        return ((this.currentInstallations || 0) / this.maxInstallations) * 100;
    }
    get userUtilization() {
        if (!this.maxActiveUsers || this.maxActiveUsers === -1)
            return 0;
        return ((this.currentActiveUsers || 0) / this.maxActiveUsers) * 100;
    }
    /*
    |--------------------------------------------------------------------------
    | Business Logic Methods - Availability & Access Control
    |--------------------------------------------------------------------------
    */
    /**
     * Check if plugin is available for use in this tenant
     * @returns true if plugin is enabled
     */
    isAvailable() {
        return this.enabled === true && !this.isArchived;
    }
    /**
     * Check if user has access to this plugin based on roles and explicit permissions
     * @param userId - User ID to check
     * @param userRoles - Array of roles the user has
     * @returns true if user has access
     */
    hasUserAccess(userId, userRoles) {
        if (!this.isAvailable()) {
            return false;
        }
        // Check explicit denials first (highest priority)
        if (this.deniedUsers?.some((user) => user.id === userId)) {
            return false;
        }
        // Check explicit allowances (overrides role restrictions)
        if (this.allowedUsers?.some((user) => user.id === userId)) {
            return true;
        }
        // Check role-based access
        if (this.allowedRoles && this.allowedRoles.length > 0) {
            return userRoles.some((userRole) => this.allowedRoles.some((allowedRole) => allowedRole.id === userRole.id));
        }
        // Default: allow access if no restrictions are configured
        return true;
    }
    /**
     * Check if tenant can install more instances based on quota
     * @returns true if more installations are allowed
     */
    canInstallMore() {
        if (!this.isAvailable()) {
            return false;
        }
        // Unlimited or no limit set
        if (this.maxInstallations === -1 || this.maxInstallations === null || this.maxInstallations === undefined) {
            return true;
        }
        return (this.currentInstallations || 0) < this.maxInstallations;
    }
    /**
     * Check if tenant can add more active users based on quota
     * @returns true if more users can be added
     */
    canAddMoreUsers() {
        if (!this.isAvailable()) {
            return false;
        }
        // Unlimited or no limit set
        if (this.maxActiveUsers === -1 || this.maxActiveUsers === null || this.maxActiveUsers === undefined) {
            return true;
        }
        return (this.currentActiveUsers || 0) < this.maxActiveUsers;
    }
    /**
     * Check if plugin is mandatory for users in this tenant
     * @returns true if plugin is mandatory and available
     */
    isMandatoryForTenant() {
        return this.isMandatory === true && this.isAvailable();
    }
    /**
     * Check if plugin requires approval for installation
     * @returns true if approval is required
     */
    needsApprovalForInstallation() {
        return this.requiresApproval === true;
    }
    /**
     * Check if plugin can be auto-installed
     * @returns true if auto-install is enabled and requirements are met
     */
    canAutoInstall() {
        return this.autoInstall === true && this.isAvailable() && !this.needsApprovalForInstallation();
    }
    /*
    |--------------------------------------------------------------------------
    | Configuration Management
    |--------------------------------------------------------------------------
    */
    /**
     * Get effective configuration for this plugin tenant
     * @returns Merged configuration object
     */
    getEffectiveConfiguration() {
        return { ...this.tenantConfiguration };
    }
    /**
     * Update tenant-specific configuration (merges with existing)
     * @param config - Configuration object to merge
     */
    updateConfiguration(config) {
        this.tenantConfiguration = {
            ...this.tenantConfiguration,
            ...config
        };
    }
    /**
     * Replace entire tenant configuration
     * @param config - New configuration object
     */
    setConfiguration(config) {
        this.tenantConfiguration = config;
    }
    /**
     * Update tenant preferences (merges with existing)
     * @param prefs - Preferences object to merge
     */
    updatePreferences(prefs) {
        this.preferences = {
            ...this.preferences,
            ...prefs
        };
    }
    /**
     * Replace entire preferences
     * @param prefs - New preferences object
     */
    setPreferences(prefs) {
        this.preferences = prefs;
    }
    /*
    |--------------------------------------------------------------------------
    | Usage Tracking
    |--------------------------------------------------------------------------
    */
    /**
     * Increment installation count
     * @throws Error if quota would be exceeded
     */
    incrementInstallations() {
        if (!this.canInstallMore()) {
            throw new Error('Installation quota exceeded');
        }
        this.currentInstallations = (this.currentInstallations || 0) + 1;
    }
    /**
     * Decrement installation count (safely prevents negative values)
     */
    decrementInstallations() {
        this.currentInstallations = Math.max((this.currentInstallations || 1) - 1, 0);
    }
    /**
     * Increment active user count
     * @throws Error if quota would be exceeded
     */
    incrementActiveUsers() {
        if (!this.canAddMoreUsers()) {
            throw new Error('Active user quota exceeded');
        }
        this.currentActiveUsers = (this.currentActiveUsers || 0) + 1;
    }
    /**
     * Decrement active user count (safely prevents negative values)
     */
    decrementActiveUsers() {
        this.currentActiveUsers = Math.max((this.currentActiveUsers || 1) - 1, 0);
    }
    /**
     * Reset usage counters to zero
     */
    resetUsageCounters() {
        this.currentInstallations = 0;
        this.currentActiveUsers = 0;
    }
    /*
    |--------------------------------------------------------------------------
    | State Management
    |--------------------------------------------------------------------------
    */
    /**
     * Enable plugin for tenant
     */
    enable() {
        if (this.isArchived) {
            throw new Error('Cannot enable an archived plugin tenant');
        }
        this.enabled = true;
    }
    /**
     * Mark plugin as archived (cannot be enabled unless restored)
     */
    archive() {
        this.isArchived = true;
        this.enabled = false;
    }
    /**
     * Restore plugin from archived state
     */
    restore() {
        this.isArchived = false;
    }
    /**
     * Disable plugin for tenant
     */
    disable() {
        this.enabled = false;
    }
    /**
     * Toggle plugin enabled state
     * @returns New enabled state
     */
    toggleEnabled() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    /**
     * Approve plugin for tenant
     * @param approvedBy - User who approved the plugin
     */
    approve(approvedBy) {
        this.approvedAt = new Date();
        this.approvedBy = approvedBy;
        this.approvedById = approvedBy.id;
        this.enable();
    }
    /**
     * Revoke approval for plugin
     */
    revokeApproval() {
        this.approvedAt = undefined;
        this.approvedBy = undefined;
        this.approvedById = undefined;
        this.disable();
    }
    /**
     * Check if plugin is approved
     * @returns true if plugin has been approved
     */
    isApproved() {
        return (this.approvedAt !== null && this.approvedAt !== undefined) || !!this.approvedById;
    }
    /*
    |--------------------------------------------------------------------------
    | Access Control Management - Users
    |--------------------------------------------------------------------------
    */
    /**
     * Add user to allowed list
     * @param user - User to allow
     */
    allowUser(user) {
        if (!this.allowedUsers) {
            this.allowedUsers = [];
        }
        if (!this.allowedUsers.some((u) => u.id === user.id)) {
            this.allowedUsers.push(user);
        }
        // Remove from denied list if present
        this.removeDeniedUser(user.id);
    }
    /**
     * Remove user from allowed list
     * @param userId - ID of user to remove from allowed list
     */
    removeAllowedUser(userId) {
        if (this.allowedUsers) {
            this.allowedUsers = this.allowedUsers.filter((u) => u.id !== userId);
        }
    }
    /**
     * Add user to denied list
     * @param user - User to deny
     */
    denyUser(user) {
        if (!this.deniedUsers) {
            this.deniedUsers = [];
        }
        if (!this.deniedUsers.some((u) => u.id === user.id)) {
            this.deniedUsers.push(user);
        }
        // Remove from allowed list if present
        this.removeAllowedUser(user.id);
    }
    /**
     * Remove user from denied list
     * @param userId - ID of user to remove from denied list
     */
    removeDeniedUser(userId) {
        if (this.deniedUsers) {
            this.deniedUsers = this.deniedUsers.filter((u) => u.id !== userId);
        }
    }
    /**
     * Clear all user-specific access controls
     */
    clearUserAccessControls() {
        this.allowedUsers = [];
        this.deniedUsers = [];
    }
    /*
    |--------------------------------------------------------------------------
    | Access Control Management - Roles
    |--------------------------------------------------------------------------
    */
    /**
     * Add role to allowed list
     * @param role - Role to allow
     */
    allowRole(role) {
        if (!this.allowedRoles) {
            this.allowedRoles = [];
        }
        if (!this.allowedRoles.some((r) => r.id === role.id)) {
            this.allowedRoles.push(role);
        }
    }
    /**
     * Remove role from allowed list
     * @param roleId - ID of role to remove
     */
    removeAllowedRole(roleId) {
        if (this.allowedRoles) {
            this.allowedRoles = this.allowedRoles.filter((r) => r.id !== roleId);
        }
    }
    /**
     * Clear all role-based access controls
     */
    clearRoleAccessControls() {
        this.allowedRoles = [];
    }
    /**
     * Clear all access controls (both users and roles)
     */
    clearAllAccessControls() {
        this.clearUserAccessControls();
        this.clearRoleAccessControls();
    }
    /*
    |--------------------------------------------------------------------------
    | Factory Methods
    |--------------------------------------------------------------------------
    */
    /**
     * Factory method to create a new plugin-tenant relationship
     * @param params - Configuration parameters
     * @returns New PluginTenant instance
     */
    static create(params) {
        const pluginTenant = new PluginTenant_1();
        // Apply all params first, then override with defaults for undefined values
        Object.assign(pluginTenant, params);
        // Apply defaults only for undefined values (nullish coalescing)
        pluginTenant.scope ??= contracts_1.PluginScope.USER;
        pluginTenant.enabled ??= true;
        pluginTenant.autoInstall ??= false;
        pluginTenant.requiresApproval ??= true;
        pluginTenant.isMandatory ??= false;
        pluginTenant.isDataCompliant ??= true;
        // Always reset counters for new instances
        pluginTenant.currentInstallations = params.currentInstallations ?? 0;
        pluginTenant.currentActiveUsers = params.currentActiveUsers ?? 0;
        return pluginTenant;
    }
    /**
     * Create a plugin tenant with unlimited access
     * @param input - Plugin to create tenant relationship for
     * @returns New PluginTenant instance with no restrictions
     */
    static createUnlimited(input) {
        return PluginTenant_1.create({
            ...input,
            enabled: true,
            autoInstall: false,
            requiresApproval: false,
            maxInstallations: -1,
            maxActiveUsers: -1
        });
    }
    /**
     * Create a plugin tenant with strict restrictions
     * @param plugin - Plugin to create tenant relationship for
     * @param allowedRoles - Roles that can access the plugin
     * @returns New PluginTenant instance with restrictions
     */
    static createRestricted(input, allowedRoles) {
        return PluginTenant_1.create({
            ...input,
            enabled: false,
            autoInstall: false,
            requiresApproval: true,
            allowedRoles
        });
    }
};
exports.PluginTenant = PluginTenant;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.plugin),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ relationId: true, type: 'uuid' }),
    tslib_1.__metadata("design:type", String)
], PluginTenant.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the plugin is enabled for this tenant' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: true }),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenant.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginScope, description: 'Scope of the plugin (USER, ORGANIZATION, TENANT)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginScope),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', enum: contracts_1.PluginScope, default: contracts_1.PluginScope.USER }),
    tslib_1.__metadata("design:type", String)
], PluginTenant.prototype, "scope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether plugin can be installed automatically without user action',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: false }),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenant.prototype, "autoInstall", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether plugin requires admin approval before installation',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: true }),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenant.prototype, "requiresApproval", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether plugin is mandatory for all users in scope',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: false }),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenant.prototype, "isMandatory", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Maximum number of installations allowed (-1 for unlimited, null for no limit)',
        example: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.maxInstallations !== null && o.maxInstallations !== undefined),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(-1),
    (0, core_1.MultiORMColumn)({ type: 'int', nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PluginTenant.prototype, "maxInstallations", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Maximum number of active users allowed (-1 for unlimited, null for no limit)',
        example: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.maxActiveUsers !== null && o.maxActiveUsers !== undefined),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(-1),
    (0, core_1.MultiORMColumn)({ type: 'int', nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PluginTenant.prototype, "maxActiveUsers", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Current number of installations',
        example: 25,
        default: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], PluginTenant.prototype, "currentInstallations", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Current number of active users',
        example: 15,
        default: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], PluginTenant.prototype, "currentActiveUsers", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Object,
        description: 'Tenant-specific plugin configuration overrides',
        example: {
            branding: { logo: 'tenant-logo.png', theme: 'blue' },
            features: { advancedReporting: true },
            limits: { dailyUsage: 1000 }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], PluginTenant.prototype, "tenantConfiguration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Object,
        description: 'Plugin preferences and UI customizations for this tenant',
        example: {
            defaultSettings: { autoSave: true, notifications: false },
            uiCustomizations: { hideAdvancedOptions: true }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], PluginTenant.prototype, "preferences", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Date,
        description: 'Timestamp when the plugin was approved for this tenant'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isBetterSqlite3)() ? 'text' : 'timestamp', nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PluginTenant.prototype, "approvedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether plugin data handling complies with tenant data policies',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: true }),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenant.prototype, "isDataCompliant", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'List of compliance certifications applicable to this tenant',
        example: ['SOC2', 'GDPR', 'HIPAA']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-array', nullable: true }),
    tslib_1.__metadata("design:type", Array)
], PluginTenant.prototype, "complianceCertifications", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'ID of the user who approved the plugin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.approvedBy),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ relationId: true, nullable: true, type: 'uuid' }),
    tslib_1.__metadata("design:type", String)
], PluginTenant.prototype, "approvedById", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => plugin_entity_1.Plugin, description: 'The plugin this configuration applies to' }),
    (0, core_1.MultiORMManyToOne)(() => plugin_entity_1.Plugin, (plugin) => plugin.pluginTenants, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], PluginTenant.prototype, "plugin", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => core_1.User, description: 'User who approved the plugin for this tenant' }),
    (0, core_1.MultiORMManyToOne)(() => core_1.User, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Object)
], PluginTenant.prototype, "approvedBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => plugin_setting_entity_1.PluginSetting,
        isArray: true,
        description: 'Plugin settings specific to this tenant'
    }),
    (0, core_1.MultiORMOneToMany)(() => plugin_setting_entity_1.PluginSetting, (it) => it.pluginTenant, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Object)
], PluginTenant.prototype, "settings", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => plugin_subscription_entity_1.PluginSubscription,
        isArray: true,
        description: 'Active subscriptions for this plugin tenant'
    }),
    (0, core_1.MultiORMOneToMany)(() => plugin_subscription_entity_1.PluginSubscription, (it) => it.pluginTenant, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Object)
], PluginTenant.prototype, "subscriptions", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => core_1.Role,
        isArray: true,
        description: 'Roles explicitly allowed to access this plugin'
    }),
    (0, core_1.MultiORMManyToMany)(() => core_1.Role, {
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'plugin_tenant_allowed_roles',
        joinColumn: 'pluginTenantId',
        inverseJoinColumn: 'roleId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'plugin_tenant_allowed_roles' }),
    tslib_1.__metadata("design:type", Object)
], PluginTenant.prototype, "allowedRoles", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => core_1.User,
        isArray: true,
        description: 'Users explicitly allowed to access this plugin'
    }),
    (0, core_1.MultiORMManyToMany)(() => core_1.User, {
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'plugin_tenant_allowed_users',
        joinColumn: 'pluginTenantId',
        inverseJoinColumn: 'userId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'plugin_tenant_allowed_users' }),
    tslib_1.__metadata("design:type", Object)
], PluginTenant.prototype, "allowedUsers", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => core_1.User,
        isArray: true,
        description: 'Users explicitly denied access to this plugin'
    }),
    (0, core_1.MultiORMManyToMany)(() => core_1.User, {
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'plugin_tenant_denied_users',
        joinColumn: 'pluginTenantId',
        inverseJoinColumn: 'userId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'plugin_tenant_denied_users' }),
    tslib_1.__metadata("design:type", Object)
], PluginTenant.prototype, "deniedUsers", void 0);
tslib_1.__decorate([
    (0, core_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [])
], PluginTenant.prototype, "isQuotaExceeded", null);
tslib_1.__decorate([
    (0, core_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [])
], PluginTenant.prototype, "hasLimits", null);
tslib_1.__decorate([
    (0, core_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Number),
    tslib_1.__metadata("design:paramtypes", [])
], PluginTenant.prototype, "installationUtilization", null);
tslib_1.__decorate([
    (0, core_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Number),
    tslib_1.__metadata("design:paramtypes", [])
], PluginTenant.prototype, "userUtilization", null);
exports.PluginTenant = PluginTenant = PluginTenant_1 = tslib_1.__decorate([
    (0, typeorm_1.Index)(['pluginId', 'tenantId', 'organizationId'], { unique: true }),
    (0, typeorm_1.Index)(['tenantId', 'scope', 'enabled']),
    (0, typeorm_1.Index)(['organizationId', 'scope']),
    (0, typeorm_1.Index)(['pluginId', 'enabled']),
    (0, core_1.MultiORMEntity)('plugin_tenants')
], PluginTenant);
//# sourceMappingURL=plugin-tenant.entity.js.map