import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class RecoverPluginVersionCommand implements ICommand {
    readonly versionId: ID;
    readonly pluginId: ID;
    static readonly type = "[Plugin Version] Recover";
    constructor(versionId: ID, pluginId: ID);
}
