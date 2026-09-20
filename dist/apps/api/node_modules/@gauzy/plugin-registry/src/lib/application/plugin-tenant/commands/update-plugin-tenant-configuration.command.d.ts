import { ICommand } from '@nestjs/cqrs';
import { PluginTenantConfigurationDTO } from '../../../shared/dto/plugin-tenant-configuration.dto';
export declare class UpdatePluginTenantConfigurationCommand implements ICommand {
    readonly input: PluginTenantConfigurationDTO;
    static readonly type = "[Plugin Tenant] Update Configuration";
    constructor(input: PluginTenantConfigurationDTO);
}
