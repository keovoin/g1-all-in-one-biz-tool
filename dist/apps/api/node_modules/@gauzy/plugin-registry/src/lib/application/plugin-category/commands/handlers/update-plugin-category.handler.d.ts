import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { PluginCategoryService } from '../../../../domain';
import { IPluginCategory } from '../../../../shared';
import { UpdatePluginCategoryCommand } from '../update-plugin-category.command';
export declare class UpdatePluginCategoryHandler implements ICommandHandler<UpdatePluginCategoryCommand> {
    private readonly pluginCategoryService;
    constructor(pluginCategoryService: PluginCategoryService);
    execute(command: UpdatePluginCategoryCommand): Promise<IPluginCategory | UpdateResult>;
}
