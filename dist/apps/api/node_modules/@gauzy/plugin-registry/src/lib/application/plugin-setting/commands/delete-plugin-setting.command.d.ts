import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DeletePluginSettingCommand implements ICommand {
    readonly id: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Setting] Delete";
    constructor(id: ID, tenantId: ID, organizationId?: ID, userId?: ID);
}
