import { ID, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { IPluginTag, IPluginTagBulkCreateInput, IPluginTagBulkCreateResponse, IPluginTagBulkDeleteInput, IPluginTagBulkUpdateInput, IPluginTagCreateInput, IPluginTagPriorityUpdateInput, IPluginTagStatistics, IPluginsByTagsQuery, ITagsByPluginsQuery } from '../../shared/models/plugin-tag.model';
import { PluginTag } from '../entities/plugin-tag.entity';
import { MikroOrmPluginTagRepository } from '../repositories/mikro-orm-plugin-tag.repository';
import { TypeOrmPluginTagRepository } from '../repositories/type-orm-plugin-tag.repository';
/**
 * PluginTag Service
 *
 * Comprehensive service for managing plugin-tag relationships with advanced business logic.
 * Provides CRUD operations, bulk operations, analytics, and complex querying capabilities.
 *
 * Key Features:
 * - Standard CRUD operations with validation
 * - Bulk tag association/disassociation
 * - Plugin discovery by tags with advanced filtering
 * - Tag analytics and statistics
 * - Performance-optimized queries
 * - Multi-tenant support
 * - Data integrity validation
 */
export declare class PluginTagService extends TenantAwareCrudService<PluginTag> {
    readonly typeOrmPluginTagRepository: TypeOrmPluginTagRepository;
    readonly mikroOrmPluginTagRepository: MikroOrmPluginTagRepository;
    constructor(typeOrmPluginTagRepository: TypeOrmPluginTagRepository, mikroOrmPluginTagRepository: MikroOrmPluginTagRepository);
    /**
     * Create a new plugin-tag relationship
     *
     * @param entity - Plugin-tag creation data
     * @returns Promise<IPluginTag>
     * @throws BadRequestException if relationship already exists
     */
    createTag(entity: IPluginTagCreateInput): Promise<IPluginTag>;
    /**
     * Bulk create plugin-tag relationships
     *
     * @param input - Bulk creation data
     * @returns Promise<IPluginTagBulkCreateResponse>
     */
    bulkCreate(input: IPluginTagBulkCreateInput): Promise<IPluginTagBulkCreateResponse>;
    /**
     * Bulk delete plugin-tag relationships
     *
     * @param input - Bulk deletion criteria
     * @returns Promise<number> - Number of deleted relationships
     */
    bulkDelete(input: IPluginTagBulkDeleteInput): Promise<number>;
    /**
     * Bulk update plugin-tag relationships
     *
     * @param updates - Array of update operations
     * @returns Promise<IPluginTag[]> - Updated plugin-tag relationships
     */
    bulkUpdate(updates: IPluginTagBulkUpdateInput[]): Promise<IPluginTag[]>;
    /**
     * Update priority order of plugin tags
     *
     * @param priorities - Array of priority updates
     * @returns Promise<IPluginTag[]> - Updated plugin-tag relationships
     */
    updateTagsPriority(priorities: IPluginTagPriorityUpdateInput[]): Promise<IPluginTag[]>;
    /**
     * Find plugins by tags with advanced filtering
     *
     * @param query - Query parameters for plugin discovery
     * @returns Promise<IPagination<any>>
     */
    findPluginsByTags(query: IPluginsByTagsQuery): Promise<IPagination<any>>;
    /**
     * Find tags by plugins
     *
     * @param query - Query parameters for tag discovery
     * @returns Promise<IPagination<any>>
     */
    findTagsByPlugins(query: ITagsByPluginsQuery): Promise<IPagination<any>>;
    /**
     * Get plugin-tag statistics and analytics
     *
     * @param tenantId - Optional tenant filter
     * @param organizationId - Optional organization filter
     * @returns Promise<IPluginTagStatistics>
     */
    getStatistics(tenantId?: ID, organizationId?: ID): Promise<IPluginTagStatistics>;
    /**
     * Replace all tags for a plugin (remove existing, add new)
     *
     * @param pluginId - Plugin ID
     * @param tagIds - New tag IDs
     * @param tenantId - Optional tenant ID
     * @param organizationId - Optional organization ID
     * @returns Promise<IPluginTag[]>
     */
    replacePluginTags(pluginId: ID, tagIds: ID[], tenantId?: ID, organizationId?: ID): Promise<IPluginTag[]>;
    /**
     * Get plugins that share the most tags with a given plugin
     *
     * @param pluginId - Plugin ID to find similar plugins for
     * @param limit - Maximum number of similar plugins to return
     * @returns Promise<Array<{pluginId: ID, sharedTagsCount: number}>>
     */
    findSimilarPlugins(pluginId: ID, limit?: number): Promise<Array<{
        pluginId: ID;
        sharedTagsCount: number;
    }>>;
    /**
     * Validate plugin-tag relationship constraints
     *
     * @param pluginId - Plugin ID
     * @param tagId - Tag ID
     * @returns Promise<boolean>
     */
    validateRelationship(pluginId: ID, tagId: ID): Promise<boolean>;
}
