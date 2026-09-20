/**
 * Builds a query parameters string from an object of query parameters.
 *
 * @param queryParams - An object containing query parameters.
 * @returns A string representation of the query parameters.
 *
 * @example
 * ```typescript
 * const params = {
 *   search: "query",
 *   page: "1",
 *   sort: ["name", "date"],
 *   active: true,
 * };
 *
 * const queryString = buildQueryString(params);
 * // Output: "search=query&page=1&sort=name&sort=date&active=true"
 * ```
 */
export declare function buildQueryString(queryParams: {
    [key: string]: string | string[] | boolean;
}): string;
