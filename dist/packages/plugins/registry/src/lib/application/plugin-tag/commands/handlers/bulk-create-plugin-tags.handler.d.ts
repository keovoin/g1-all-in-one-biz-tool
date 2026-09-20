import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTagService } from '../../../../domain';
import { IPluginTagBulkCreateResponse } from '../../../../shared';
import { BulkCreatePluginTagsCommand } from '../bulk-create-plugin-tags.command';
/**
 * Handler for bulk creating plugin-tag relationships
 */
export declare class BulkCreatePluginTagsHandler implements ICommandHandler<BulkCreatePluginTagsCommand> {
    private readonly pluginTagService;
    private readonly logger;
    constructor(pluginTagService: PluginTagService);
    /**
     * Execute the bulk create plugin-tags command
     *
     * @param command - The bulk create command
     * @returns Promise<IPluginTagBulkCreateResponse>
     */
    execute(command: BulkCreatePluginTagsCommand): Promise<IPluginTagBulkCreateResponse>;
}
