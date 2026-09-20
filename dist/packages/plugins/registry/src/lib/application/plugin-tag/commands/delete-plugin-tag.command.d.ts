import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { IPluginTagBulkDeleteInput } from '../../../shared';
/**
 * Command to delete a single plugin-tag relationship
 */
export declare class DeletePluginTagCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[PluginTag] Delete";
    constructor(id: ID);
}
/**
 * Command to bulk delete plugin-tag relationships
 */
export declare class BulkDeletePluginTagsCommand implements ICommand {
    readonly input: IPluginTagBulkDeleteInput;
    static readonly type = "[PluginTag] Bulk Delete";
    constructor(input: IPluginTagBulkDeleteInput);
}
/**
 * Command to replace all tags for a plugin
 */
export declare class ReplacePluginTagsCommand implements ICommand {
    readonly pluginId: ID;
    readonly tagIds: ID[];
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    static readonly type = "[PluginTag] Replace Plugin Tags";
    constructor(pluginId: ID, tagIds: ID[], tenantId?: ID, organizationId?: ID);
}
