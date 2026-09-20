import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { CreatePluginSettingDTO } from '../../../shared';
export declare class CreatePluginSettingCommand implements ICommand {
    readonly createDto: CreatePluginSettingDTO;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Setting] Create";
    constructor(createDto: CreatePluginSettingDTO, tenantId: ID, organizationId?: ID, userId?: ID);
}
