import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { UpdatePluginDTO } from '../../../shared';
export declare class UpdatePluginCommand implements ICommand {
    readonly id: ID;
    readonly input: UpdatePluginDTO;
    static readonly type = "[Plugin] Update";
    constructor(id: ID, input: UpdatePluginDTO);
}
