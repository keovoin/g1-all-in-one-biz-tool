import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class GeneratePluginLicenseCommand implements ICommand {
    readonly subscriptionId: ID;
    readonly pluginId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin License] Generate";
    constructor(subscriptionId: ID, pluginId: ID, tenantId: ID, organizationId?: ID, userId?: ID);
}
