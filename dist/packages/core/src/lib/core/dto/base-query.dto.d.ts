import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { PlainObject } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './tenant-organization-base.dto';
/**
 * Base DTO for 'select' fields. What fields should be selected.
 */
export declare class FindSelectQueryDTO<T = any> {
    readonly select?: FindOptionsSelect<T>;
}
/**
 * Base DTO for 'relations' to load (joined entities).
 */
export declare class FindRelationsQueryDTO<T = any> extends FindSelectQueryDTO<T> {
    /**
     * Canonicalized into TypeORM's nested object form WHEN the route's `ValidationPipe` runs with
     * `transform: true`, whichever representation the client used: a comma-separated string, the
     * legacy string array the Angular clients send as `relations[0]=…`, or the nested object form
     * Express's extended query parser builds from `?relations[organization][payments]=x`.
     *
     * This is a convenience, NOT the security boundary. Nest's `ValidationPipe` only returns the
     * transformed instance when `transform` is enabled; on a route with a bare `@UseValidationPipe()`,
     * or with no pipe at all, the handler still receives the raw query value. Authorization therefore
     * never relies on this transform: `SensitiveRelationsInterceptor` and
     * `CrudService.assertRelationsPermitted` each canonicalize the value they are given themselves, in
     * every representation (GHSA-c3cj-m3xm-7j5h).
     *
     * Where it does run, the transform never widens a query: an object-form key is kept only when
     * TypeORM would have joined it (a `true` or object leaf), and malformed input is refused.
     */
    readonly relations?: FindOptionsRelations<T>;
}
/**
 * Simple condition that should be applied to match entities.
 */
export declare class FindWhereQueryDTO<T> extends FindRelationsQueryDTO<T> {
    readonly where: FindOptionsWhere<T>;
}
/**
 * Base DTO for filtering options (ordering, soft-delete, etc.).
 */
export declare class FindOptionsQueryDTO<T> extends FindWhereQueryDTO<T> {
    /**
     * Order, in which entities should be ordered.
     */
    readonly order?: FindOptionsOrder<T>;
    /**
     * Indicates if soft-deleted rows should be included in entity result.
     */
    readonly withDeleted?: boolean;
}
/**
 * Base DTO for pagination (skip/take).
 */
export declare class PaginationQueryDTO<T> extends FindOptionsQueryDTO<T> {
    /**
     * Limit (paginated) - max number of entities should be taken.
     */
    readonly take?: number;
    /**
     * Offset (paginated) where from entities should be taken.
     */
    readonly skip?: number;
}
/**
 * Describes generic query params
 */
export declare class BaseQueryDTO<T = any> extends PaginationQueryDTO<T> {
}
/**
 * Function to escape query parameters and convert to DTO class.
 * @param nativeParameters - The original query parameters.
 * @returns {TenantOrganizationBaseDTO} - The escaped and converted query parameters as a DTO instance.
 */
export declare function escapeQueryWithParameters(nativeParameters: PlainObject): TenantOrganizationBaseDTO;
/**
 * Parses the given value and converts it to a boolean using JSON.parse.
 *
 * @param value - The value to be parsed.
 * @returns {boolean} - The boolean representation of the parsed value.
 */
export declare const parseBool: (value: any) => boolean;
/**
 * Converts native parameters based on the database connection type.
 *
 * @param parameters - The parameters to be converted.
 * @returns {any} - The converted parameters based on the database connection type.
 */
export declare const convertNativeParameters: (parameters: PlainObject) => any;
