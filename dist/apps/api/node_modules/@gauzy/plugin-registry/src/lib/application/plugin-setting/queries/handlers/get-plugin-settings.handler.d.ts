import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { GetPluginSettingsQuery } from '../get-plugin-settings.query';
export declare class GetPluginSettingsHandler implements IQueryHandler<GetPluginSettingsQuery> {
    private readonly pluginSettingService;
    constructor(pluginSettingService: PluginSettingService);
    execute(query: GetPluginSettingsQuery): Promise<IPagination<IPluginSetting>>;
}
