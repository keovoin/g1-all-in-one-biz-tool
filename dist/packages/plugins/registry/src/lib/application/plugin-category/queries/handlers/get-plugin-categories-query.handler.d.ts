import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginCategoryService } from '../../../../domain';
import { IPluginCategory } from '../../../../shared';
import { GetPluginCategoriesQuery } from '../get-plugin-categories.query';
export declare class GetPluginCategoriesHandler implements IQueryHandler<GetPluginCategoriesQuery> {
    private readonly pluginCategoryService;
    constructor(pluginCategoryService: PluginCategoryService);
    execute(query: GetPluginCategoriesQuery): Promise<IPagination<IPluginCategory>>;
}
