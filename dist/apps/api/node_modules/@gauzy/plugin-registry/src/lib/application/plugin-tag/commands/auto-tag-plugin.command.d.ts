import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
/**
 * Command to automatically create tags for a plugin based on its properties
 */
export declare class AutoTagPluginCommand implements ICommand {
    readonly pluginId: ID;
    readonly pluginData: {
        name?: string;
        description?: string;
        type?: string;
        category?: string;
        keywords?: string[];
        technologies?: string[];
    };
    readonly options?: {
        createMissingTags?: boolean;
        overwriteExisting?: boolean;
        tenantId?: ID;
        organizationId?: ID;
    };
    static readonly type = "[PluginTag] Auto Tag Plugin";
    constructor(pluginId: ID, pluginData: {
        name?: string;
        description?: string;
        type?: string;
        category?: string;
        keywords?: string[];
        technologies?: string[];
    }, options?: {
        createMissingTags?: boolean;
        overwriteExisting?: boolean;
        tenantId?: ID;
        organizationId?: ID;
    });
}
