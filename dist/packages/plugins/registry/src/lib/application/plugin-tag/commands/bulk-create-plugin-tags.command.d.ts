import { ICommand } from '@nestjs/cqrs';
import { IPluginTagBulkCreateInput } from '../../../shared';
/**
 * Command to bulk create plugin-tag relationships
 */
export declare class BulkCreatePluginTagsCommand implements ICommand {
    readonly input: IPluginTagBulkCreateInput;
    static readonly type = "[PluginTag] Bulk Create Plugin Tags";
    constructor(input: IPluginTagBulkCreateInput);
}
