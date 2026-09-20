import { ID } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
import { IPluginTagBulkCreateInput, IPluginTagBulkDeleteInput, IPluginTagCreateInput, IPluginTagFindInput, IPluginTagUpdateInput, IPluginsByTagsQuery, ITagsByPluginsQuery } from '../models/plugin-tag.model';
declare const CreatePluginTagDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO>>;
/**
 * Data Transfer Object for creating plugin-tag relationships
 */
export declare class CreatePluginTagDTO extends CreatePluginTagDTO_base implements IPluginTagCreateInput {
    readonly pluginId: ID;
    readonly tagId: ID;
}
declare const UpdatePluginTagDTO_base: import("@nestjs/common").Type<Partial<CreatePluginTagDTO>>;
/**
 * Data Transfer Object for updating plugin-tag relationships
 */
export declare class UpdatePluginTagDTO extends UpdatePluginTagDTO_base implements IPluginTagUpdateInput {
    readonly priority?: number;
    readonly isFeatured?: boolean;
}
declare const FindPluginTagDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO>>;
/**
 * Data Transfer Object for finding plugin-tag relationships
 */
export declare class FindPluginTagDTO extends FindPluginTagDTO_base implements IPluginTagFindInput {
    readonly pluginId?: ID;
    readonly tagId?: ID;
    readonly pluginIds?: ID[];
    readonly tagIds?: ID[];
}
declare const BulkCreatePluginTagDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO>>;
/**
 * Data Transfer Object for bulk creating plugin-tag relationships
 */
export declare class BulkCreatePluginTagDTO extends BulkCreatePluginTagDTO_base implements IPluginTagBulkCreateInput {
    readonly pluginId: ID;
    readonly tagIds: ID[];
}
declare const BulkDeletePluginTagDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO>>;
/**
 * Data Transfer Object for bulk deleting plugin-tag relationships
 */
export declare class BulkDeletePluginTagDTO extends BulkDeletePluginTagDTO_base implements IPluginTagBulkDeleteInput {
    readonly pluginId?: ID;
    readonly tagId?: ID;
    readonly ids?: ID[];
    readonly tagIds?: ID[];
}
declare const FindPluginsByTagsDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO>>;
/**
 * Data Transfer Object for finding plugins by tags
 */
export declare class FindPluginsByTagsDTO extends FindPluginsByTagsDTO_base implements IPluginsByTagsQuery {
    readonly tagIds: ID[];
    readonly matchType?: 'any' | 'all';
    readonly includeTags?: boolean;
    readonly includePluginDetails?: boolean;
}
declare const FindTagsByPluginsDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO>>;
/**
 * Data Transfer Object for finding tags by plugins
 */
export declare class FindTagsByPluginsDTO extends FindTagsByPluginsDTO_base implements ITagsByPluginsQuery {
    readonly pluginIds: ID[];
    readonly includePlugins?: boolean;
    readonly includeStatistics?: boolean;
}
declare const ReplacePluginTagsDTO_base: import("@nestjs/common").Type<Partial<TenantOrganizationBaseDTO>>;
/**
 * Data Transfer Object for replacing all tags for a plugin
 */
export declare class ReplacePluginTagsDTO extends ReplacePluginTagsDTO_base {
    readonly tagIds: ID[];
}
export {};
