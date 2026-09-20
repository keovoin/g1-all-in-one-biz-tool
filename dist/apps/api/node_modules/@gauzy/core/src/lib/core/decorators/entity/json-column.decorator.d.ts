/**
 * json-column.decorator.ts
 *
 * Unified JSON column decorator for TypeORM AND MikroORM.
 * ORM-native column options are spread directly into JsonColumnOptions<T>
 * so callers get full autocomplete and type-safety — no `Record<string, unknown>` escape hatch.
 *
 * Environment variables:
 *   ORM_TYPE = 'typeorm' | 'mikro-orm'                           (default: 'typeorm')
 *   DB_TYPE  = 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | …  (default: 'sqlite')
 */
import { ColumnOptions } from './column-options.types';
export type JsonStorageType = 'jsonb' | 'json' | 'simple-json' | 'text';
/**
 * Options accepted when ORM_TYPE=typeorm.
 * Extends TypeORM's `ColumnOptions` minus the fields we control internally
 * (`type` and `transformer` are managed by the decorator itself).
 */
export type TypeOrmJsonColumnOptions<T> = ColumnOptions<T> & {
    defaultValue?: T;
    forceType?: JsonStorageType;
};
/**
 * Options accepted when ORM_TYPE=mikro-orm.
 * Extends MikroORM's `PropertyOptions` minus the fields we control internally
 * (`type` / `customType` are managed by the decorator itself).
 */
export type MikroOrmJsonColumnOptions<T> = ColumnOptions<T> & {
    defaultValue?: T;
    forceType?: JsonStorageType;
};
/**
 * Union used for the public-facing helpers.
 * In a project that only uses one ORM the compiler will narrow automatically.
 */
export type JsonColumnOptions<T> = TypeOrmJsonColumnOptions<T> | MikroOrmJsonColumnOptions<T>;
/**
 * `@JsonColumn<T>(options?)`
 *
 * Unified JSON column for TypeORM and MikroORM
 * All native ORM column options are accepted directly — no wrapper object needed.
 *
 * TypeORM example:
 * ```ts
 * @JsonColumn<Meta>({ defaultValue: { tags: [] }, nullable: true, comment: 'User meta' })
 * meta: Meta;
 * ```
 *
 * MikroORM example:
 * ```ts
 * @JsonColumn<Meta>({ defaultValue: { tags: [] }, nullable: true, comment: 'User meta' })
 * meta: Meta;
 * ```
 */
export declare function JsonColumn<T = unknown>(options?: JsonColumnOptions<T>): PropertyDecorator;
/**
 * `@JsonbColumn<T>(options?)`
 *
 * Forces `jsonb` storage (PostgreSQL).
 * Accepts all native ORM column options directly.
 *
 * ```ts
 * @JsonbColumn<Payload>({ nullable: true })
 * payload: Payload | null;
 * ```
 */
export declare function JsonbColumn<T = unknown>(options?: Omit<JsonColumnOptions<T>, 'forceType'>): PropertyDecorator;
/**
 * `@JsonArrayColumn<T>(options?)`
 *
 * JSON column for arrays. Defaults to `[]` — never reads `null`.
 * Accepts all native ORM column options directly.
 *
 * ```ts
 * @JsonArrayColumn<string>({ comment: 'Tag list' })
 * tags: string[];
 * ```
 */
export declare function JsonArrayColumn<T = unknown>(options?: Omit<JsonColumnOptions<T[]>, 'defaultValue'> & {
    defaultValue?: T[];
}): PropertyDecorator;
