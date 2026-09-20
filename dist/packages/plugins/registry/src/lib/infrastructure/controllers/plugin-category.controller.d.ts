import { IPagination } from '@gauzy/contracts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePluginCategoryDTO, IPluginCategory, IPluginCategoryTree, PluginCategoryQueryDTO, UpdatePluginCategoryDTO } from '../../shared';
export declare class PluginCategoryController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Create a new plugin category
     */
    create(input: CreatePluginCategoryDTO): Promise<IPluginCategory>;
    /**
     * Get all plugin categories with optional tree format
     */
    findAll(format?: 'tree' | 'flat', options?: PluginCategoryQueryDTO): Promise<IPagination<IPluginCategory> | IPluginCategoryTree[]>;
    /**
     * Get plugin category by ID
     */
    findOne(id: string, relations?: string[]): Promise<IPluginCategory>;
    /**
     * Update plugin category (full replacement)
     */
    update(id: string, input: UpdatePluginCategoryDTO): Promise<IPluginCategory>;
    /**
     * Partially update plugin category
     */
    partialUpdate(id: string, input: Partial<UpdatePluginCategoryDTO>): Promise<IPluginCategory>;
    /**
     * Delete plugin category
     */
    delete(id: string): Promise<void>;
}
