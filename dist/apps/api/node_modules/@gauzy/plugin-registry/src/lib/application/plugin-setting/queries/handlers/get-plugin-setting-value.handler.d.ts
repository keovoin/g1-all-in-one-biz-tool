import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { GetPluginSettingValueQuery } from '../get-plugin-setting-value.query';
export declare class GetPluginSettingValueHandler implements IQueryHandler<GetPluginSettingValueQuery> {
    private readonly pluginSettingService;
    constructor(pluginSettingService: PluginSettingService);
    execute(query: GetPluginSettingValueQuery): Promise<any>;
}
