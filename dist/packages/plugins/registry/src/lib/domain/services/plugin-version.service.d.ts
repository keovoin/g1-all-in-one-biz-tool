import { ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { UpdatePluginVersionDTO } from '../../shared/dto/update-plugin-version.dto';
import { IPluginSource } from '../../shared/models/plugin-source.model';
import { IPluginVersion } from '../../shared/models/plugin-version.model';
import { IPlugin } from '../../shared/models/plugin.model';
import { PluginVersion } from '../entities/plugin-version.entity';
import { MikroOrmPluginVersionRepository } from '../repositories/mikro-orm-plugin-version.repository';
import { TypeOrmPluginVersionRepository } from '../repositories/type-orm-plugin-version.repository';
export declare class PluginVersionService extends TenantAwareCrudService<PluginVersion> {
    readonly typeOrmPluginVersionRepository: TypeOrmPluginVersionRepository;
    readonly mikroOrmPluginVersionRepository: MikroOrmPluginVersionRepository;
    constructor(typeOrmPluginVersionRepository: TypeOrmPluginVersionRepository, mikroOrmPluginVersionRepository: MikroOrmPluginVersionRepository);
    getTotalDownloadCount(pluginId: IPlugin['id']): Promise<number>;
    /**
     * Creates and saves a new plugin version entity.
     *
     * @param {IPluginVersion} versionData - The plugin version data.
     * @param {IPlugin} plugin - The associated plugin.
     * @param {IPluginSource[]} sources - The associated plugin sources.
     * @returns {Promise<IPluginVersion>} - The created plugin version.
     * @throws {BadRequestException} - If version data is missing.
     */
    createVersion(versionData: IPluginVersion, plugin: IPlugin, sources: IPluginSource[]): Promise<IPluginVersion>;
    /**
     * Updates a plugin version using the version service
     *
     * @param data - Version data to update
     * @param pluginId - ID of the plugin
     * @throws NotFoundException if version is not found
     */
    updateVersion(data: UpdatePluginVersionDTO, pluginId: ID): Promise<void>;
}
