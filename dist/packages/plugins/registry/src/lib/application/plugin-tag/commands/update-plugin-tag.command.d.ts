import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { IPluginTagBulkUpdateInput, IPluginTagPriorityUpdateInput, IPluginTagUpdateInput } from '../../../shared';
/**
 * Command to update a single plugin-tag relationship
 */
export declare class UpdatePluginTagCommand implements ICommand {
    readonly id: ID;
    readonly input: IPluginTagUpdateInput;
    static readonly type = "[PluginTag] Update";
    constructor(id: ID, input: IPluginTagUpdateInput);
}
/**
 * Command to bulk update plugin-tag relationships
 */
export declare class BulkUpdatePluginTagsCommand implements ICommand {
    readonly updates: IPluginTagBulkUpdateInput[];
    static readonly type = "[PluginTag] Bulk Update";
    constructor(updates: IPluginTagBulkUpdateInput[]);
}
/**
 * Command to update priority order of plugin tags
 */
export declare class UpdatePluginTagsPriorityCommand implements ICommand {
    readonly priorities: IPluginTagPriorityUpdateInput[];
    static readonly type = "[PluginTag] Update Priority";
    constructor(priorities: IPluginTagPriorityUpdateInput[]);
}
