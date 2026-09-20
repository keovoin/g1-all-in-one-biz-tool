import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class EnablePluginTenantCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Plugin Tenant] Enable";
    constructor(id: ID);
}
