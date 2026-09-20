import { ICommandHandler } from '@nestjs/cqrs';
import { PluginTagService } from '../../../../domain';
import { CreatePluginTagCommand } from '../create-plugin-tag.command';
import { IPluginTag } from '../../../../shared';
/**
 * Handler for creating plugin-tag relationships
 */
export declare class CreatePluginTagHandler implements ICommandHandler<CreatePluginTagCommand> {
    private readonly pluginTagService;
    private readonly logger;
    constructor(pluginTagService: PluginTagService);
    /**
     * Execute the create plugin-tag command
     *
     * @param command - The create command
     * @returns Promise<IPluginTag>
     */
    execute(command: CreatePluginTagCommand): Promise<IPluginTag>;
}
