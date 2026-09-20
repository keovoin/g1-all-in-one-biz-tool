import { ID, IEmployee, PluginInstallationStatus } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { IPluginInstallation } from '../../shared/models/plugin-installation.model';
import { IPluginVersion } from '../../shared/models/plugin-version.model';
import { IPlugin } from '../../shared/models/plugin.model';
export declare class PluginInstallation extends TenantOrganizationBaseEntity implements IPluginInstallation {
    plugin: IPlugin;
    pluginId?: ID;
    version: IPluginVersion;
    versionId?: ID;
    installedBy: IEmployee;
    installedById?: ID;
    installedAt: Date;
    uninstalledAt?: Date;
    status: PluginInstallationStatus;
    isActivated?: boolean;
    activatedAt?: Date;
    deactivatedAt?: Date;
    /**
     * Check if the installation is currently installed
     */
    isInstalled(): boolean;
    /**
     * Check if the installation failed
     */
    isFailed(): boolean;
    /**
     * Check if the installation is in progress
     */
    isInProgress(): boolean;
    /**
     * Check if the installation has been uninstalled
     */
    isUninstalled(): boolean;
    /**
     * Check if the installation is currently active
     */
    isCurrentlyActive(): boolean;
    /**
     * Activate the plugin installation
     */
    activate(): void;
    /**
     * Deactivate the plugin installation
     */
    deactivate(): void;
    /**
     * Mark installation as completed successfully
     */
    markAsInstalled(): void;
    /**
     * Mark installation as failed
     */
    markAsFailed(): void;
    /**
     * Mark installation as uninstalled
     */
    markAsUninstalled(): void;
    /**
     * Get installation duration in milliseconds
     */
    getInstallationDuration(): number | undefined;
    /**
     * Get how long the plugin has been active (in milliseconds)
     */
    getActiveTime(): number;
    /**
     * Check if installation was performed by a specific user
     */
    wasInstalledBy(employeeId: ID): boolean;
    /**
     * Check if the installation can be activated
     */
    canBeActivated(): boolean;
    /**
     * Check if the installation can be deactivated
     */
    canBeDeactivated(): boolean;
    /**
     * Check if the installation can be uninstalled
     */
    canBeUninstalled(): boolean;
    /**
     * Validate installation data integrity
     */
    validate(): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Create a new plugin installation instance
     */
    static create(data: Partial<PluginInstallation>): PluginInstallation;
    /**
     * Create an installation for a plugin and version
     */
    static createForPluginVersion(pluginId: string, versionId: string, installedById?: string): PluginInstallation;
    /**
     * Validate installation status
     */
    static isValidStatus(status: string): status is PluginInstallationStatus;
    /**
     * Get all available installation statuses
     */
    static getAvailableStatuses(): PluginInstallationStatus[];
    /**
     * Filter installations by status
     */
    static filterByStatus(installations: PluginInstallation[], status: PluginInstallationStatus): PluginInstallation[];
    /**
     * Get installed plugins only
     */
    static filterInstalled(installations: PluginInstallation[]): PluginInstallation[];
    /**
     * Get failed installations only
     */
    static filterFailed(installations: PluginInstallation[]): PluginInstallation[];
    /**
     * Get in-progress installations only
     */
    static filterInProgress(installations: PluginInstallation[]): PluginInstallation[];
    /**
     * Get uninstalled plugins only
     */
    static filterUninstalled(installations: PluginInstallation[]): PluginInstallation[];
    /**
     * Filter active installations (installed and activated)
     */
    static filterActive(installations: PluginInstallation[]): PluginInstallation[];
    /**
     * Filter installations by plugin
     */
    static filterByPlugin(installations: PluginInstallation[], pluginId: string): PluginInstallation[];
    /**
     * Filter installations by user
     */
    static filterByInstaller(installations: PluginInstallation[], installedById: string): PluginInstallation[];
    /**
     * Sort installations by installation date (newest first)
     */
    static sortByInstallDate(installations: PluginInstallation[]): PluginInstallation[];
    /**
     * Sort installations by creation date (newest first)
     */
    static sortByCreationDate(installations: PluginInstallation[]): PluginInstallation[];
    /**
     * Find latest installation for a plugin
     */
    static findLatestForPlugin(installations: PluginInstallation[], pluginId: string): PluginInstallation | undefined;
    /**
     * Check if plugin is installed by a specific user
     */
    static isPluginInstalledByUser(installations: PluginInstallation[], pluginId: string, installedById: string): boolean;
    /**
     * Group installations by status
     */
    static groupByStatus(installations: PluginInstallation[]): Record<PluginInstallationStatus, PluginInstallation[]>;
    /**
     * Group installations by plugin
     */
    static groupByPlugin(installations: PluginInstallation[]): Record<string, PluginInstallation[]>;
    /**
     * Calculate average installation time for successful installations
     */
    static calculateAverageInstallTime(installations: PluginInstallation[]): number | undefined;
    /**
     * Get installation statistics
     */
    static getStatistics(installations: PluginInstallation[]): {
        total: number;
        byStatus: Record<PluginInstallationStatus, number>;
        active: number;
        successRate: number;
        averageInstallTime?: number;
    };
}
