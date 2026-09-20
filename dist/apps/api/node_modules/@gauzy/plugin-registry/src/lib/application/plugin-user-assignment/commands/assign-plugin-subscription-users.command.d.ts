import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { AssignPluginSubscriptionDTO } from '../../../shared';
export declare class AssignPluginSubscriptionUsersCommand implements ICommand {
    readonly pluginId: ID;
    readonly assignDto: AssignPluginSubscriptionDTO;
    readonly tenantId: ID;
    readonly organizationId: ID;
    readonly requestingUserId: ID;
    static readonly type = "[Plugin Subscription Access] Assign Users";
    constructor(pluginId: ID, assignDto: AssignPluginSubscriptionDTO, tenantId: ID, organizationId: ID, requestingUserId: ID);
}
