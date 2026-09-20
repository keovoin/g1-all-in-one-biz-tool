import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DeletePluginVersionCommand implements ICommand {
    readonly versionId: ID;
    readonly pluginId: ID;
    static readonly type = "[Plugin] Delete Version";
    constructor(versionId: ID, pluginId: ID);
}
