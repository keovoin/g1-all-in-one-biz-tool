"use strict";
var PluginInstallation_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginInstallation = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const mikro_orm_plugin_installation_repository_1 = require("../repositories/mikro-orm-plugin-installation.repository");
const plugin_version_entity_1 = require("./plugin-version.entity");
const plugin_entity_1 = require("./plugin.entity");
let PluginInstallation = PluginInstallation_1 = class PluginInstallation extends core_1.TenantOrganizationBaseEntity {
    // Business Logic Methods
    /**
     * Check if the installation is currently installed
     */
    isInstalled() {
        return this.status === contracts_1.PluginInstallationStatus.INSTALLED;
    }
    /**
     * Check if the installation failed
     */
    isFailed() {
        return this.status === contracts_1.PluginInstallationStatus.FAILED;
    }
    /**
     * Check if the installation is in progress
     */
    isInProgress() {
        return this.status === contracts_1.PluginInstallationStatus.IN_PROGRESS;
    }
    /**
     * Check if the installation has been uninstalled
     */
    isUninstalled() {
        return this.status === contracts_1.PluginInstallationStatus.UNINSTALLED;
    }
    /**
     * Check if the installation is currently active
     */
    isCurrentlyActive() {
        return this.isInstalled() && this.isActivated === true;
    }
    /**
     * Activate the plugin installation
     */
    activate() {
        if (!this.isInstalled()) {
            throw new Error('Cannot activate a plugin that is not installed');
        }
        this.isActivated = true;
        this.activatedAt = new Date();
        this.deactivatedAt = undefined; // Clear deactivation timestamp
    }
    /**
     * Deactivate the plugin installation
     */
    deactivate() {
        this.isActivated = false;
        this.deactivatedAt = new Date();
    }
    /**
     * Mark installation as completed successfully
     */
    markAsInstalled() {
        this.status = contracts_1.PluginInstallationStatus.INSTALLED;
        this.installedAt = new Date();
        this.uninstalledAt = null;
    }
    /**
     * Mark installation as failed
     */
    markAsFailed() {
        this.status = contracts_1.PluginInstallationStatus.FAILED;
        this.isActivated = false;
    }
    /**
     * Mark installation as uninstalled
     */
    markAsUninstalled() {
        this.status = contracts_1.PluginInstallationStatus.UNINSTALLED;
        this.uninstalledAt = new Date();
        this.isActivated = false;
        this.deactivatedAt = new Date();
    }
    /**
     * Get installation duration in milliseconds
     */
    getInstallationDuration() {
        if (!this.installedAt || !this.createdAt) {
            return undefined;
        }
        return new Date(this.installedAt).getTime() - new Date(this.createdAt).getTime();
    }
    /**
     * Get how long the plugin has been active (in milliseconds)
     */
    getActiveTime() {
        if (!this.activatedAt) {
            return 0;
        }
        const endTime = this.deactivatedAt ? new Date(this.deactivatedAt).getTime() : new Date().getTime();
        return endTime - new Date(this.activatedAt).getTime();
    }
    /**
     * Check if installation was performed by a specific user
     */
    wasInstalledBy(employeeId) {
        return this.installedById === employeeId;
    }
    /**
     * Check if the installation can be activated
     */
    canBeActivated() {
        return this.isInstalled() && this.isActivated !== true;
    }
    /**
     * Check if the installation can be deactivated
     */
    canBeDeactivated() {
        return this.isCurrentlyActive();
    }
    /**
     * Check if the installation can be uninstalled
     */
    canBeUninstalled() {
        return this.isInstalled() || this.isFailed();
    }
    /**
     * Validate installation data integrity
     */
    validate() {
        const errors = [];
        if (!this.plugin && !this.pluginId) {
            errors.push('Plugin reference is required');
        }
        if (!this.version && !this.versionId) {
            errors.push('Version reference is required');
        }
        if (!this.status) {
            errors.push('Installation status is required');
        }
        if (this.isActivated === true && !this.activatedAt) {
            errors.push('Activated installation must have activatedAt timestamp');
        }
        if (this.uninstalledAt && !this.installedAt) {
            errors.push('Cannot have uninstall date without install date');
        }
        if (this.uninstalledAt && this.installedAt && new Date(this.uninstalledAt) < new Date(this.installedAt)) {
            errors.push('Uninstall date cannot be before install date');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // Static Methods
    /**
     * Create a new plugin installation instance
     */
    static create(data) {
        const installation = new PluginInstallation_1();
        Object.assign(installation, {
            status: contracts_1.PluginInstallationStatus.IN_PROGRESS,
            isActivated: false,
            ...data
        });
        return installation;
    }
    /**
     * Create an installation for a plugin and version
     */
    static createForPluginVersion(pluginId, versionId, installedById) {
        return this.create({
            pluginId,
            versionId,
            installedById,
            status: contracts_1.PluginInstallationStatus.IN_PROGRESS
        });
    }
    /**
     * Validate installation status
     */
    static isValidStatus(status) {
        return Object.values(contracts_1.PluginInstallationStatus).includes(status);
    }
    /**
     * Get all available installation statuses
     */
    static getAvailableStatuses() {
        return Object.values(contracts_1.PluginInstallationStatus);
    }
    /**
     * Filter installations by status
     */
    static filterByStatus(installations, status) {
        return installations.filter((installation) => installation.status === status);
    }
    /**
     * Get installed plugins only
     */
    static filterInstalled(installations) {
        return this.filterByStatus(installations, contracts_1.PluginInstallationStatus.INSTALLED);
    }
    /**
     * Get failed installations only
     */
    static filterFailed(installations) {
        return this.filterByStatus(installations, contracts_1.PluginInstallationStatus.FAILED);
    }
    /**
     * Get in-progress installations only
     */
    static filterInProgress(installations) {
        return this.filterByStatus(installations, contracts_1.PluginInstallationStatus.IN_PROGRESS);
    }
    /**
     * Get uninstalled plugins only
     */
    static filterUninstalled(installations) {
        return this.filterByStatus(installations, contracts_1.PluginInstallationStatus.UNINSTALLED);
    }
    /**
     * Filter active installations (installed and activated)
     */
    static filterActive(installations) {
        return installations.filter((installation) => installation.isCurrentlyActive());
    }
    /**
     * Filter installations by plugin
     */
    static filterByPlugin(installations, pluginId) {
        return installations.filter((installation) => installation.pluginId === pluginId);
    }
    /**
     * Filter installations by user
     */
    static filterByInstaller(installations, installedById) {
        return installations.filter((installation) => installation.wasInstalledBy(installedById));
    }
    /**
     * Sort installations by installation date (newest first)
     */
    static sortByInstallDate(installations) {
        return [...installations].sort((a, b) => {
            if (!a.installedAt && !b.installedAt)
                return 0;
            if (!a.installedAt)
                return 1;
            if (!b.installedAt)
                return -1;
            return new Date(b.installedAt).getTime() - new Date(a.installedAt).getTime();
        });
    }
    /**
     * Sort installations by creation date (newest first)
     */
    static sortByCreationDate(installations) {
        return [...installations].sort((a, b) => {
            if (!a.createdAt && !b.createdAt)
                return 0;
            if (!a.createdAt)
                return 1;
            if (!b.createdAt)
                return -1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }
    /**
     * Find latest installation for a plugin
     */
    static findLatestForPlugin(installations, pluginId) {
        const pluginInstallations = this.filterByPlugin(installations, pluginId);
        const sorted = this.sortByInstallDate(pluginInstallations);
        return sorted.length > 0 ? sorted[0] : undefined;
    }
    /**
     * Check if plugin is installed by a specific user
     */
    static isPluginInstalledByUser(installations, pluginId, installedById) {
        return installations.some((installation) => installation.pluginId === pluginId &&
            installation.wasInstalledBy(installedById) &&
            installation.isInstalled());
    }
    /**
     * Group installations by status
     */
    static groupByStatus(installations) {
        const groups = Object.values(contracts_1.PluginInstallationStatus).reduce((acc, status) => {
            acc[status] = [];
            return acc;
        }, {});
        installations.forEach((installation) => {
            if (groups[installation.status]) {
                groups[installation.status].push(installation);
            }
        });
        return groups;
    }
    /**
     * Group installations by plugin
     */
    static groupByPlugin(installations) {
        const groups = {};
        installations.forEach((installation) => {
            if (installation.pluginId) {
                if (!groups[installation.pluginId]) {
                    groups[installation.pluginId] = [];
                }
                groups[installation.pluginId].push(installation);
            }
        });
        return groups;
    }
    /**
     * Calculate average installation time for successful installations
     */
    static calculateAverageInstallTime(installations) {
        const successfulInstallations = this.filterInstalled(installations).filter((installation) => installation.getInstallationDuration() !== undefined);
        if (successfulInstallations.length === 0)
            return undefined;
        const totalTime = successfulInstallations.reduce((sum, installation) => sum + (installation.getInstallationDuration() || 0), 0);
        return totalTime / successfulInstallations.length;
    }
    /**
     * Get installation statistics
     */
    static getStatistics(installations) {
        const stats = {
            total: installations.length,
            byStatus: Object.values(contracts_1.PluginInstallationStatus).reduce((acc, status) => ({ ...acc, [status]: 0 }), {}),
            active: 0,
            successRate: 0,
            averageInstallTime: this.calculateAverageInstallTime(installations)
        };
        installations.forEach((installation) => {
            stats.byStatus[installation.status]++;
            if (installation.isCurrentlyActive()) {
                stats.active++;
            }
        });
        if (stats.total > 0) {
            stats.successRate = (stats.byStatus[contracts_1.PluginInstallationStatus.INSTALLED] / stats.total) * 100;
        }
        return stats;
    }
};
exports.PluginInstallation = PluginInstallation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => plugin_entity_1.Plugin, description: 'Installed the plugin' }),
    (0, core_1.MultiORMManyToOne)(() => plugin_entity_1.Plugin, { onDelete: 'CASCADE' }),
    tslib_1.__metadata("design:type", Object)
], PluginInstallation.prototype, "plugin", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((installation) => installation.plugin),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true, ...(!(0, config_1.isPostgres)() && { length: 36 }) }),
    tslib_1.__metadata("design:type", String)
], PluginInstallation.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => plugin_version_entity_1.PluginVersion, description: 'Installed version of the plugin' }),
    (0, core_1.MultiORMManyToOne)(() => plugin_version_entity_1.PluginVersion, (version) => version.installations, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginInstallation.prototype, "version", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((installation) => installation.version),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true, ...(!(0, config_1.isPostgres)() && { length: 36 }) }),
    tslib_1.__metadata("design:type", String)
], PluginInstallation.prototype, "versionId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => core_1.Employee, description: 'Employee who installed the plugin', required: false }),
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginInstallation.prototype, "installedBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((installation) => installation.installedBy),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true, ...(!(0, config_1.isPostgres)() && { length: 36 }) }),
    tslib_1.__metadata("design:type", String)
], PluginInstallation.prototype, "installedById", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Installed date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'InstalledAt date must be a valid ISO 8601 date string' }),
    (0, class_validator_1.ValidateIf)((o) => o.installedAt && o.installedAt <= new Date()),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PluginInstallation.prototype, "installedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Uninstalled date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'UninstalledAt date must be a valid ISO 8601 date string' }),
    (0, class_validator_1.ValidateIf)((o) => o.uninstalledAt && o.uninstalledAt <= new Date()),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PluginInstallation.prototype, "uninstalledAt", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMColumn)({
        type: 'simple-enum',
        enum: contracts_1.PluginInstallationStatus,
        default: contracts_1.PluginInstallationStatus.IN_PROGRESS
    }),
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginInstallationStatus, description: 'Plugin installation status' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin installation status is required' }),
    tslib_1.__metadata("design:type", String)
], PluginInstallation.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether this installation is currently activated',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'IsActivated must be a boolean' }),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], PluginInstallation.prototype, "isActivated", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Date, description: 'When this installation was last activated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'ActivatedAt date must be a valid ISO 8601 date string' }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PluginInstallation.prototype, "activatedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Date, description: 'When this installation was last deactivated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'DeactivatedAt date must be a valid ISO 8601 date string' }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PluginInstallation.prototype, "deactivatedAt", void 0);
exports.PluginInstallation = PluginInstallation = PluginInstallation_1 = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('plugin_installations', { mikroOrmRepository: () => mikro_orm_plugin_installation_repository_1.MikroOrmPluginInstallationRepository }),
    (0, typeorm_1.Index)(['pluginId', 'tenantId', 'organizationId', 'installedById'], { unique: true }),
    (0, typeorm_1.Index)(['installedById', 'pluginId'])
], PluginInstallation);
//# sourceMappingURL=plugin-installation.entity.js.map