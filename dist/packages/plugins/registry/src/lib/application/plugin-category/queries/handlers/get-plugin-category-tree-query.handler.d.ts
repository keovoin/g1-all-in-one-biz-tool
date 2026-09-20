import { IQueryHandler } from '@nestjs/cqrs';
import { PluginCategoryService } from '../../../../domain';
import { IPluginCategoryTree } from '../../../../shared';
import { GetPluginCategoryTreeQuery } from '../get-plugin-category-tree.query';
export declare class GetPluginCategoryTreeHandler implements IQueryHandler<GetPluginCategoryTreeQuery> {
    private readonly pluginCategoryService;
    constructor(pluginCategoryService: PluginCategoryService);
    execute(query: GetPluginCategoryTreeQuery): Promise<IPluginCategoryTree[]>;
}
