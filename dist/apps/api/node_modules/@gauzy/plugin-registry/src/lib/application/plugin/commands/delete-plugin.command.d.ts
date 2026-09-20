import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DeletePluginCommand implements ICommand {
    readonly pluginId: ID;
    static readonly type = "[Plugin] Delete";
    constructor(pluginId: ID);
}
