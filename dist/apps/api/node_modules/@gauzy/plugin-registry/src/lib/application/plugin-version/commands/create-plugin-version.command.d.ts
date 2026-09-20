import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { PluginVersionDTO } from '../../../shared';
/**
 * Command to create a new plugin version.
 */
export declare class CreatePluginVersionCommand implements ICommand {
    readonly pluginId: ID;
    readonly dto: PluginVersionDTO;
    /** Command type identifier */
    static readonly type = "[Plugin Version] Create";
    /**
     * Creates an instance of CreatePluginVersionCommand.
     *
     * @param {ID} pluginId - The unique identifier of the plugin.
     * @param {PluginVersionDTO} dto - The data transfer object containing the plugin version details.
     */
    constructor(pluginId: ID, dto: PluginVersionDTO);
}
