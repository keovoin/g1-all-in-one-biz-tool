import { DataSourceOptions } from 'typeorm';
import { ColumnDataType, MikroORMColumnOptions } from './column-options.types';
/**
 * Resolve the database column type.
 * @param columnType - The input column type.
 * @returns The resolved column type.
 */
export declare function resolveDbType(columnType: ColumnDataType): ColumnDataType;
/**
 * Maps a generic type to a database-specific column type based on the provided database engine.
 *
 * @param dbEngine - The type of the database engine.
 * @param type - The generic type to be mapped.
 * @returns The database-specific column type.
 */
export declare function getColumnType(dbEngine: DataSourceOptions['type'], type: string): ColumnDataType;
/**
 * Parse MikroORM column options.
 * @param param0 - The options for parsing column arguments.
 * @returns MikroORM column options.
 */
export declare function parseMikroOrmColumnOptions<T>({ type, options }: {
    type: any;
    options: any;
}): MikroORMColumnOptions<T>;
