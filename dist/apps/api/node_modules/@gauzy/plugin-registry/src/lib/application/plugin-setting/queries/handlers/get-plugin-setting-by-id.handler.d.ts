import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { GetPluginSettingByIdQuery } from '../get-plugin-setting-by-id.query';
export declare class GetPluginSettingByIdHandler implements IQueryHandler<GetPluginSettingByIdQuery> {
    private readonly pluginSettingService;
    constructor(pluginSettingService: PluginSettingService);
    execute(query: GetPluginSettingByIdQuery): Promise<IPluginSetting>;
}
