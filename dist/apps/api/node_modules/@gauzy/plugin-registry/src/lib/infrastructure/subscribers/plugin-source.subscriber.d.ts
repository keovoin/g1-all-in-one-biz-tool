import { BaseEntityEventSubscriber } from '@gauzy/core';
import { DataSource, InsertEvent, RemoveEvent } from 'typeorm';
import { PluginSource } from '../../domain/entities/plugin-source.entity';
export declare class PluginSourceSubscriber extends BaseEntityEventSubscriber<PluginSource> {
    readonly dataSource: DataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    listenTo(): typeof PluginSource;
    beforeInsert(event: InsertEvent<PluginSource>): Promise<void>;
    afterRemove(event: RemoveEvent<PluginSource>): Promise<void>;
    afterLoad(entity: PluginSource): Promise<void>;
    /**
     * Generates a full name for a plugin source based on its type and properties
     * @param pluginSource The plugin source to generate the full name for
     * @returns A descriptive full name for the plugin source
     */
    private generateFullName;
    private getFileStorageProvider;
}
