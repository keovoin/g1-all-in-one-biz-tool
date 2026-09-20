import { BaseEntityEventSubscriber } from '@gauzy/core';
import { DataSource, InsertEvent, UpdateEvent } from 'typeorm';
import { PluginVersion } from '../../domain/entities/plugin-version.entity';
import { PluginSecurityService } from '../../domain/services/plugin-security.service';
/**
 * Subscriber that handles security-related operations for PluginVersion entities.
 * Automatically generates checksums and signatures for newly created plugin versions.
 */
export declare class PluginVersionSubscriber extends BaseEntityEventSubscriber<PluginVersion> {
    private readonly pluginSecurityService;
    readonly dataSource: DataSource;
    private readonly logger;
    constructor(pluginSecurityService: PluginSecurityService, dataSource: DataSource);
    /**
     * Specifies the entity this subscriber listens to
     */
    listenTo(): typeof PluginVersion;
    /**
     * After insert hook to generate and assign security credentials
     * @param event The insert event containing the newly created entity
     */
    afterInsert(event: InsertEvent<PluginVersion>): Promise<void>;
    /**
     * Prevent signature or checksum modification after creation
     */
    beforeUpdate(event: UpdateEvent<PluginVersion>): Promise<void>;
}
