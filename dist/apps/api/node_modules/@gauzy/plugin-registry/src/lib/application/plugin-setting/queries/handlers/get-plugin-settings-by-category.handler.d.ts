import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { GetPluginSettingsByCategoryQuery } from '../get-plugin-settings-by-category.query';
export declare class GetPluginSettingsByCategoryHandler implements IQueryHandler<GetPluginSettingsByCategoryQuery> {
    private readonly pluginSettingService;
    constructor(pluginSettingService: PluginSettingService);
    execute(query: GetPluginSettingsByCategoryQuery): Promise<IPluginSetting[]>;
}
