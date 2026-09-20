import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DeletePluginSourceCommand implements ICommand {
    readonly sourceId: ID;
    readonly versionId: ID;
    readonly pluginId: ID;
    static readonly type = "[Plugin] Delete Source";
    constructor(sourceId: ID, versionId: ID, pluginId: ID);
}
