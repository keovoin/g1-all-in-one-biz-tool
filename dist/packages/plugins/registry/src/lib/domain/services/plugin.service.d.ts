import { CrudService } from '@gauzy/core';
import { CommandBus } from '@nestjs/cqrs';
import { IPlugin } from '../../shared';
import { Plugin } from '../entities';
import { MikroOrmPluginRepository, TypeOrmPluginRepository } from '../repositories';
export declare class PluginService extends CrudService<Plugin> {
    readonly typeOrmPluginRepository: TypeOrmPluginRepository;
    readonly mikroOrmPluginRepository: MikroOrmPluginRepository;
    private readonly commandBus;
    private readonly logger;
    constructor(typeOrmPluginRepository: TypeOrmPluginRepository, mikroOrmPluginRepository: MikroOrmPluginRepository, commandBus: CommandBus);
    /**
     * Create a plugin with auto-tagging functionality
     *
     * @param entity - Plugin creation data
     * @returns Promise<Plugin>
     */
    createWithAutoTagging(entity: Partial<IPlugin>): Promise<IPlugin>;
    validatePluginOwnership(pluginId: string, userId: string): Promise<boolean>;
}
