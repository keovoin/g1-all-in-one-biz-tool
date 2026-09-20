import { ICommand } from '@nestjs/cqrs';
import { IPluginTagCreateInput } from '../../../shared';
/**
 * Command to create a new plugin-tag relationship
 */
export declare class CreatePluginTagCommand implements ICommand {
    readonly input: IPluginTagCreateInput;
    static readonly type = "[PluginTag] Create Plugin Tag";
    constructor(input: IPluginTagCreateInput);
}
