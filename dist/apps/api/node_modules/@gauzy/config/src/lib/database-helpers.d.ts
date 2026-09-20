import { TlsOptions } from 'tls';
import type { DataSourceOptions } from 'typeorm';
export type MikroLoggerNamespace = 'query' | 'query-params' | 'schema' | 'discovery' | 'info';
/**
 * How TypeORM treats `null` and `undefined` values inside `find*` / `count*` / `exists*` and
 * `update` / `delete` / `softDelete` criteria (`where`) objects. TypeORM ≥ 1.0 defaults both to
 * `'throw'`; this is the ONE place the application overrides that, and every TypeORM connection
 * profile in `database.ts` must use it.
 *
 * - `undefined: 'ignore'` — an `undefined` value omits the key. That is the optional-filter idiom
 *   used throughout the codebase (`where: { tenantId, organizationId }` where `organizationId` may
 *   legitimately be undefined) and matches TypeORM 0.3.
 * - `null: 'sql-null'` — a `null` value emits `"column" IS NULL` (columns and relations alike),
 *   i.e. TypeORM ≤ 0.2 and MikroORM semantics, so a `where` object shared by both ORM branches
 *   means the same thing on both.
 *
 * `null` MUST NEVER be `'ignore'`. That silently drops the predicate, so a lookup such as
 * `{ tenantId: null, organizationId: null }` (meaning "the global, tenant-less row") matches EVERY
 * tenant's rows — a cross-tenant data-isolation failure (GHSA-44pv-34gx-q9p4). `'sql-null'` is
 * fail-closed: a null can only ever narrow a query, never widen it. Application code should still
 * spell the intent out with the explicit `IsNull()` operator; this setting is the safety net for
 * anything that does not.
 */
export declare const TYPEORM_INVALID_WHERE_VALUES_BEHAVIOR: NonNullable<DataSourceOptions['invalidWhereValuesBehavior']>;
export declare enum DatabaseTypeEnum {
    mongodb = "mongodb",
    sqlite = "sqlite",
    betterSqlite3 = "better-sqlite3",
    postgres = "postgres",
    mysql = "mysql"
}
export declare const isMySQL: () => boolean;
export declare const isSqlite: () => boolean;
export declare const isBetterSqlite3: () => boolean;
export declare const isPostgres: () => boolean;
export declare const isMongodb: () => boolean;
/**
 * Validates that a `DB_TYPE` value is one of the values `DatabaseTypeEnum` recognizes — TASK 5
 * (Configuration Schema and Startup Validation) of the improvement roadmap.
 *
 * Before this existed, `database.ts`'s `switch (dbType)` had no `default` case: an unrecognized
 * value (a typo, an unsupported engine) fell through silently, leaving `dbTypeOrmConnectionConfig`/
 * `dbMikroOrmConnectionConfig`/`dbKnexConnectionConfig` all `undefined` — a startup misconfiguration
 * that would only surface later as an opaque "Cannot read properties of undefined" deep inside
 * `TypeOrmModule.forRootAsync`, rather than a clear error at the moment the bad config is read.
 *
 * `mongodb` passes this check on purpose: `database.ts` rejects it with its own, more specific
 * "not supported yet" error. It is therefore also left out of the supported values listed here.
 *
 * @param dbType - The `DB_TYPE` value to validate. The caller has already replaced an unset or empty
 *   `DB_TYPE` with the default (better-sqlite3), so this only rejects a value that was actually set
 *   to something unrecognized.
 * @throws {Error} if `dbType` is not one of `DatabaseTypeEnum`'s values.
 */
export declare function assertValidDatabaseType(dbType: string): asserts dbType is DatabaseTypeEnum;
/**
 * Options for {@link parseIntEnv}.
 */
export interface IntEnvOptions {
    /**
     * Smallest accepted value (inclusive). Defaults to 0: every numeric database setting is a size,
     * a port or a duration, where a negative number never meant anything.
     */
    min?: number;
    /**
     * Passed straight to `Number.parseInt`. Leave it out for the settings `database.ts` always parsed
     * without a radix (a "0x" prefix then reads as hexadecimal, exactly as before); pass 10 for the
     * ones it always parsed with radix 10 (`DB_PORT`).
     */
    radix?: number;
    /**
     * What to do with a value that does not parse or is below `min`. `'throw'` (the default) is for
     * settings where such a value already broke startup before this check existed, so failing fast only
     * makes the error readable. `'warn'` is for settings the drivers tolerated (an unparsable `DB_PORT`
     * fell back to the default port, an unparsable `DB_SLOW_QUERY_LOGGING_TIMEOUT` switched the warning
     * off): it logs a warning and returns the value `Number.parseInt` produced, exactly as before, so a
     * deployment that starts today keeps starting.
     */
    onInvalid?: 'throw' | 'warn';
}
/**
 * Parses an integer environment variable with the same `Number.parseInt` semantics `database.ts`
 * has always used, failing fast with an error naming the variable and the bad value when the result
 * is not a usable number.
 *
 * Every value that parsed before still parses to the same number: surrounding whitespace, an
 * explicit sign and trailing text are tolerated ("+5" is 5, "5000ms" is 5000, "2.5" is 2), and an
 * unset or empty variable still yields the default (compose / k8s templates render an unset
 * variable as ''). What now throws at startup is a value that parsed to `NaN` ("abc", " ") — which
 * the pool/timeout options previously passed on without complaint until a driver broke much later
 * — and a value below `min`.
 *
 * @param name - The environment variable's name, used only for the error message.
 * @param rawValue - `process.env[name]`.
 * @param defaultValue - Used when `rawValue` is unset or empty; never itself validated, since it is
 *   a literal in `database.ts`, not user input.
 * @param options - See {@link IntEnvOptions}.
 * @throws {Error} if `rawValue` is set but parses to `NaN` or to a number below `min`.
 */
export declare function parseIntEnv(name: string, rawValue: string | undefined, defaultValue: number, { min, radix, onInvalid }?: IntEnvOptions): number;
/**
 * Gets TLS options for a database connection based on the provided SSL mode.
 *
 * @param {boolean} dbSslMode - The SSL mode for the database connection.
 * @returns {TlsOptions | undefined} - TLS options for the database connection or undefined if SSL is disabled.
 */
export declare const getTlsOptions: (dbSslMode: boolean) => TlsOptions | undefined;
/**
 * Get logging options based on the provided dbLogging value.
 * @param {string} dbLogging - The value of process.env.DB_LOGGING
 * @returns {false | 'all' | ['query', 'error'] | ['error']} - The logging options
 */
export declare const getLoggingOptions: (dbLogging: string) => false | "all" | ["query", "error"] | ["error"];
/**
 * Gets MikroORM logging options based on the specified logging type.
 *
 * @param dbLogging - The logging type.
 * @returns False if logging is disabled, or an array of LoggerNamespace for the specified logging type.
 */
export declare const getLoggingMikroOptions: (dbLogging: string) => false | MikroLoggerNamespace[];
