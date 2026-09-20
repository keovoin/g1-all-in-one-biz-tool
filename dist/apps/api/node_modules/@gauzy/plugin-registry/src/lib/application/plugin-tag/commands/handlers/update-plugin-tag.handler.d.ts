import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTagService } from '../../../../domain';
import { IPluginTag } from '../../../../shared';
import { BulkUpdatePluginTagsCommand, UpdatePluginTagCommand, UpdatePluginTagsPriorityCommand } from '../update-plugin-tag.command';
/**
 * Handler for updating single plugin-tag relationship
 */
export declare class UpdatePluginTagHandler implements ICommandHandler<UpdatePluginTagCommand> {
    private readonly pluginTagService;
    private readonly logger;
    constructor(pluginTagService: PluginTagService);
    /**
     * Execute the update plugin-tag command
     *
     * @param command - The update command
     * @returns Promise<IPluginTag>
     */
    execute(command: UpdatePluginTagCommand): Promise<IPluginTag>;
}
/**
 * Handler for bulk updating plugin-tag relationships
 */
export declare class BulkUpdatePluginTagsHandler implements ICommandHandler<BulkUpdatePluginTagsCommand> {
    private readonly pluginTagService;
    private readonly logger;
    constructor(pluginTagService: PluginTagService);
    /**
     * Execute the bulk update plugin-tags command
     *
     * @param command - The bulk update command
     * @returns Promise<IPluginTag[]>
     */
    execute(command: BulkUpdatePluginTagsCommand): Promise<IPluginTag[]>;
}
/**
 * Handler for updating priority order of plugin tags
 */
export declare class UpdatePluginTagsPriorityHandler implements ICommandHandler<UpdatePluginTagsPriorityCommand> {
    private readonly pluginTagService;
    private readonly logger;
    constructor(pluginTagService: PluginTagService);
    /**
     * Execute the update plugin tags priority command
     *
     * @param command - The priority update command
     * @returns Promise<IPluginTag[]>
     */
    execute(command: UpdatePluginTagsPriorityCommand): Promise<IPluginTag[]>;
}
