import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { GetPluginSettingsByKeyQuery } from '../get-plugin-setting-by-key.query';
export declare class GetPluginSettingByKeyHandler implements IQueryHandler<GetPluginSettingsByKeyQuery> {
    private readonly pluginSettingService;
    constructor(pluginSettingService: PluginSettingService);
    execute(query: GetPluginSettingsByKeyQuery): Promise<IPluginSetting | null>;
}
