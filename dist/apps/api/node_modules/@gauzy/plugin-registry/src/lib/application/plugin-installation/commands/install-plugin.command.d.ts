import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { InstallPluginDTO } from '../../../shared';
export declare class InstallPluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly input: InstallPluginDTO;
    static readonly type = "[Plugin] Install";
    constructor(pluginId: ID, input: InstallPluginDTO);
}
