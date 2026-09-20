"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggingMikroOptions = exports.getLoggingOptions = exports.getTlsOptions = exports.isMongodb = exports.isPostgres = exports.isBetterSqlite3 = exports.isSqlite = exports.isMySQL = exports.DatabaseTypeEnum = exports.TYPEORM_INVALID_WHERE_VALUES_BEHAVIOR = void 0;
exports.assertValidDatabaseType = assertValidDatabaseType;
exports.parseIntEnv = parseIntEnv;
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
exports.TYPEORM_INVALID_WHERE_VALUES_BEHAVIOR = Object.freeze({ null: 'sql-null', undefined: 'ignore' });
var DatabaseTypeEnum;
(function (DatabaseTypeEnum) {
    DatabaseTypeEnum["mongodb"] = "mongodb";
    DatabaseTypeEnum["sqlite"] = "sqlite";
    DatabaseTypeEnum["betterSqlite3"] = "better-sqlite3";
    DatabaseTypeEnum["postgres"] = "postgres";
    DatabaseTypeEnum["mysql"] = "mysql";
})(DatabaseTypeEnum || (exports.DatabaseTypeEnum = DatabaseTypeEnum = {}));
const isMysqlValue = process.env.DB_TYPE === DatabaseTypeEnum.mysql;
const isSqliteValue = process.env.DB_TYPE === DatabaseTypeEnum.sqlite;
const isBetterSqlite3Value = process.env.DB_TYPE === DatabaseTypeEnum.betterSqlite3;
const isPostgresValue = process.env.DB_TYPE === DatabaseTypeEnum.postgres;
const isMongodbValue = process.env.DB_TYPE === DatabaseTypeEnum.mongodb;
const isMySQL = () => isMysqlValue;
exports.isMySQL = isMySQL;
const isSqlite = () => isSqliteValue;
exports.isSqlite = isSqlite;
const isBetterSqlite3 = () => isBetterSqlite3Value;
exports.isBetterSqlite3 = isBetterSqlite3;
const isPostgres = () => isPostgresValue;
exports.isPostgres = isPostgres;
const isMongodb = () => isMongodbValue;
exports.isMongodb = isMongodb;
/** Every `DB_TYPE` value `database.ts` recognizes, including `mongodb`, which it rejects on its own. */
const DATABASE_TYPE_VALUES = Object.values(DatabaseTypeEnum);
/** The `DB_TYPE` values `database.ts` can actually run (`mongodb` is recognized but not supported yet). */
const SUPPORTED_DATABASE_TYPE_VALUES = DATABASE_TYPE_VALUES.filter((value) => value !== DatabaseTypeEnum.mongodb);
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
function assertValidDatabaseType(dbType) {
    if (!DATABASE_TYPE_VALUES.includes(dbType)) {
        throw new Error(`Invalid DB_TYPE "${dbType}". Supported values: ${SUPPORTED_DATABASE_TYPE_VALUES.join(', ')}.`);
    }
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
function parseIntEnv(name, rawValue, defaultValue, { min = 0, radix, onInvalid = 'throw' } = {}) {
    if (rawValue === undefined || rawValue === '') {
        return defaultValue;
    }
    const parsed = Number.parseInt(rawValue, radix);
    if (Number.isNaN(parsed) || parsed < min) {
        const message = `Invalid ${name} "${rawValue}": expected an integer >= ${min}.`;
        if (onInvalid === 'throw') {
            throw new Error(message);
        }
        console.warn(`${message} Using it as before; fix the value, since it may be rejected in the future.`);
    }
    return parsed;
}
/**
 * Gets TLS options for a database connection based on the provided SSL mode.
 *
 * @param {boolean} dbSslMode - The SSL mode for the database connection.
 * @returns {TlsOptions | undefined} - TLS options for the database connection or undefined if SSL is disabled.
 */
const getTlsOptions = (dbSslMode) => {
    // Check if SSL is enabled based on the provided SSL mode
    if (!dbSslMode) {
        // If SSL is not enabled, return undefined
        return undefined;
    }
    // Obtain the CA certificate from the environment variable and decode it
    const base64data = process.env.DB_CA_CERT;
    if (!base64data) {
        // Handle the case where DB_CA_CERT is not defined
        console.error('DB_CA_CERT is not defined. TLS options cannot be configured.');
        return undefined;
    }
    try {
        const buff = Buffer.from(base64data, 'base64');
        const sslCert = buff.toString('ascii');
        // Return TLS options with the decoded CA certificate
        return {
            rejectUnauthorized: true, // You might want to make this configurable
            ca: sslCert
        };
    }
    catch (error) {
        // Handle decoding errors
        console.error('Error decoding DB_CA_CERT:', error instanceof Error ? (error.stack || error.message) : String(error));
        return undefined;
    }
};
exports.getTlsOptions = getTlsOptions;
/**
 * Get logging options based on the provided dbLogging value.
 * @param {string} dbLogging - The value of process.env.DB_LOGGING
 * @returns {false | 'all' | ['query', 'error'] | ['error']} - The logging options
 */
const getLoggingOptions = (dbLogging) => {
    let loggingOptions;
    switch (dbLogging) {
        case 'false':
            loggingOptions = false;
            break;
        case 'all':
            loggingOptions = 'all';
            break;
        case 'query':
            loggingOptions = ['query', 'error'];
            break;
        default:
            loggingOptions = ['error'];
    }
    return loggingOptions;
};
exports.getLoggingOptions = getLoggingOptions;
/**
 * Gets MikroORM logging options based on the specified logging type.
 *
 * @param dbLogging - The logging type.
 * @returns False if logging is disabled, or an array of LoggerNamespace for the specified logging type.
 */
const getLoggingMikroOptions = (dbLogging) => {
    const loggingOptionsMap = {
        query: ['query'],
        'query-params': ['query-params'],
        schema: ['schema'],
        discovery: ['discovery'],
        info: ['info'],
        all: ['query', 'query-params', 'schema', 'discovery', 'info']
    };
    return loggingOptionsMap[dbLogging] || false;
};
exports.getLoggingMikroOptions = getLoggingMikroOptions;
//# sourceMappingURL=database-helpers.js.map