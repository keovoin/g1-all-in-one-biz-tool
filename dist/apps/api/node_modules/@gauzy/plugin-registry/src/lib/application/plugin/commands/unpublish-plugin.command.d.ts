import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class UnpublishPluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly reason?: string;
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin] Unpublish";
    constructor(pluginId: ID, reason?: string, tenantId?: ID, organizationId?: ID, userId?: ID);
}
