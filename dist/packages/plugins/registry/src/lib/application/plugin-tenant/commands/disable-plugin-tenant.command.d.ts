import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DisablePluginTenantCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Plugin Tenant] Disable";
    constructor(id: ID);
}
