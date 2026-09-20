import { PluginStatus, PluginType } from '@gauzy/contracts';
import { BaseQueryDTO } from '@gauzy/core';
import { IPlugin } from '../models';
/**
 * Allowlist of columns that may be used in the SQL `ORDER BY` clause.
 * MUST stay in sync with the columns interpolated by SearchPluginsQueryHandler.
 * Keeping this as a runtime `@IsIn` check (not just the compile-time union below)
 * is what prevents SQL injection via the `sortBy` parameter.
 */
export declare const PLUGIN_SORTABLE_FIELDS: readonly ["name", "author", "uploadedAt", "lastDownloadedAt", "downloadCount", "createdAt", "updatedAt"];
/** Allowed SQL sort directions. */
export declare const PLUGIN_SORT_DIRECTIONS: readonly ["ASC", "DESC"];
declare const PluginSearchFilterDTO_base: import("@nestjs/common").Type<Partial<BaseQueryDTO<IPlugin>>>;
/**
 * DTO for plugin search and filtering functionality
 */
export declare class PluginSearchFilterDTO extends PluginSearchFilterDTO_base {
    readonly search?: string;
    readonly name?: string;
    readonly description?: string;
    readonly type?: PluginType;
    readonly status?: PluginStatus;
    readonly isActive?: boolean;
    readonly categoryId?: string;
    readonly author?: string;
    readonly license?: string;
    readonly uploadedById?: string;
    readonly uploadedAfter?: Date;
    readonly uploadedBefore?: Date;
    readonly downloadedAfter?: Date;
    readonly downloadedBefore?: Date;
    readonly minDownloads?: number;
    readonly maxDownloads?: number;
    readonly version?: string;
    readonly tags?: string[];
    readonly hasInstallations?: boolean;
    readonly isVerified?: boolean;
    readonly page?: number;
    readonly limit?: number;
    readonly sortBy?: (typeof PLUGIN_SORTABLE_FIELDS)[number];
    readonly sortDirection?: (typeof PLUGIN_SORT_DIRECTIONS)[number];
}
export {};
