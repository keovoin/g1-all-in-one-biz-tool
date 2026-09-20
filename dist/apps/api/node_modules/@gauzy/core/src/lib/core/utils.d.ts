import { FindOptions as MikroORMFindOptions, FilterQuery as MikroFilterQuery } from '@mikro-orm/core';
import { FindManyOptions, FindOneOptions, FindOperator, FindOptionsOrder, FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { DateRange, IDateRange, IUser } from '@gauzy/contracts';
import { IDBConnectionOptions } from '@gauzy/common';
import { DatabaseTypeEnum } from '@gauzy/config';
export declare const getDummyImage: (width: number, height: number, letter: string) => string;
export declare const getUserDummyImage: (user: IUser) => string;
export declare function reflect(promise: any): any;
/**
 * To calculate the last day of a month, we need to set date=0 and month as the next month.
 * So, if we want the last day of February (February is month = 1) we'll need to perform 'new Date(year, 2, 0).getDate()'
 */
export declare function getLastDayOfMonth(year: any, month: any): number;
export declare function unixTimestampToDate(timestamps: any, format?: string): string;
export declare function convertToDatetime(datetime: any): Date | string | null;
export declare function tempFile(prefix: any): Promise<string>;
export declare function getDateRange(startDate?: string | Date, endDate?: string | Date, type?: 'day' | 'week', isFormat?: boolean): {
    start: any;
    end: any;
};
export declare const getOrganizationDummyImage: (name: string) => string;
export declare const getTenantLogo: (name: string) => string;
/**
 * Merge Overlapping Date & Time
 *
 * @param ranges
 * @returns
 */
export declare function mergeOverlappingDateRanges(ranges: IDateRange[]): IDateRange[];
/**
 * GET Date Range Format
 *
 * @param startDate
 * @param endDate
 * @returns
 */
export declare function getDateRangeFormat(startDate: moment.Moment, endDate: moment.Moment): DateRange;
/**
 * Get all dates between two dates using Moment.js.
 *
 * @param startDate - The start date.
 * @param endDate - The end date.
 * @returns An array of string representations of dates.
 */
export declare function getDaysBetweenDates(startDate: string | Date, endDate: string | Date, timeZone?: string): string[];
/**
 * Get a fresh timestamp for the entity.
 *
 * @returns {Date}
 */
export declare function freshTimestamp(): Date;
/**
 * Validates the date range between startedAt and stoppedAt.
 *
 * @param startedAt The start date of the range.
 * @param stoppedAt The end date of the range.
 * @throws BadRequestException if the stoppedAt date is before the startedAt date.
 */
export declare function validateDateRange(startedAt: Date, stoppedAt: Date): void;
/**
 * Function that returns intersection of 2 arrays
 * @param arr1 Array 1
 * @param arr2 Array 2
 * @returns Intersection of arr1 and arr2
 */
export declare function getArrayIntersection(arr1: any[], arr2: any[]): any[];
/**
 * Check if the given database connection type is SQLite.
 *
 * @param {string} dbConnection - The database connection type.
 * @returns {boolean} - Returns true if the database connection type is SQLite.
 */
export declare function isSqliteDB(dbConnection?: IDBConnectionOptions): boolean;
/**
 * Enum representing different ORM types.
 */
export declare enum MultiORMEnum {
    TypeORM = "typeorm",
    MikroORM = "mikro-orm"
}
/**
 * Type representing the ORM types.
 */
export type MultiORM = 'typeorm' | 'mikro-orm';
/**
 * Get the Object-Relational Mapping (ORM) type from the environment variable `DB_ORM`.
 * @param {MultiORM} defaultValue - The default ORM type to use if `DB_ORM` is not set or an invalid value is provided.
 * @returns {MultiORM} - The determined ORM type.
 */
export declare function getORMType(defaultValue?: MultiORM): MultiORM;
/**
 * Gets the database type based on the provided database connection options or default options.
 *
 * @param {IDBConnectionOptions} [dbConnection] - The optional database connection options.
 * @returns {DatabaseTypeEnum} - The detected database type.
 */
export declare function getDBType(dbConnection?: IDBConnectionOptions): any;
/**
 * Checks whether the provided database type(s) match the database type of the given connection options.
 * If no connection options are provided, it uses the default options from the configuration.
 *
 * @param {DatabaseTypeEnum | DatabaseTypeEnum[]} types - The expected database type(s) to check against.
 * @param {IDBConnectionOptions} [dbConnection] - The optional database connection options.
 * @returns {boolean} - Returns true if the database type matches any of the provided types.
 */
export declare function isDatabaseType(types: DatabaseTypeEnum | DatabaseTypeEnum[], dbConnection?: IDBConnectionOptions): boolean;
/**
 * Recursively flattens nested objects into an array of dot-notated keys.
 * If the input is already an array, returns it as is.
 *
 * @param {any} input - The input object or array to be flattened.
 * @returns {string[]} - An array of dot-notated keys.
 */
export declare const flatten: (input: any) => any;
/**
 * TypeORM `FindManyOptions` widened to also accept the legacy string-array `relations`/`select`
 * syntax that TypeORM removed in v1.0 (e.g. `relations: ['role', 'tenant.featureOrganizations']`).
 *
 * Ever Gauzy still passes this syntax in many dynamic call sites. Rather than patching TypeORM's own
 * type declarations (the old `patches/typeorm+1.0.0.patch` approach), we widen our own option types
 * and convert the arrays to object form at the TypeORM data-access boundary (see
 * {@link parseTypeORMFindOptions}). The `relations`/`select` element types are pulled from TypeORM
 * via indexed access so they track upstream automatically.
 */
export type LegacyFindManyOptions<T> = Omit<FindManyOptions<T>, 'relations' | 'select'> & {
    relations?: FindManyOptions<T>['relations'] | string[];
    select?: FindManyOptions<T>['select'] | string[];
};
/**
 * TypeORM `FindOneOptions` widened to also accept the legacy string-array `relations`/`select`
 * syntax. See {@link LegacyFindManyOptions}.
 */
export type LegacyFindOneOptions<T> = Omit<FindOneOptions<T>, 'relations' | 'select'> & {
    relations?: FindOneOptions<T>['relations'] | string[];
    select?: FindOneOptions<T>['select'] | string[];
};
/**
 * Canonicalizes ANY representation of a `relations` find-option into dot-notated relation paths.
 *
 * A `relations` value reaches the API in several shapes and they must all be understood identically
 * by whatever authorizes the read, because TypeORM understands them all when it JOINs:
 *
 * - a comma-separated string — `'organization,organization.payments'`
 * - the legacy string array — `['organization.payments']` (what the Angular clients send as
 *   `relations[0]=organization.payments`)
 * - TypeORM v1 object form — `{ organization: { payments: true } }`, which Express's extended query
 *   parser produces from `?relations[organization][payments]=x`
 * - and any mixture of the above (`[{ organization: { payments: true } }, 'tags']`)
 *
 * Reading only two of those shapes is exactly how `SensitiveRelationsInterceptor` was bypassed
 * (GHSA-c3cj-m3xm-7j5h): an object-form `relations` normalised to an empty list, so its permission
 * loop ran zero times while TypeORM still joined and selected the protected rows.
 *
 * Every intermediate prefix is emitted (`organization`, `organization.payments`,
 * `organization.payments.invoice`) so a config lookup matches at whatever depth it declares a
 * relation, and the walk fails CLOSED: a key is emitted whatever its leaf value is (even `false`,
 * which TypeORM would not join, since over-asking is the safe direction for a check), and input the
 * walk cannot faithfully read is refused outright.
 *
 * @param relations - The `relations` value in any of the shapes above.
 * @returns The de-duplicated dot-notated relation paths, including every prefix.
 * @throws BadRequestException when the structure nests deeper, or a single path runs longer, than
 *         {@link MAX_RELATION_PATH_DEPTH}, or when a relation name is prototype-polluting
 *         (`__proto__`, `prototype`, `constructor`); such input is refused, never partially accepted.
 */
export declare function normalizeRelationsToPaths(relations: unknown): string[];
/**
 * Converts the legacy string-array find-option syntax (`['role', 'tenant.featureOrganizations']`)
 * into the nested object form TypeORM v1 requires (`{ role: true, tenant: { featureOrganizations: true } }`).
 * A dot in a segment denotes nesting.
 *
 * This replaces the runtime compatibility shim that previously lived in
 * `patches/typeorm+1.0.0.patch` (TypeORM removed the string-array `relations`/`select` syntax in
 * v1.0). Applying the conversion in application code — at the TypeORM data-access boundary — lets us
 * drop that node_modules patch while keeping the many dynamic `string[]` call sites working.
 *
 * The merge rules match the shim exactly so behaviour is unchanged: a leaf only sets `true` when the
 * key is still unset (an existing nested object from a longer sibling path is preserved), and an
 * intermediate segment upgrades a `true` leaf to a nested object. Empty / non-string segments are
 * skipped.
 *
 * @param paths - The dot-notated relation/column paths to convert.
 * @returns The equivalent nested object form.
 */
export declare function stringArrayToFindOptionsObject(paths: readonly string[]): Record<string, any>;
/**
 * Canonicalizes an untrusted `relations` value (string / array / nested object / any mixture) into
 * the single nested-object form TypeORM v1 consumes.
 *
 * Use this wherever a `relations` option crosses the trust boundary — a DTO transform, for example —
 * so that the shape an authorization check inspects downstream is the shape the ORM will join.
 *
 * The conversion never loads anything the ORM would not have loaded from the original value: an
 * object-form key is kept only when its leaf is `true` or an object, which is what TypeORM joins, so
 * `{ payments: false }` or a query-string `{ payments: 'x' }` is dropped rather than rebuilt as `true`.
 * Any string or string-array path is kept as named.
 *
 * @param relations - The `relations` value in any representation.
 * @returns The canonical object form, or `undefined` when no `relations` value was supplied.
 * @throws BadRequestException on the same input {@link normalizeRelationsToPaths} refuses.
 */
export declare function canonicalizeFindOptionsRelations<T = unknown>(relations: unknown): FindOptionsRelations<T> | undefined;
/**
 * Normalizes a TypeORM `relations` find-option, converting the legacy `string[]` form to the object
 * form v1 expects and passing the object form (or `undefined`) through unchanged. Safe to call on any
 * `relations` value, so it can wrap options that may already use either syntax.
 *
 * @param relations - The `relations` option in either legacy `string[]` or object form.
 * @returns The `relations` option in object form, or the original value when not an array.
 */
export declare function parseFindOptionsRelations<T = unknown>(relations: string[] | FindOptionsRelations<any> | undefined): FindOptionsRelations<T> | undefined;
/**
 * Normalizes a TypeORM `select` find-option, converting the legacy `string[]` form to the object form
 * v1 expects and passing the object form (or `undefined`) through unchanged. Safe to call on any
 * `select` value, so it can wrap options that may already use either syntax.
 *
 * @param select - The `select` option in either legacy `string[]` or object form.
 * @returns The `select` option in object form, or the original value when not an array.
 */
export declare function parseFindOptionsSelect<T = unknown>(select: string[] | FindOptionsSelect<any> | undefined): FindOptionsSelect<T> | undefined;
/**
 * Normalizes the `relations` and `select` members of a TypeORM find-options object in place-safe
 * fashion, returning a shallow copy with the legacy `string[]` form converted to object form. Any
 * other options (`where`, `order`, `skip`, `take`, …) are preserved untouched.
 *
 * Use this at TypeORM data-access boundaries (repository / query-builder calls) that must not receive
 * the legacy `string[]` syntax now that the TypeORM patch is removed. The MikroORM path does NOT need
 * this — {@link flatten} already accepts both forms — so callers should convert only on the TypeORM
 * branch to keep MikroORM behaviour identical.
 *
 * @param options - The find-options to normalize. `null`/`undefined` is returned unchanged.
 * @returns A normalized shallow copy, or the original value when there is nothing to convert.
 */
export declare function parseTypeORMFindOptions<T, O extends {
    relations?: any;
    select?: any;
}>(options: O): O;
/**
 * Concatenate an ID to the given MikroORM where condition.
 *
 * @param id - The ID to concatenate to the where condition.
 * @param where - MikroORM where condition.
 * @returns Concatenated MikroORM where condition.
 */
export declare function concatIdToWhere<T>(id: any, where: MikroFilterQuery<T>): MikroFilterQuery<T>;
/**
 * Adds 'tenantId' to a 'where' clause, supporting both objects and arrays.
 *
 * @param tenantId - The tenant ID to add.
 * @param where - The current 'where' clause.
 * @returns An updated 'where' clause including the 'tenantId'.
 */
export declare function enhanceWhereWithTenantId<T>(tenantId: any, where: MikroFilterQuery<T>): MikroFilterQuery<T>;
/**
 * Convert TypeORM's FindManyOptions to MikroORM's equivalent options.
 *
 * @param options - TypeORM's FindManyOptions.
 * @returns An object with MikroORM's where and options.
 */
export declare function parseTypeORMFindToMikroOrm<T>(options: LegacyFindManyOptions<any>): {
    where: MikroFilterQuery<T>;
    mikroOptions: MikroORMFindOptions<T, any, any, any>;
};
/**
 * Parses TypeORM 'order' option to MikroORM 'orderBy' option.
 * @param order TypeORM 'order' option
 * @returns Parsed MikroORM 'orderBy' option
 */
export declare function parseOrderOptions(order: FindOptionsOrder<any>): {};
/**
 * Transforms a FindOperator object into a query condition suitable for database operations.
 * It handles simple conditions such as 'equal', 'in' and 'between',
 * as well as complex conditions like recursive 'not' operators and range queries with 'between'.
 *
 * @param operator A FindOperator object containing the type of condition and its corresponding value.
 * @returns A query condition in the format of a Record<string, any> that represents the translated condition.
 *
 */
export declare function processFindOperator<T>(operator: FindOperator<T>): any;
/**
 * Converts a TypeORM query condition into a format that is compatible with MikroORM.
 * This function recursively processes each condition, handling both simple key-value
 * pairs and complex nested objects including FindOperators.
 *
 * @param where The TypeORM condition to be converted, typically as a filter query object.
 * @returns An object representing the MikroORM compatible condition.
 */
export declare function convertTypeORMConditionToMikroORM<T>(where: MikroFilterQuery<T>): {};
/**
 * Converts TypeORM 'where' conditions into a format compatible with MikroORM.
 * This function can handle both individual condition objects and arrays of conditions,
 * applying the necessary conversion to each condition.
 *
 * @param where The TypeORM 'where' condition or an array of conditions to be converted.
 * @returns A MikroORM compatible condition or array of conditions.
 */
export declare function convertTypeORMWhereToMikroORM<T>(where: MikroFilterQuery<T>): {};
/**
 * Serializes the provided entity based on the ORM type.
 * @param entity The entity to be serialized.
 * @returns The serialized entity.
 */
export declare function wrapSerialize<T extends object>(entity: T): T;
/**
 * Converts the given entity instance to a plain object.
 *
 * This function creates a shallow copy of the entity, retaining its properties as a plain object,
 * making it suitable for use in contexts where a non-class representation is required.
 *
 * @param entity - The entity instance to be converted to a plain object.
 * @returns A plain object representation of the given entity instance.
 */
export declare function toPlain(entity: any): Record<string, any>;
/**
 * Converts the given entity instance to a JSON object.
 *
 * This function creates a deep copy of the entity, converting it into a JSON-compatible structure,
 * making it suitable for serialization or transferring over a network.
 *
 * @param entity - The entity instance to be converted to a JSON object.
 * @returns A JSON representation of the given entity instance.
 */
export declare function toJSON(entity: any): Record<string, any>;
/**
 * Replace $ placeholders with ? for mysql, sqlite, and better-sqlite3
 * @param query - The SQL query with $ placeholders
 * @param dbType - The database type
 * @returns The SQL query with ? placeholders if applicable
 */
export declare function replacePlaceholders(query: string, dbType: DatabaseTypeEnum): string;
/**
 * Retries a given asynchronous query function for a specified number of times.
 *
 * @param query - A function returning a Promise of type T.
 * @param retries - The number of retries allowed (default is 3).
 * @returns A Promise that resolves with the query result if successful.
 * @throws An error if all retries fail.
 */
export declare function retryQuery<T>(query: () => Promise<T>, retries?: number): Promise<T>;
