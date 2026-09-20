import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { UpdatePluginTenantDTO } from '../../../shared/dto/update-plugin-tenant.dto';
export declare class UpdatePluginTenantCommand implements ICommand {
    readonly id: ID;
    readonly input: UpdatePluginTenantDTO;
    static readonly type = "[Plugin Tenant] Update";
    constructor(id: ID, input: UpdatePluginTenantDTO);
}
