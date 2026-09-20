/** Allowlist of columns that may appear in the SQL `ORDER BY` clause (prevents `sortBy` injection). */
export declare const PLUGIN_CATEGORY_SORTABLE_FIELDS: readonly ["name", "slug", "order", "createdAt", "updatedAt"];
/** Allowed SQL sort directions. */
export declare const PLUGIN_CATEGORY_SORT_DIRECTIONS: readonly ["ASC", "DESC"];
export declare class PluginCategoryQueryDTO {
    readonly name?: string;
    readonly slug?: string;
    readonly isActive?: boolean;
    readonly parentId?: string;
    readonly page?: number;
    readonly limit?: number;
    readonly sortBy?: (typeof PLUGIN_CATEGORY_SORTABLE_FIELDS)[number];
    readonly sortDirection?: (typeof PLUGIN_CATEGORY_SORT_DIRECTIONS)[number];
    readonly relations?: string[];
}
