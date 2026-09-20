import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { UpdatePluginSettingDTO } from '../../../shared';
export declare class UpdatePluginSettingCommand implements ICommand {
    readonly id: ID;
    readonly updateDto: UpdatePluginSettingDTO;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly userId?: ID;
    static readonly type = "[Plugin Setting] Update";
    constructor(id: ID, updateDto: UpdatePluginSettingDTO, tenantId: ID, organizationId?: ID, userId?: ID);
}
