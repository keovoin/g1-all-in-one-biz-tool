import { ICommand } from '@nestjs/cqrs';
import { CreatePluginTenantDTO } from '../../../shared/dto/create-plugin-tenant.dto';
export declare class CreatePluginTenantCommand implements ICommand {
    readonly input: CreatePluginTenantDTO;
    static readonly type = "[Plugin Tenant] Create";
    constructor(input: CreatePluginTenantDTO);
}
