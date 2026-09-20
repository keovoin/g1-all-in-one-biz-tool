import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DeletePluginTenantCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Plugin Tenant] Delete";
    constructor(id: ID);
}
