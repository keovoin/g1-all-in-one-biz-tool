import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { GetPluginSettingsByPluginIdQuery } from '../get-plugin-settings-by-plugin-id.query';
export declare class GetPluginSettingsByPluginIdHandler implements IQueryHandler<GetPluginSettingsByPluginIdQuery> {
    private readonly pluginSettingService;
    constructor(pluginSettingService: PluginSettingService);
    execute(query: GetPluginSettingsByPluginIdQuery): Promise<IPluginSetting[]>;
}
