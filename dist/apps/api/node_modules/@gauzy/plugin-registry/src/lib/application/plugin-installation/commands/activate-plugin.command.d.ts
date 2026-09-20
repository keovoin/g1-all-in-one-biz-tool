import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ActivatePluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly installationId: ID;
    static readonly type = "[Plugin] Activate";
    constructor(pluginId: ID, installationId: ID);
}
