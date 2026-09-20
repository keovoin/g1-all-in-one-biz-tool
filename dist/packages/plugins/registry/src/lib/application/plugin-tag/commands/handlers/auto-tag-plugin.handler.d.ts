import { TagService } from '@gauzy/core';
import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { IPluginTagBulkCreateResponse } from '../../../../shared';
import { AutoTagPluginCommand } from '../auto-tag-plugin.command';
/**
 * Handler for automatically tagging plugins based on their properties
 */
export declare class AutoTagPluginHandler implements ICommandHandler<AutoTagPluginCommand> {
    private readonly tagService;
    private readonly commandBus;
    private readonly logger;
    constructor(tagService: TagService, commandBus: CommandBus);
    /**
     * Execute the auto-tag plugin command
     *
     * @param command - The auto-tag command
     * @returns Promise<IPluginTagBulkCreateResponse>
     */
    execute(command: AutoTagPluginCommand): Promise<IPluginTagBulkCreateResponse>;
    /**
     * Extract potential tag names from plugin data
     *
     * @param pluginData - Plugin data to extract tags from
     * @returns string[]
     */
    private extractTagsFromPluginData;
    /**
     * Extract potential tags from text
     *
     * @param text - Text to extract tags from
     * @returns Set<string>
     */
    private extractTagsFromText;
    /**
     * Check if a tag name is valid
     *
     * @param tag - Tag name to validate
     * @returns boolean
     */
    private isValidTag;
    /**
     * Generate a color for a tag based on its name
     *
     * @param tagName - Name of the tag
     * @returns string - Hex color code
     */
    private generateTagColor;
}
