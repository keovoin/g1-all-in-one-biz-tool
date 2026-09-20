import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { IPluginSource } from '../../../shared';
export declare class CreatePluginSourceCommand implements ICommand {
    readonly pluginId: ID;
    readonly versionId: ID;
    readonly input: IPluginSource[];
    static readonly type = "[Plugin Source] Create";
    constructor(pluginId: ID, versionId: ID, input: IPluginSource[]);
}
