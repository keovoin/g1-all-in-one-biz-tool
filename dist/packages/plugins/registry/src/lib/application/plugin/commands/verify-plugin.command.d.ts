import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { VerifyPluginDTO } from '../../../shared';
export declare class VerifyPluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly input: VerifyPluginDTO;
    static readonly type = "[Plugin] Verify Plugin";
    constructor(pluginId: ID, input: VerifyPluginDTO);
}
