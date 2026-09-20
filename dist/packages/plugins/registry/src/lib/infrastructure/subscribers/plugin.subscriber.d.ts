import { DataSource, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { Plugin } from '../../domain/entities/plugin.entity';
import { PluginInstallationService } from '../../domain/services/plugin-installation.service';
import { PluginSourceService } from '../../domain/services/plugin-source.service';
import { PluginSubscriptionPlanService } from '../../domain/services/plugin-subscription-plan.service';
import { PluginVersionService } from '../../domain/services/plugin-version.service';
export declare class PluginSubscriber implements EntitySubscriberInterface<Plugin> {
    private readonly pluginVersionService;
    private readonly pluginSourceService;
    private readonly pluginInstallationService;
    private readonly pluginSubscriptionPlanService;
    readonly dataSource: DataSource;
    private readonly logger;
    constructor(pluginVersionService: PluginVersionService, pluginSourceService: PluginSourceService, pluginInstallationService: PluginInstallationService, pluginSubscriptionPlanService: PluginSubscriptionPlanService, dataSource: DataSource);
    /**
     * Indicates that this subscriber only listens to Plugin events
     */
    listenTo(): typeof Plugin;
    /**
     * Lifecycle hook executed before inserting a new `Plugin` entity.
     * Automatically sets the `uploadedAt` timestamp to the current date.
     *
     * @param {InsertEvent<Plugin>} event - The event object containing entity details.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    beforeInsert(event: InsertEvent<Plugin>): Promise<void>;
    /**
     * Called after entity is loaded from the database
     * Computes the total download count from all versions
     */
    afterLoad(entity: Plugin): Promise<void>;
    /**
     * Compute total downloads from all versions of a plugin
     */
    private computeDownloadCount;
    /**
     * Find the latest version of a plugin using a query builder and semantic versioning principles
     * @param pluginId The ID of the plugin
     * @returns The latest version entity or undefined if none exists
     */
    private computeLatestVersion;
    /**
     * Check if a plugin has at least one subscription plan
     * @param pluginId The ID of the plugin
     * @returns True if the plugin has at least one plan, false otherwise
     */
    private computeHasPlan;
}
