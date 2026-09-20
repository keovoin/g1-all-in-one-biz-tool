import { ID, ITag } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { Relation } from 'typeorm';
import { IPlugin, IPluginTag } from '../../shared/models';
/**
 * PluginTag Entity
 *
 * Represents the many-to-many relationship between plugins and tags.
 * This entity allows plugins to be categorized and organized using a flexible tagging system.
 *
 * Business Logic:
 * - A plugin can have multiple tags
 * - A tag can be associated with multiple plugins
 * - Tags help in plugin discovery, categorization, and filtering
 * - Supports tenant and organization-level isolation
 * - Maintains referential integrity with cascade delete operations
 *
 * Use Cases:
 * - Plugin marketplace filtering and search
 * - Plugin categorization and organization
 * - Plugin recommendation systems
 * - Analytics and reporting on plugin usage patterns
 */
export declare class PluginTag extends TenantOrganizationBaseEntity implements IPluginTag {
    /**
     * Plugin relationship
     * Represents the plugin that is being tagged
     */
    plugin: Relation<IPlugin>;
    /**
     * Plugin ID - Foreign key reference to the plugin
     */
    pluginId: ID;
    /**
     * Tag relationship
     * Represents the tag that is being applied to the plugin
     */
    tag: Relation<ITag>;
    /**
     * Tag ID - Foreign key reference to the tag
     */
    tagId: ID;
    /**
     * Applied date - When the tag was applied to the plugin
     * Useful for tracking and auditing purposes
     */
    appliedAt?: Date;
    /**
     * Applied by - User who applied the tag to the plugin
     * Optional field for tracking who made the tag association
     */
    appliedById?: ID;
    /**
     * Priority/Weight - Optional priority or weight for this tag association
     * Can be used for sorting, relevance scoring, or featured tags
     */
    priority?: number;
    /**
     * Is featured - Whether this tag association should be featured/highlighted
     * Useful for promoting certain plugins with specific tags
     */
    isFeatured?: boolean;
}
