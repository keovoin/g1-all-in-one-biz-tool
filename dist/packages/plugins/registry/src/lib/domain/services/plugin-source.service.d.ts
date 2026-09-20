import { TenantAwareCrudService } from '@gauzy/core';
import { IPluginSource } from '../../shared/models/plugin-source.model';
import { PluginSource } from '../entities/plugin-source.entity';
import { MikroOrmPluginSourceRepository } from '../repositories/mikro-orm-plugin-source.repository';
import { TypeOrmPluginSourceRepository } from '../repositories/type-orm-plugin-source.repository';
import { ID } from '@gauzy/contracts';
export declare class PluginSourceService extends TenantAwareCrudService<PluginSource> {
    readonly typeOrmPluginSourceRepository: TypeOrmPluginSourceRepository;
    readonly mikroOrmPluginSourceRepository: MikroOrmPluginSourceRepository;
    constructor(typeOrmPluginSourceRepository: TypeOrmPluginSourceRepository, mikroOrmPluginSourceRepository: MikroOrmPluginSourceRepository);
    saveSources(sources: PluginSource[]): Promise<IPluginSource[]>;
    /**
     * Creates and saves multiple plugin source entities.
     *
     * @param {IPluginSource[]} sources - The source data array.
     * @returns {Promise<IPluginSource[]>} - The created plugin sources.
     * @throws {BadRequestException} - If source data is missing.
     */
    createSources(sources: IPluginSource[]): Promise<IPluginSource[]>;
    /**
     * Updates a plugin source using the source service
     *
     * @param data - Source data to update
     * @param pluginId - ID of the plugin
     * @throws NotFoundException if source is not found
     */
    updateSource(data: Partial<IPluginSource>, versionId: ID): Promise<void>;
}
