import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { CopyPluginPlanDTO } from '../../../shared';
export declare class CopyPluginPlanCommand implements ICommand {
    readonly copyDto: CopyPluginPlanDTO;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Subscription Plan] Copy";
    constructor(copyDto: CopyPluginPlanDTO, tenantId: ID, organizationId?: ID, userId?: ID);
}
