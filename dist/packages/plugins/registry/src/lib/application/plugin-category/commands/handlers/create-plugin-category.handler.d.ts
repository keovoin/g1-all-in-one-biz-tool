import { ICommandHandler } from '@nestjs/cqrs';
import { PluginCategoryService } from '../../../../domain';
import { IPluginCategory } from '../../../../shared';
import { CreatePluginCategoryCommand } from '../create-plugin-category.command';
export declare class CreatePluginCategoryHandler implements ICommandHandler<CreatePluginCategoryCommand> {
    private readonly pluginCategoryService;
    constructor(pluginCategoryService: PluginCategoryService);
    execute(command: CreatePluginCategoryCommand): Promise<IPluginCategory>;
}
