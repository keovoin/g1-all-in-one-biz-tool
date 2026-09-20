import { DataSource, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { PluginInstallation } from '../../domain/entities/plugin-installation.entity';
import { PluginVersionService } from '../../domain/services/plugin-version.service';
import { PluginService } from '../../domain/services/plugin.service';
export declare class PluginInstallationSubscriber implements EntitySubscriberInterface<PluginInstallation> {
    private readonly pluginVersionService;
    private readonly pluginService;
    readonly dataSource: DataSource;
    private readonly logger;
    constructor(pluginVersionService: PluginVersionService, pluginService: PluginService, dataSource: DataSource);
    /**
     * Indicates that this subscriber only listens to PluginInstallation events
     */
    listenTo(): typeof PluginInstallation;
    /**
     * Called after entity insertion
     */
    afterInsert(event: InsertEvent<PluginInstallation>): Promise<void>;
    /**
     * Increment the download count for a specific version
     */
    private incrementDownloadCount;
    /**
     * Update the last downloaded timestamp for a plugin
     */
    private updatePluginLastDownloaded;
}
