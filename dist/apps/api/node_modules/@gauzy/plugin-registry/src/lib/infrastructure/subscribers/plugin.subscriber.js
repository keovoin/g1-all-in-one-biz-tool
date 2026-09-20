"use strict";
var PluginSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriber = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const plugin_entity_1 = require("../../domain/entities/plugin.entity");
const plugin_installation_service_1 = require("../../domain/services/plugin-installation.service");
const plugin_source_service_1 = require("../../domain/services/plugin-source.service");
const plugin_subscription_plan_service_1 = require("../../domain/services/plugin-subscription-plan.service");
const plugin_version_service_1 = require("../../domain/services/plugin-version.service");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, core_1.getORMType)();
let PluginSubscriber = PluginSubscriber_1 = class PluginSubscriber {
    constructor(pluginVersionService, pluginSourceService, pluginInstallationService, pluginSubscriptionPlanService, dataSource) {
        this.pluginVersionService = pluginVersionService;
        this.pluginSourceService = pluginSourceService;
        this.pluginInstallationService = pluginInstallationService;
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(PluginSubscriber_1.name);
        dataSource.subscribers.push(this);
    }
    /**
     * Indicates that this subscriber only listens to Plugin events
     */
    listenTo() {
        return plugin_entity_1.Plugin;
    }
    /**
     * Lifecycle hook executed before inserting a new `Plugin` entity.
     * Automatically sets the `uploadedAt` timestamp to the current date.
     *
     * @param {InsertEvent<Plugin>} event - The event object containing entity details.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    async beforeInsert(event) {
        if (!event.entity)
            return;
        const entity = event.entity;
        // Set uploadedBy and uploadedAt
        entity.uploadedById = core_1.RequestContext.currentUserId();
        entity.uploadedAt = new Date();
        // Normalize string fields
        if (entity.name)
            entity.name = entity.name.trim();
        if (entity.author)
            entity.author = entity.author.trim();
        if (entity.license)
            entity.license = entity.license.trim();
    }
    /**
     * Called after entity is loaded from the database
     * Computes the total download count from all versions
     */
    async afterLoad(entity) {
        if (!entity || !entity.id) {
            return;
        }
        try {
            this.logger.debug(`Computing total download count for plugin: ${entity.id}`);
            // Compute total download count from all versions
            const downloadCount = await this.computeDownloadCount(entity.id);
            // Compute latest version
            const version = await this.computeLatestVersion(entity.id);
            // Get current user and context
            const currentUser = core_1.RequestContext.currentUser();
            // Get employeeId - may be null for users without employee records or with CHANGE_SELECTED_EMPLOYEE permission
            const installedById = currentUser?.employeeId || null;
            // compute installation
            const installation = await this.pluginInstallationService.findOneOrFailByOptions({
                where: {
                    pluginId: entity.id,
                    installedById,
                    status: contracts_1.PluginInstallationStatus.INSTALLED
                }
            });
            // Compute latest source associated to version
            const source = version
                ? await this.pluginSourceService.findOneOrFailByOptions({
                    where: {
                        version: {
                            id: version.id
                        }
                    },
                    order: {
                        createdAt: 'DESC'
                    }
                })
                : { success: false, record: null };
            // Compute if plugin has at least one subscription plan
            const hasPlan = await this.computeHasPlan(entity.id);
            // Add the computed property to the entity
            entity.downloadCount = downloadCount;
            // Add the version
            entity.version = version;
            // Add the source
            entity.source = source.success ? source.record : null;
            entity.installed = installation.success;
            // Add the hasPlan state
            entity.hasPlan = hasPlan && entity.requiresSubscription;
            this.logger.debug(`Total downloads for plugin ${entity.id}: ${downloadCount}`);
        }
        catch (error) {
            this.logger.error(`Error computing total downloads for plugin ${entity.id}: ${error.message}`, error.stack);
            // Default to 0 to avoid breaking the application
            entity.downloadCount = 0;
            // Add default version
            entity.version = null;
            // Add default source
            entity.source = null;
            // Add default installed
            entity.installed = false;
            // Add default hasPlan
            entity.hasPlan = false;
        }
    }
    /**
     * Compute total downloads from all versions of a plugin
     */
    async computeDownloadCount(pluginId) {
        try {
            // Create a query builder to sum the downloadCount from all versions
            const total = await this.pluginVersionService.getTotalDownloadCount(pluginId);
            // Return the total, or 0 if no results
            return total || 0;
        }
        catch (error) {
            this.logger.error(`Error in computeTotalDownloads query: ${error.message}`);
            return 0;
        }
    }
    /**
     * Find the latest version of a plugin using a query builder and semantic versioning principles
     * @param pluginId The ID of the plugin
     * @returns The latest version entity or undefined if none exists
     */
    async computeLatestVersion(pluginId) {
        try {
            this.logger.debug(`Finding latest version for plugin: ${pluginId}`);
            let allVersions;
            switch (ormType) {
                case core_1.MultiORMEnum.MikroORM: {
                    // MikroORM: Use ORM-agnostic findAll on the version service
                    const result = await this.pluginVersionService.findAll({
                        where: { pluginId },
                        relations: ['sources']
                    });
                    allVersions = result.items || [];
                    break;
                }
                case core_1.MultiORMEnum.TypeORM:
                default: {
                    // Get all versions to perform semantic versioning sort
                    allVersions = await this.pluginVersionService.typeOrmPluginVersionRepository
                        .createQueryBuilder('version')
                        .leftJoinAndSelect('version.sources', 'sources')
                        .where('version.pluginId = :pluginId', { pluginId })
                        .getMany();
                    break;
                }
            }
            if (!allVersions || allVersions.length === 0) {
                this.logger.debug(`No versions found for plugin: ${pluginId}`);
                return undefined;
            }
            // Sort versions based on semantic versioning (newest first)
            const sortedVersions = allVersions.sort((a, b) => {
                // Extract major, minor, patch numbers (ignore prerelease/build metadata)
                const versionA = a.number.split('-')[0].split('.').map(Number);
                const versionB = b.number.split('-')[0].split('.').map(Number);
                // Compare major version
                if (versionA[0] !== versionB[0]) {
                    return versionB[0] - versionA[0];
                }
                // Compare minor version
                if (versionA[1] !== versionB[1]) {
                    return versionB[1] - versionA[1];
                }
                // Compare patch version
                return versionB[2] - versionA[2];
            });
            this.logger.debug(`Latest version for plugin ${pluginId}: ${sortedVersions[0]?.number}`);
            return sortedVersions[0];
        }
        catch (error) {
            this.logger.error(`Error finding latest version for plugin ${pluginId}: ${error.message}`, error.stack);
            return null;
        }
    }
    /**
     * Check if a plugin has at least one subscription plan
     * @param pluginId The ID of the plugin
     * @returns True if the plugin has at least one plan, false otherwise
     */
    async computeHasPlan(pluginId) {
        try {
            this.logger.debug(`Checking if plugin ${pluginId} has subscription plans`);
            // Query for subscription plans with this plugin ID
            const count = await this.pluginSubscriptionPlanService.countBy({ pluginId });
            this.logger.debug(`Plugin ${pluginId} has plans: ${count}`);
            return count > 0;
        }
        catch (error) {
            this.logger.error(`Error checking plans for plugin ${pluginId}: ${error.message}`, error.stack);
            return false;
        }
    }
};
exports.PluginSubscriber = PluginSubscriber;
exports.PluginSubscriber = PluginSubscriber = PluginSubscriber_1 = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)(),
    tslib_1.__metadata("design:paramtypes", [plugin_version_service_1.PluginVersionService,
        plugin_source_service_1.PluginSourceService,
        plugin_installation_service_1.PluginInstallationService,
        plugin_subscription_plan_service_1.PluginSubscriptionPlanService,
        typeorm_1.DataSource])
], PluginSubscriber);
//# sourceMappingURL=plugin.subscriber.js.map