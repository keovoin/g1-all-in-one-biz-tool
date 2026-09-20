import { ID, IUser, PluginStatus, PluginType } from '@gauzy/contracts';
import { BaseEntity } from '@gauzy/core';
import { Relation } from 'typeorm';
import { IPluginSetting, IPluginSubscription } from '../../shared/models';
import { IPluginCategory } from '../../shared/models/plugin-category.model';
import { IPluginSource } from '../../shared/models/plugin-source.model';
import { IPluginSubscriptionPlan } from '../../shared/models/plugin-subscription.model';
import { IPluginTag } from '../../shared/models/plugin-tag.model';
import { IPluginTenant } from '../../shared/models/plugin-tenant.model';
import { IPluginVersion } from '../../shared/models/plugin-version.model';
import { IPlugin } from '../../shared/models/plugin.model';
export declare class Plugin extends BaseEntity implements IPlugin {
    name: string;
    description?: string;
    type: PluginType;
    status: PluginStatus;
    isActive?: boolean;
    categoryId?: string;
    category?: IPluginCategory;
    versions: IPluginVersion[];
    author?: string;
    license?: string;
    homepage?: string;
    repository?: string;
    uploadedBy?: IUser;
    uploadedById?: ID;
    uploadedAt?: Date;
    requiresSubscription?: boolean;
    isFeatured?: boolean;
    isVerified?: boolean;
    source: IPluginSource;
    downloadCount: number;
    version: IPluginVersion;
    installed: boolean;
    hasPlan: boolean;
    lastDownloadedAt?: Date;
    pluginTenants?: Relation<IPluginTenant[]>;
    /**
     * Plugin Settings relationships - global plugin settings
     */
    settings?: Relation<IPluginSetting[]>;
    /**
     * Plugin Subscriptions relationships - subscriptions for this plugin
     */
    subscriptions?: Relation<IPluginSubscription[]>;
    /**
     * Plugin Subscription Plans relationships - available plans for this plugin
     */
    subscriptionPlans?: Relation<IPluginSubscriptionPlan[]>;
    /**
     * Plugin Tags relationships - tag associations for this plugin
     */
    pluginTags?: Relation<IPluginTag[]>;
    /**
     * Check if the plugin is published and available for installation
     */
    isPublished(): boolean;
    /**
     * Get the latest version of the plugin
     */
    getLatestVersion(): IPluginVersion | undefined;
    /**
     * Check if the plugin requires subscription for usage
     */
    requiresPayment(): boolean;
    /**
     * Check if the plugin has been uploaded by a specific user
     */
    isUploadedBy(userId: ID): boolean;
    /**
     * Mark plugin as downloaded and increment download count
     */
    markAsDownloaded(): void;
    /**
     * Check if plugin can be activated
     */
    canBeActivated(): boolean;
    /**
     * Get total download count across all versions
     */
    getTotalDownloadCount(): number;
    /**
     * Check if plugin has valid subscription plans
     */
    hasValidSubscriptionPlans(): boolean;
    /**
     * Validate plugin data integrity
     */
    validate(): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Create a new plugin instance with default values
     */
    static create(data: Partial<Plugin>): Plugin;
    /**
     * Create a plugin for a specific platform type
     */
    static createForPlatform(name: string, type: PluginType, description?: string): Plugin;
    /**
     * Create a desktop plugin
     */
    static createDesktopPlugin(name: string, description?: string): Plugin;
    /**
     * Create a web plugin
     */
    static createWebPlugin(name: string, description?: string): Plugin;
    /**
     * Create a mobile plugin
     */
    static createMobilePlugin(name: string, description?: string): Plugin;
    /**
     * Validate plugin name format
     */
    static isValidName(name: string): boolean;
    /**
     * Validate plugin status
     */
    static isValidStatus(status: string): status is PluginStatus;
    /**
     * Validate plugin type
     */
    static isValidType(type: string): type is PluginType;
    /**
     * Get all available plugin statuses
     */
    static getAvailableStatuses(): PluginStatus[];
    /**
     * Get all available plugin types
     */
    static getAvailableTypes(): PluginType[];
    /**
     * Get plugins that are published and active
     */
    static getPublishedStatuses(): PluginStatus[];
    /**
     * Compare two plugins by name
     */
    static compareName(a: Plugin, b: Plugin): number;
    /**
     * Compare two plugins by upload date (newest first)
     */
    static compareUploadDate(a: Plugin, b: Plugin): number;
    /**
     * Compare two plugins by download count (most downloaded first)
     */
    static compareDownloadCount(a: Plugin, b: Plugin): number;
    /**
     * Filter plugins by status
     */
    static filterByStatus(plugins: Plugin[], status: PluginStatus): Plugin[];
    /**
     * Filter plugins by type
     */
    static filterByType(plugins: Plugin[], type: PluginType): Plugin[];
    /**
     * Filter published plugins
     */
    static filterPublished(plugins: Plugin[]): Plugin[];
    /**
     * Filter plugins that require subscription
     */
    static filterPaid(plugins: Plugin[]): Plugin[];
    /**
     * Filter free plugins
     */
    static filterFree(plugins: Plugin[]): Plugin[];
    /**
     * Search plugins by name or description
     */
    static search(plugins: Plugin[], query: string): Plugin[];
    /**
     * Get plugins uploaded by a specific user
     */
    static filterByUploader(plugins: Plugin[], uploaderId: ID): Plugin[];
    /**
     * Group plugins by type
     */
    static groupByType(plugins: Plugin[]): Record<PluginType, Plugin[]>;
    /**
     * Group plugins by status
     */
    static groupByStatus(plugins: Plugin[]): Record<PluginStatus, Plugin[]>;
    /**
     * Get statistics for a collection of plugins
     */
    static getStatistics(plugins: Plugin[]): {
        total: number;
        published: number;
        byType: Record<PluginType, number>;
        byStatus: Record<PluginStatus, number>;
        paid: number;
        free: number;
        totalDownloads: number;
    };
}
