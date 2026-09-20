import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class UninstallPluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly installationId: ID;
    static readonly type = "[Plugin] Uninstall";
    constructor(pluginId: ID, installationId: ID);
}
