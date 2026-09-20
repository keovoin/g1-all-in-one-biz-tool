import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { PluginTagService } from '../../../../domain';
import { IPluginTag } from '../../../../shared';
import { BulkDeletePluginTagsCommand, DeletePluginTagCommand, ReplacePluginTagsCommand } from '../delete-plugin-tag.command';
/**
 * Handler for deleting single plugin-tag relationship
 */
export declare class DeletePluginTagHandler implements ICommandHandler<DeletePluginTagCommand> {
    private readonly pluginTagService;
    private readonly logger;
    constructor(pluginTagService: PluginTagService);
    /**
     * Execute the delete plugin-tag command
     *
     * @param command - The delete command
     * @returns Promise<DeleteResult>
     */
    execute(command: DeletePluginTagCommand): Promise<DeleteResult>;
}
/**
 * Handler for bulk deleting plugin-tag relationships
 */
export declare class BulkDeletePluginTagsHandler implements ICommandHandler<BulkDeletePluginTagsCommand> {
    private readonly pluginTagService;
    private readonly logger;
    constructor(pluginTagService: PluginTagService);
    /**
     * Execute the bulk delete plugin-tags command
     *
     * @param command - The bulk delete command
     * @returns Promise<number>
     */
    execute(command: BulkDeletePluginTagsCommand): Promise<number>;
}
/**
 * Handler for replacing all tags for a plugin
 */
export declare class ReplacePluginTagsHandler implements ICommandHandler<ReplacePluginTagsCommand> {
    private readonly pluginTagService;
    private readonly logger;
    constructor(pluginTagService: PluginTagService);
    /**
     * Execute the replace plugin tags command
     *
     * @param command - The replace command
     * @returns Promise<IPluginTag[]>
     */
    execute(command: ReplacePluginTagsCommand): Promise<IPluginTag[]>;
}
