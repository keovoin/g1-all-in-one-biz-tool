import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSettingService } from '../../../../domain';
import { IPluginSetting } from '../../../../shared';
import { GetPluginSettingsByTenantIdQuery } from '../get-plugin-settings-by-tenant-id.query';
export declare class GetPluginSettingsByTenantIdHandler implements IQueryHandler<GetPluginSettingsByTenantIdQuery> {
    private readonly pluginSettingService;
    constructor(pluginSettingService: PluginSettingService);
    execute(query: GetPluginSettingsByTenantIdQuery): Promise<IPluginSetting[]>;
}
