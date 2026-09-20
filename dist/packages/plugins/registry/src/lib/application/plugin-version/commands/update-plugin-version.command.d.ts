import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { UpdatePluginVersionDTO } from '../../../shared';
export declare class UpdatePluginVersionCommand implements ICommand {
    readonly pluginId: ID;
    readonly versionId: ID;
    readonly input: UpdatePluginVersionDTO;
    static readonly type = "[Plugin Version] Update";
    constructor(pluginId: ID, versionId: ID, input: UpdatePluginVersionDTO);
}
