"use strict";
var PluginInstallationSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginInstallationSubscriber = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const plugin_installation_entity_1 = require("../../domain/entities/plugin-installation.entity");
const plugin_version_service_1 = require("../../domain/services/plugin-version.service");
const plugin_service_1 = require("../../domain/services/plugin.service");
let PluginInstallationSubscriber = PluginInstallationSubscriber_1 = class PluginInstallationSubscriber {
    constructor(pluginVersionService, pluginService, dataSource) {
        this.pluginVersionService = pluginVersionService;
        this.pluginService = pluginService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(PluginInstallationSubscriber_1.name);
        dataSource.subscribers.push(this);
    }
    /**
     * Indicates that this subscriber only listens to PluginInstallation events
     */
    listenTo() {
        return plugin_installation_entity_1.PluginInstallation;
    }
    /**
     * Called after entity insertion
     */
    async afterInsert(event) {
        const installation = event.entity;
        // Early return if installation is invalid or not in INSTALLED status
        if (!installation || installation.status !== contracts_1.PluginInstallationStatus.INSTALLED) {
            this.logger.debug('Skipping download count increment: installation invalid or not in INSTALLED status');
            return;
        }
        // Early return if versionId is missing
        const { versionId, pluginId } = installation;
        if (!versionId || !pluginId) {
            this.logger.debug(`Plugin installation missing ${!versionId ? 'versionId' : 'pluginId'}, cannot process`);
            return;
        }
        try {
            this.logger.debug(`Processing installation for plugin: ${pluginId}, version: ${versionId}`);
            // Execute both operations in parallel for better performance
            await Promise.all([this.incrementDownloadCount(versionId), this.updatePluginLastDownloaded(pluginId)]);
        }
        catch (error) {
            // Log error but don't throw to prevent disrupting the main transaction
            this.logger.error(`Error processing plugin installation: ${error.message}`, error.stack);
        }
    }
    /**
     * Increment the download count for a specific version
     */
    async incrementDownloadCount(versionId) {
        try {
            const version = await this.pluginVersionService.findOneByOptions({
                where: { id: versionId }
            });
            if (!version) {
                this.logger.warn(`Plugin version not found with ID: ${versionId}`);
                return;
            }
            // Increment the download count
            version.downloadCount = (version.downloadCount || 0) + 1;
            // Save the updated version
            await this.pluginVersionService.save(version);
            this.logger.debug(`Download count successfully incremented for version: ${versionId}`);
        }
        catch (error) {
            this.logger.error(`Error incrementing download count: ${error.message}`);
            throw error; // Re-throw to be caught by the parent try-catch
        }
    }
    /**
     * Update the last downloaded timestamp for a plugin
     */
    async updatePluginLastDownloaded(pluginId) {
        try {
            await this.pluginService.update(pluginId, {
                lastDownloadedAt: new Date()
            });
            this.logger.debug(`Last download timestamp updated for plugin: ${pluginId}`);
        }
        catch (error) {
            this.logger.error(`Error updating plugin last download time: ${error.message}`);
            throw error; // Re-throw to be caught by the parent try-catch
        }
    }
};
exports.PluginInstallationSubscriber = PluginInstallationSubscriber;
exports.PluginInstallationSubscriber = PluginInstallationSubscriber = PluginInstallationSubscriber_1 = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)(),
    tslib_1.__metadata("design:paramtypes", [plugin_version_service_1.PluginVersionService,
        plugin_service_1.PluginService,
        typeorm_1.DataSource])
], PluginInstallationSubscriber);
//# sourceMappingURL=plugin-installation.subscriber.js.map