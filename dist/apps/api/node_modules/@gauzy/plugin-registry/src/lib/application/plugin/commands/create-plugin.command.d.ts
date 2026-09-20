import { ICommand } from '@nestjs/cqrs';
import { CreatePluginDTO } from '../../../shared';
export declare class CreatePluginCommand implements ICommand {
    readonly input: CreatePluginDTO;
    static readonly type = "[Plugins] Create";
    constructor(input: CreatePluginDTO);
}
