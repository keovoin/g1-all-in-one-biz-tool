import { IQueryHandler } from '@nestjs/cqrs';
import { PluginCategoryService } from '../../../../domain';
import { IPluginCategory } from '../../../../shared';
import { GetPluginCategoryQuery } from '../get-plugin-category.query';
export declare class GetPluginCategoryHandler implements IQueryHandler<GetPluginCategoryQuery> {
    private readonly pluginCategoryService;
    constructor(pluginCategoryService: PluginCategoryService);
    execute(query: GetPluginCategoryQuery): Promise<IPluginCategory>;
}
