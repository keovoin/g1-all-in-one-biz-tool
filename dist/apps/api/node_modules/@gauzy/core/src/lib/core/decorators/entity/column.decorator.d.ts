import { ColumnDataType, ColumnOptions } from './column-options.types';
/**
 * Decorator for creating column definitions for both MikroORM and TypeORM.
 * Applies only the active ORM's decorator based on the DB_ORM environment variable.
 *
 * `primary` must reach BOTH ORMs, not just TypeORM. The options object is forwarded
 * verbatim to TypeORM's `@Column()`, which understands `primary: true`; the MikroORM side
 * used to always emit a plain `@Property()`, so a column declared
 * `@MultiORMColumn({ primary: true })` gave TypeORM a primary key and MikroORM none, and
 * `discoverEntities` refused to boot the API with
 * `MetadataError: <Entity> is missing @PrimaryKey()`. When `primary` is set we therefore
 * emit MikroORM's `@PrimaryKey()` instead of `@Property()`, with the same mapped options.
 *
 * @template T - The type of the column.
 * @param typeOrOptions - The column type or additional options if provided.
 * @param options - The options for the column.
 * @returns PropertyDecorator.
 */
export declare function MultiORMColumn<T>(typeOrOptions?: ColumnDataType | ColumnOptions<T>, options?: ColumnOptions<T>): PropertyDecorator;
