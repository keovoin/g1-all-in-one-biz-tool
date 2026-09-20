import { ID, IPagination } from '@gauzy/contracts';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PluginTag } from '../../domain/entities/plugin-tag.entity';
import { PluginTagService } from '../../domain/services/plugin-tag.service';
import { BulkCreatePluginTagDTO, BulkDeletePluginTagDTO, CreatePluginTagDTO, FindPluginTagDTO, UpdatePluginTagDTO } from '../../shared/dto/plugin-tag.dto';
import { IPluginTag, IPluginTagBulkCreateResponse } from '../../shared/models/plugin-tag.model';
/**
 * PluginTag Relationship Controller
 *
 * Pure RESTful API controller for managing plugin-tag relationship entities.
 * Focuses solely on CRUD operations for the plugin-tag relationship resource.
 *
 * Features:
 * - Standard CRUD operations for plugin-tag relationships
 * - Batch operations for bulk relationship management
 * - Query-based filtering and aggregation
 * - Multi-tenant support
 * - Full REST compliance
 *
 * Related Controllers:
 * - PluginTagsController: /plugins/{id}/tags (managing tags for a specific plugin)
 * - TagPluginsController: /tags/{id}/plugins (managing plugins for a specific tag)
 * - PluginRecommendationsController: /plugins/{id}?similar=true (plugin recommendations)
 */
export declare class PluginTagController {
    private readonly pluginTagService;
    constructor(pluginTagService: PluginTagService);
    /**
     * Get all plugin-tag relationships with optional filtering
     *
     * @param options Pagination and filtering options
     * @param filter Query filters
     * @param aggregate Type of aggregation (count, etc.)
     * @returns Paginated list of plugin-tag relationships or redirects to count endpoint
     */
    findAll(options: any, filter: FindPluginTagDTO, aggregate?: string): Promise<IPagination<PluginTag>>;
    /**
     * Get a specific plugin-tag relationship by ID
     *
     * @param id Plugin-tag relationship ID
     * @returns Plugin-tag relationship details
     */
    findById(id: ID): Promise<PluginTag>;
    /**
     * Create a new plugin-tag relationship
     *
     * @param createDto Plugin-tag creation data
     * @returns Created plugin-tag relationship
     */
    create(createDto: CreatePluginTagDTO): Promise<IPluginTag>;
    /**
     * Update a plugin-tag relationship
     *
     * @param id Plugin-tag relationship ID
     * @param updateDto Update data
     * @returns Updated plugin-tag relationship
     */
    update(id: ID, updateDto: UpdatePluginTagDTO): Promise<IPluginTag | UpdateResult>;
    /**
     * Delete a plugin-tag relationship
     *
     * @param id Plugin-tag relationship ID
     * @returns Deletion result
     */
    delete(id: ID): Promise<DeleteResult>;
    /**
     * Batch create plugin-tag relationships
     */
    batchCreate(bulkCreateDto: BulkCreatePluginTagDTO): Promise<IPluginTagBulkCreateResponse>;
    /**
     * Batch delete plugin-tag relationships
     */
    batchDelete(bulkDeleteDto: BulkDeletePluginTagDTO): Promise<{
        deleted: number;
    }>;
}
