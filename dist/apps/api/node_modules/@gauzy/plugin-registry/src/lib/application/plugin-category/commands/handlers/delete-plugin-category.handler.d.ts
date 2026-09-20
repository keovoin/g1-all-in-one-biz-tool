import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { PluginCategoryService } from '../../../../domain';
import { DeletePluginCategoryCommand } from '../delete-plugin-category.command';
export declare class DeletePluginCategoryHandler implements ICommandHandler<DeletePluginCategoryCommand> {
    private readonly pluginCategoryService;
    constructor(pluginCategoryService: PluginCategoryService);
    execute(command: DeletePluginCategoryCommand): Promise<DeleteResult>;
}
