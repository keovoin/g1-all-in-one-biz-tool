import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class RecoverPluginSourceCommand implements ICommand {
    readonly sourceId: ID;
    readonly versionId: ID;
    readonly pluginId: ID;
    static readonly type = "[Plugin Source] Recover";
    constructor(sourceId: ID, versionId: ID, pluginId: ID);
}
