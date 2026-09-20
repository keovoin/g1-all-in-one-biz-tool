import { ID } from '@gauzy/contracts';
import { PluginTag, PluginTagService } from '../../domain';
import { IPluginTag, ReplacePluginTagsDTO } from '../../shared';
/**
 * Plugin Tags Management Controller
 * Handles tag-related operations for plugins
 */
export declare class PluginTagsController {
    private readonly pluginTagService;
    constructor(pluginTagService: PluginTagService);
    /**
     * Get all tags for a specific plugin
     */
    getPluginTags(pluginId: ID): Promise<PluginTag[]>;
    /**
     * Replace all tags for a plugin
     */
    replacePluginTags(pluginId: ID, replaceDto: ReplacePluginTagsDTO): Promise<IPluginTag[]>;
}
/**
 * Plugin Recommendations Controller
 * Handles plugin recommendation and similarity operations
 */
export declare class PluginRecommendationsController {
    private readonly pluginTagService;
    constructor(pluginTagService: PluginTagService);
    /**
     * Find similar plugins based on shared tags
     */
    getPluginWithSimilar(pluginId: ID, similar?: boolean, limit?: number): Promise<{
        similar?: Array<{
            pluginId: ID;
            sharedTagsCount: number;
        }>;
    }>;
}
/**
 * Tag Plugins Controller
 * Handles plugin operations for specific tags
 */
export declare class TagPluginsController {
    private readonly pluginTagService;
    constructor(pluginTagService: PluginTagService);
    /**
     * Get all plugins for a specific tag
     */
    getTagPlugins(tagId: ID): Promise<PluginTag[]>;
}
