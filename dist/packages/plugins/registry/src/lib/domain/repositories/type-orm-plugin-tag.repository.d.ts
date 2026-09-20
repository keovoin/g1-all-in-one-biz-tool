import { Repository } from 'typeorm';
import { IPluginTag } from '../../shared';
import { PluginTag } from '../entities/plugin-tag.entity';
/**
 * TypeORM repository for PluginTag entity.
 *
 * This repository provides TypeORM-specific data access methods for plugin-tag relationships.
 * It extends the TypeORM Repository class to provide database operations for managing
 * the many-to-many relationship between plugins and tags.
 *
 * Business Logic Capabilities:
 * - CRUD operations on plugin-tag associations
 * - Complex queries for plugin discovery by tags
 * - Bulk operations for tag management
 * - Performance-optimized queries with proper indexing
 */
export declare class TypeOrmPluginTagRepository extends Repository<PluginTag> {
    readonly repository: Repository<PluginTag>;
    constructor(repository: Repository<PluginTag>);
    /**
     * Find all plugin-tag relationships for a specific plugin
     *
     * @param pluginId - The plugin ID to find tags for
     * @param relations - Optional relations to include
     * @returns Promise<PluginTag[]>
     */
    findByPluginId(pluginId: string, relations?: string[]): Promise<IPluginTag[]>;
    /**
     * Find all plugin-tag relationships for a specific tag
     *
     * @param tagId - The tag ID to find plugins for
     * @param relations - Optional relations to include
     * @returns Promise<PluginTag[]>
     */
    findByTagId(tagId: string, relations?: string[]): Promise<IPluginTag[]>;
    /**
     * Check if a plugin-tag relationship exists
     *
     * @param pluginId - The plugin ID
     * @param tagId - The tag ID
     * @returns Promise<boolean>
     */
    existsByPluginAndTag(pluginId: string, tagId: string): Promise<boolean>;
    /**
     * Remove all tags from a plugin
     *
     * @param pluginId - The plugin ID to remove tags from
     * @returns Promise<void>
     */
    removeAllTagsFromPlugin(pluginId: string): Promise<void>;
    /**
     * Remove all plugins from a tag
     *
     * @param tagId - The tag ID to remove plugins from
     * @returns Promise<void>
     */
    removeAllPluginsFromTag(tagId: string): Promise<void>;
    /**
     * Get plugins count by tag
     *
     * @param tagId - The tag ID
     * @returns Promise<number>
     */
    getPluginCountByTag(tagId: string): Promise<number>;
    /**
     * Get tags count by plugin
     *
     * @param pluginId - The plugin ID
     * @returns Promise<number>
     */
    getTagCountByPlugin(pluginId: string): Promise<number>;
}
