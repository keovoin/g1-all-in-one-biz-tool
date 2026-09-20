"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = exports.MultiORMEnum = exports.getTenantLogo = exports.getOrganizationDummyImage = exports.getUserDummyImage = exports.getDummyImage = void 0;
exports.reflect = reflect;
exports.getLastDayOfMonth = getLastDayOfMonth;
exports.unixTimestampToDate = unixTimestampToDate;
exports.convertToDatetime = convertToDatetime;
exports.tempFile = tempFile;
exports.getDateRange = getDateRange;
exports.mergeOverlappingDateRanges = mergeOverlappingDateRanges;
exports.getDateRangeFormat = getDateRangeFormat;
exports.getDaysBetweenDates = getDaysBetweenDates;
exports.freshTimestamp = freshTimestamp;
exports.validateDateRange = validateDateRange;
exports.getArrayIntersection = getArrayIntersection;
exports.isSqliteDB = isSqliteDB;
exports.getORMType = getORMType;
exports.getDBType = getDBType;
exports.isDatabaseType = isDatabaseType;
exports.normalizeRelationsToPaths = normalizeRelationsToPaths;
exports.stringArrayToFindOptionsObject = stringArrayToFindOptionsObject;
exports.canonicalizeFindOptionsRelations = canonicalizeFindOptionsRelations;
exports.parseFindOptionsRelations = parseFindOptionsRelations;
exports.parseFindOptionsSelect = parseFindOptionsSelect;
exports.parseTypeORMFindOptions = parseTypeORMFindOptions;
exports.concatIdToWhere = concatIdToWhere;
exports.enhanceWhereWithTenantId = enhanceWhereWithTenantId;
exports.parseTypeORMFindToMikroOrm = parseTypeORMFindToMikroOrm;
exports.parseOrderOptions = parseOrderOptions;
exports.processFindOperator = processFindOperator;
exports.convertTypeORMConditionToMikroORM = convertTypeORMConditionToMikroORM;
exports.convertTypeORMWhereToMikroORM = convertTypeORMWhereToMikroORM;
exports.wrapSerialize = wrapSerialize;
exports.toPlain = toPlain;
exports.toJSON = toJSON;
exports.replacePlaceholders = replacePlaceholders;
exports.retryQuery = retryQuery;
const common_1 = require("@nestjs/common");
const core_1 = require("@mikro-orm/core");
const mikro_orm_soft_delete_1 = require("mikro-orm-soft-delete");
const better_sqlite_1 = require("@mikro-orm/better-sqlite");
const postgresql_1 = require("@mikro-orm/postgresql");
const mysql_1 = require("@mikro-orm/mysql");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const path = require("path");
const fs = require("fs");
const os = require("os");
const config_1 = require("@gauzy/config");
const moment_extend_1 = require("./../core/moment-extend");
var Utils;
(function (Utils) {
    function generatedLogoColor() {
        return (0, underscore_1.sample)(['#269aff', '#ffaf26', '#8b72ff', '#0ecc9D']).replace('#', '');
    }
    Utils.generatedLogoColor = generatedLogoColor;
})(Utils || (Utils = {}));
const getDummyImage = (width, height, letter) => {
    return `https://dummyimage.com/${width}x${height}/${Utils.generatedLogoColor()}/ffffff.jpg&text=${letter}`;
};
exports.getDummyImage = getDummyImage;
const getUserDummyImage = (user) => {
    const firstNameLetter = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    if (firstNameLetter) {
        return (0, exports.getDummyImage)(330, 300, firstNameLetter);
    }
    else {
        const firstEmailLetter = user.email.charAt(0).toUpperCase();
        return (0, exports.getDummyImage)(330, 300, firstEmailLetter);
    }
};
exports.getUserDummyImage = getUserDummyImage;
function reflect(promise) {
    return promise.then((item) => ({ item, status: 'fulfilled' }), (error) => ({ error, status: 'rejected' }));
}
/**
 * To calculate the last day of a month, we need to set date=0 and month as the next month.
 * So, if we want the last day of February (February is month = 1) we'll need to perform 'new Date(year, 2, 0).getDate()'
 */
function getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
/*
 * To convert unix timestamp to datetime using date format
 */
function unixTimestampToDate(timestamps, format = 'YYYY-MM-DD HH:mm:ss') {
    const millisecond = 1000;
    return moment_extend_1.moment.unix(timestamps / millisecond).format(format);
}
/*
 * To convert any datetime to any datetime format
 */
function convertToDatetime(datetime) {
    if ((0, moment_extend_1.moment)(new Date(datetime)).isValid()) {
        switch ((0, config_1.getConfig)().dbConnectionOptions.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
                return (0, moment_extend_1.moment)(new Date(datetime)).format('YYYY-MM-DD HH:mm:ss');
            case config_1.DatabaseTypeEnum.postgres:
            case config_1.DatabaseTypeEnum.mysql:
                return (0, moment_extend_1.moment)(new Date(datetime)).toDate();
            default:
                throw Error('cannot convert to date time');
        }
    }
    return null;
}
async function tempFile(prefix) {
    const tempPath = path.join(os.tmpdir(), prefix);
    const folder = await fs.promises.mkdtemp(tempPath);
    return path.join(folder, prefix + (0, moment_extend_1.moment)().unix() + Math.random() * 10000);
}
/*
 * Get date range according for different unitOfTimes
 */
function getDateRange(startDate, endDate, type = 'day', isFormat = false) {
    if (endDate === 'day' || endDate === 'week') {
        type = endDate;
    }
    let start = moment_extend_1.moment.utc().startOf(type);
    let end = moment_extend_1.moment.utc().endOf(type);
    if (startDate && endDate !== 'day' && endDate !== 'week') {
        start = moment_extend_1.moment.utc(startDate).startOf(type);
        end = moment_extend_1.moment.utc(endDate).endOf(type);
    }
    else {
        if ((startDate && endDate === 'day') || endDate === 'week' || (startDate && !endDate)) {
            start = moment_extend_1.moment.utc(startDate).startOf(type);
            end = moment_extend_1.moment.utc(startDate).endOf(type);
        }
    }
    if (!start.isValid() || !end.isValid()) {
        return;
    }
    if (end.isBefore(start)) {
        throw 'End date must be greater than start date.';
    }
    switch ((0, config_1.getConfig)().dbConnectionOptions.type) {
        case config_1.DatabaseTypeEnum.sqlite:
        case config_1.DatabaseTypeEnum.betterSqlite3:
            start = start.format('YYYY-MM-DD HH:mm:ss');
            end = end.format('YYYY-MM-DD HH:mm:ss');
            break;
        case config_1.DatabaseTypeEnum.postgres:
        case config_1.DatabaseTypeEnum.mysql:
            if (!isFormat) {
                start = start.toDate();
                end = end.toDate();
            }
            else {
                start = start.format();
                end = end.format();
            }
            break;
        default:
            throw Error(`cannot get date range due to unsupported database type: ${(0, config_1.getConfig)().dbConnectionOptions.type}`);
    }
    return {
        start,
        end
    };
}
const getOrganizationDummyImage = (name) => {
    const firstNameLetter = name ? name.charAt(0).toUpperCase() : '';
    return (0, exports.getDummyImage)(330, 300, firstNameLetter);
};
exports.getOrganizationDummyImage = getOrganizationDummyImage;
const getTenantLogo = (name) => {
    const firstNameLetter = name ? name.charAt(0).toUpperCase() : '';
    return (0, exports.getDummyImage)(330, 300, firstNameLetter);
};
exports.getTenantLogo = getTenantLogo;
/**
 * Merge Overlapping Date & Time
 *
 * @param ranges
 * @returns
 */
function mergeOverlappingDateRanges(ranges) {
    const sorted = ranges.sort(
    // By start, ascending
    (a, b) => a.start.getTime() - b.start.getTime());
    const dates = sorted.reduce((acc, curr) => {
        // Skip the first range
        if (acc.length === 0) {
            return [curr];
        }
        const prev = acc.pop();
        if (curr.end <= prev.end) {
            // Current range is completely inside previous
            return [...acc, prev];
        }
        // Merges overlapping (<) and contiguous (==) ranges
        if (curr.start <= prev.end) {
            // Current range overlaps previous
            return [...acc, { start: prev.start, end: curr.end }];
        }
        // Ranges do not overlap
        return [...acc, prev, curr];
    }, []);
    return dates;
}
/**
 * GET Date Range Format
 *
 * @param startDate
 * @param endDate
 * @returns
 */
function getDateRangeFormat(startDate, endDate) {
    let start = (0, moment_extend_1.moment)(startDate);
    let end = (0, moment_extend_1.moment)(endDate);
    if (!start.isValid() || !end.isValid()) {
        return;
    }
    if (end.isBefore(start)) {
        throw 'End date must be greater than start date.';
    }
    switch ((0, config_1.getConfig)().dbConnectionOptions.type) {
        case config_1.DatabaseTypeEnum.sqlite:
        case config_1.DatabaseTypeEnum.betterSqlite3:
            return {
                start: start.format('YYYY-MM-DD HH:mm:ss'),
                end: end.format('YYYY-MM-DD HH:mm:ss')
            };
        case config_1.DatabaseTypeEnum.postgres:
        case config_1.DatabaseTypeEnum.mysql:
            return {
                start: start.toDate(),
                end: end.toDate()
            };
        default:
            throw Error(`cannot get date range due to unsupported database type: ${(0, config_1.getConfig)().dbConnectionOptions.type}`);
    }
}
/**
 * Get all dates between two dates using Moment.js.
 *
 * @param startDate - The start date.
 * @param endDate - The end date.
 * @returns An array of string representations of dates.
 */
function getDaysBetweenDates(startDate, endDate, timeZone = moment_extend_1.moment.tz.guess()) {
    // Convert start and end dates to the specified timezone
    const start = moment_extend_1.moment.utc(startDate, 'YYYY-MM-DD HH:mm:ss').clone().tz(timeZone);
    const end = moment_extend_1.moment.utc(endDate, 'YYYY-MM-DD HH:mm:ss').clone().tz(timeZone);
    // Create a range using the moment-range library
    const ranges = moment_extend_1.moment.range(start, end);
    // Generate an array of dates within the range, formatted as 'YYYY-MM-DD'
    return Array.from(ranges.by('day')).map((date) => date.format('YYYY-MM-DD'));
}
/**
 * Get a fresh timestamp for the entity.
 *
 * @returns {Date}
 */
function freshTimestamp() {
    return new Date(moment_extend_1.moment.now());
}
/**
 * Validates the date range between startedAt and stoppedAt.
 *
 * @param startedAt The start date of the range.
 * @param stoppedAt The end date of the range.
 * @throws BadRequestException if the stoppedAt date is before the startedAt date.
 */
function validateDateRange(startedAt, stoppedAt) {
    const start = (0, moment_extend_1.moment)(startedAt);
    const end = (0, moment_extend_1.moment)(stoppedAt);
    // Validate that both dates are valid
    if (!start.isValid() || !end.isValid()) {
        throw new common_1.BadRequestException('Started and Stopped date must be valid dates.');
    }
    // Only throw error if stoppedAt is smaller than startedAt
    if (end.isBefore(start)) {
        throw new common_1.BadRequestException('Stopped date must be greater than or equal to the started date.');
    }
}
/**
 * Function that returns intersection of 2 arrays
 * @param arr1 Array 1
 * @param arr2 Array 2
 * @returns Intersection of arr1 and arr2
 */
function getArrayIntersection(arr1, arr2) {
    const set1 = new Set(arr1);
    return arr2.filter((element) => set1.has(element));
}
/**
 * Check if the given database connection type is SQLite.
 *
 * @param {string} dbConnection - The database connection type.
 * @returns {boolean} - Returns true if the database connection type is SQLite.
 */
function isSqliteDB(dbConnection) {
    return isDatabaseType([config_1.DatabaseTypeEnum.sqlite, config_1.DatabaseTypeEnum.betterSqlite3], dbConnection);
}
/**
 * Enum representing different ORM types.
 */
var MultiORMEnum;
(function (MultiORMEnum) {
    MultiORMEnum["TypeORM"] = "typeorm";
    MultiORMEnum["MikroORM"] = "mikro-orm";
})(MultiORMEnum || (exports.MultiORMEnum = MultiORMEnum = {}));
/**
 * Get the Object-Relational Mapping (ORM) type from the environment variable `DB_ORM`.
 * @param {MultiORM} defaultValue - The default ORM type to use if `DB_ORM` is not set or an invalid value is provided.
 * @returns {MultiORM} - The determined ORM type.
 */
function getORMType(defaultValue = MultiORMEnum.TypeORM) {
    // Check if the environment variable `DB_ORM` is not set, and return the default value.
    if (!process.env.DB_ORM)
        return defaultValue;
    // Determine the ORM type based on the value of `DB_ORM`.
    switch (process.env.DB_ORM) {
        case MultiORMEnum.TypeORM:
            return MultiORMEnum.TypeORM;
        case MultiORMEnum.MikroORM:
            return MultiORMEnum.MikroORM;
        default:
            // If an invalid value is provided, return the default value.
            return defaultValue;
    }
}
/**
 * Gets the database type based on the provided database connection options or default options.
 *
 * @param {IDBConnectionOptions} [dbConnection] - The optional database connection options.
 * @returns {DatabaseTypeEnum} - The detected database type.
 */
function getDBType(dbConnection) {
    const dbORM = getORMType();
    if (!dbConnection) {
        dbConnection = (0, config_1.getConfig)().dbConnectionOptions;
    }
    let dbType;
    switch (dbORM) {
        case MultiORMEnum.MikroORM:
            if (dbConnection.driver instanceof better_sqlite_1.BetterSqliteDriver) {
                dbType = config_1.DatabaseTypeEnum.betterSqlite3;
            }
            else if (dbConnection.driver instanceof postgresql_1.PostgreSqlDriver) {
                dbType = config_1.DatabaseTypeEnum.postgres;
            }
            else if (dbConnection.driver instanceof mysql_1.MySqlDriver) {
                dbType = config_1.DatabaseTypeEnum.mysql;
            }
            else {
                dbType = config_1.DatabaseTypeEnum.postgres;
            }
            break;
        default:
            dbType = dbConnection.type;
            break;
    }
    return dbType;
}
/**
 * Checks whether the provided database type(s) match the database type of the given connection options.
 * If no connection options are provided, it uses the default options from the configuration.
 *
 * @param {DatabaseTypeEnum | DatabaseTypeEnum[]} types - The expected database type(s) to check against.
 * @param {IDBConnectionOptions} [dbConnection] - The optional database connection options.
 * @returns {boolean} - Returns true if the database type matches any of the provided types.
 */
function isDatabaseType(types, dbConnection) {
    // If no connection options are provided, use the default options from the configuration
    if (!dbConnection) {
        dbConnection = (0, config_1.getConfig)().dbConnectionOptions;
    }
    // Get the database type from the connection options
    let dbType = getDBType(dbConnection);
    // Check if the provided types match the database type
    if (types instanceof Array) {
        return types.includes(dbType);
    }
    else {
        return types == dbType;
    }
}
/**
 * Recursively flattens nested objects into an array of dot-notated keys.
 * If the input is already an array, returns it as is.
 *
 * @param {any} input - The input object or array to be flattened.
 * @returns {string[]} - An array of dot-notated keys.
 */
const flatten = (input) => {
    if (Array.isArray(input)) {
        // If input is already an array, return it as is
        return input;
    }
    if (typeof input === 'object' && input !== null) {
        return (Object.keys(input).reduce((acc, key) => {
            const value = input[key];
            if (value) {
                const nestedKeys = (0, exports.flatten)(value);
                const newKey = Array.isArray(value)
                    ? key
                    : nestedKeys.length > 0
                        ? `${key}.${nestedKeys.join('.')}`
                        : key;
                return acc.concat(newKey);
            }
        }, []) || []);
    }
    // If input is neither an array nor an object, return an empty array
    return [];
};
exports.flatten = flatten;
/**
 * Path segments that must never be used as object keys when building find-option objects from
 * (potentially untrusted) string input, to avoid prototype-pollution assignments.
 */
const UNSAFE_FIND_OPTION_SEGMENTS = new Set(['__proto__', 'prototype', 'constructor']);
/**
 * Maximum depth of a client-supplied `relations` value: both how deeply the structure may nest and
 * how many segments one relation path may carry, whichever way the path was spelled (nested keys, a
 * dotted string, or a mixture).
 *
 * The bound exists to keep a hostile payload from exhausting the stack (a body nested thousands of
 * levels deep) or burning CPU on a single enormous dotted path, whose every growing prefix would
 * otherwise be copied and stored. No real entity graph — and no entry in a sensitive-relation
 * config — comes anywhere near it, and TypeORM itself rejects a path whose hops do not exist.
 *
 * Exceeding it is REFUSED rather than truncated. Truncating would hand the caller the paths collected
 * so far while the ORM still joined the whole structure it was given — the relations past the bound
 * would be loaded without ever being offered to a permission check. Since `organization` and the
 * back-relation every `TenantOrganizationBaseEntity` carries form a cycle
 * (`organization.tags.organization.tags…`), an attacker can chain real hops until the bound is
 * reached and hang a protected relation off the far end, so "too deep to check" must mean "refused",
 * not "allowed".
 */
const MAX_RELATION_PATH_DEPTH = 20;
/**
 * Appends one dot-notated relation fragment to `prefix`, adding EVERY intermediate prefix to `paths`.
 *
 * `appendRelationPath('organization', 1, 'payments.invoice', paths)` records `organization.payments`
 * and `organization.payments.invoice`, so a permission lookup matches at whatever depth the config
 * declares the relation.
 *
 * @param prefix - The already canonicalized parent path (`''` at the root).
 * @param prefixSegments - How many segments `prefix` carries.
 * @param fragment - A single relation fragment, possibly itself dot-notated.
 * @param paths - The accumulator every emitted path is added to.
 * @returns The full path for `fragment` with its segment count, or `null` when the fragment is empty.
 * @throws BadRequestException when a segment is prototype-polluting, or when the full path would carry
 *         more than {@link MAX_RELATION_PATH_DEPTH} segments.
 */
function appendRelationPath(prefix, prefixSegments, fragment, paths) {
    const segments = fragment.split('.').filter((segment) => segment.length > 0);
    // An empty fragment names nothing.
    if (segments.length === 0) {
        return null;
    }
    // A prototype-polluting segment must never become an object key (the value can originate from an
    // untrusted API `relations` param). It is refused rather than dropped: the checks built on this
    // walk do not rewrite the value they inspect, so a dropped branch would still reach the ORM
    // without ever having been offered to the check.
    if (segments.some((segment) => UNSAFE_FIND_OPTION_SEGMENTS.has(segment))) {
        throw new common_1.BadRequestException(`The 'relations' option contains an invalid relation name.`);
    }
    // Checked before any prefix is built, so an enormous dotted string costs one split rather than a
    // quadratic series of ever longer copies.
    if (prefixSegments + segments.length > MAX_RELATION_PATH_DEPTH) {
        throw new common_1.BadRequestException(`A relation path in the 'relations' option may not be longer than ${MAX_RELATION_PATH_DEPTH} segments.`);
    }
    let path = prefix;
    for (const segment of segments) {
        path = path ? `${path}.${segment}` : segment;
        paths.add(path);
    }
    return { path, segments: prefixSegments + segments.length };
}
/**
 * Depth-first walk behind {@link normalizeRelationsToPaths} and {@link canonicalizeFindOptionsRelations}.
 *
 * @param value - The (sub-)structure to canonicalize.
 * @param prefix - The canonicalized path of the parent key (`''` at the root).
 * @param prefixSegments - How many segments `prefix` carries.
 * @param paths - The accumulator every emitted path is added to.
 * @param depth - The current recursion depth.
 * @param mode - How an object-form leaf is read; see {@link RelationPathMode}.
 * @throws BadRequestException when the structure nests deeper, or a path runs longer, than
 *         {@link MAX_RELATION_PATH_DEPTH}, or when a relation name is prototype-polluting.
 */
function collectRelationPaths(value, prefix, prefixSegments, paths, depth, mode) {
    // Fail closed: see MAX_RELATION_PATH_DEPTH. Returning the paths gathered so far would authorize a
    // prefix of the request while the ORM joined all of it.
    if (depth > MAX_RELATION_PATH_DEPTH) {
        throw new common_1.BadRequestException(`The 'relations' option may not nest deeper than ${MAX_RELATION_PATH_DEPTH} levels.`);
    }
    if (value === null || value === undefined) {
        return;
    }
    // A string is a relation path (or a comma-separated list of them).
    if (typeof value === 'string') {
        for (const fragment of value.split(',')) {
            appendRelationPath(prefix, prefixSegments, fragment.trim(), paths);
        }
        return;
    }
    // An array holds further relation values: strings, or objects (`[{ organization: { payments: true } }]`).
    if (Array.isArray(value)) {
        for (const entry of value) {
            collectRelationPaths(entry, prefix, prefixSegments, paths, depth + 1, mode);
        }
        return;
    }
    if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
            const child = value[key];
            // Only objects and arrays carry further relation names; a scalar leaf (`true`, `'x'`, `1`)
            // terminates the path. In `authorize` mode the path is emitted REGARDLESS of that leaf's
            // value; in `orm` mode only for a leaf TypeORM would join. See RelationPathMode.
            if (mode === 'orm' && child !== true && typeof child !== 'object') {
                continue;
            }
            const appended = appendRelationPath(prefix, prefixSegments, key, paths);
            // An empty key names nothing, and neither does anything under it.
            if (appended === null) {
                continue;
            }
            if (child !== null && typeof child === 'object') {
                collectRelationPaths(child, appended.path, appended.segments, paths, depth + 1, mode);
            }
        }
    }
    // Numbers, booleans and functions name no relation.
}
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
function normalizeRelationsToPaths(relations) {
    const paths = new Set();
    collectRelationPaths(relations, '', 0, paths, 0, 'authorize');
    return Array.from(paths);
}
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
function stringArrayToFindOptionsObject(paths) {
    let result = {};
    for (const rawPath of paths) {
        if (typeof rawPath !== 'string' || rawPath.length === 0) {
            continue;
        }
        // Drop empty segments so malformed inputs like `role.` or `tenant..settings` don't create
        // bogus `''` relation keys, and reject any path that carries a prototype-polluting segment
        // (these values can originate from untrusted API `relations`/`select` query params).
        const segments = rawPath.split('.').filter((segment) => segment.length > 0);
        if (segments.length === 0 || segments.some((segment) => UNSAFE_FIND_OPTION_SEGMENTS.has(segment))) {
            continue;
        }
        let cursor = result;
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const isLeaf = i === segments.length - 1;
            if (isLeaf) {
                if (cursor[segment] === undefined) {
                    cursor[segment] = true;
                }
            }
            else {
                if (cursor[segment] === true || cursor[segment] === undefined) {
                    cursor[segment] = {};
                }
                cursor = cursor[segment];
            }
        }
    }
    return result;
}
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
function canonicalizeFindOptionsRelations(relations) {
    if (relations === null || relations === undefined) {
        return undefined;
    }
    const paths = new Set();
    collectRelationPaths(relations, '', 0, paths, 0, 'orm');
    return stringArrayToFindOptionsObject(Array.from(paths));
}
/**
 * Normalizes a TypeORM `relations` find-option, converting the legacy `string[]` form to the object
 * form v1 expects and passing the object form (or `undefined`) through unchanged. Safe to call on any
 * `relations` value, so it can wrap options that may already use either syntax.
 *
 * @param relations - The `relations` option in either legacy `string[]` or object form.
 * @returns The `relations` option in object form, or the original value when not an array.
 */
function parseFindOptionsRelations(relations) {
    // NOTE: the parameter is intentionally `FindOptionsRelations<any>` (not `FindOptionsRelations<T>`)
    // so `T` is inferred from the assignment context (the field being populated), never from the
    // argument. Inferring `T` from a `string[]` argument makes `FindOptionsRelations<T>` resolve to a
    // bogus array type, which would then reject at every call site.
    if (Array.isArray(relations)) {
        return stringArrayToFindOptionsObject(relations);
    }
    return relations;
}
/**
 * Normalizes a TypeORM `select` find-option, converting the legacy `string[]` form to the object form
 * v1 expects and passing the object form (or `undefined`) through unchanged. Safe to call on any
 * `select` value, so it can wrap options that may already use either syntax.
 *
 * @param select - The `select` option in either legacy `string[]` or object form.
 * @returns The `select` option in object form, or the original value when not an array.
 */
function parseFindOptionsSelect(select) {
    // See parseFindOptionsRelations: parameter is `FindOptionsSelect<any>` so `T` is inferred from the
    // assignment context rather than a `string[]` argument.
    if (Array.isArray(select)) {
        return stringArrayToFindOptionsObject(select);
    }
    return select;
}
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
function parseTypeORMFindOptions(options) {
    if (!options || typeof options !== 'object') {
        return options;
    }
    const hasArrayRelations = Array.isArray(options.relations);
    const hasArraySelect = Array.isArray(options.select);
    if (!hasArrayRelations && !hasArraySelect) {
        return options;
    }
    return {
        ...options,
        ...(hasArrayRelations ? { relations: stringArrayToFindOptionsObject(options.relations) } : {}),
        ...(hasArraySelect ? { select: stringArrayToFindOptionsObject(options.select) } : {})
    };
}
/**
 * Concatenate an ID to the given MikroORM where condition.
 *
 * @param id - The ID to concatenate to the where condition.
 * @param where - MikroORM where condition.
 * @returns Concatenated MikroORM where condition.
 */
function concatIdToWhere(id, where) {
    if (where instanceof Array) {
        where = where.concat({ id });
    }
    else {
        where = {
            id,
            ...(where ? where : {})
        };
    }
    return where;
}
/**
 * Adds 'tenantId' to a 'where' clause, supporting both objects and arrays.
 *
 * @param tenantId - The tenant ID to add.
 * @param where - The current 'where' clause.
 * @returns An updated 'where' clause including the 'tenantId'.
 */
function enhanceWhereWithTenantId(tenantId, where) {
    if (Array.isArray(where)) {
        // Merge tenantId into each object of the array
        return where.map((condition) => ({ ...condition, tenantId }));
    }
    else {
        // Merge where with tenantId if where is an object
        return { ...where, tenantId };
    }
}
/**
 * Convert TypeORM's FindManyOptions to MikroORM's equivalent options.
 *
 * @param options - TypeORM's FindManyOptions.
 * @returns An object with MikroORM's where and options.
 */
function parseTypeORMFindToMikroOrm(options) {
    // The parameter accepts the legacy string-array `relations`/`select` form: the MikroORM path
    // consumes both forms natively (see `flatten`), so no conversion is applied here.
    const mikroOptions = {
        disableIdentityMap: true,
        populate: []
    };
    let where = {};
    // Parses TypeORM `where` option to MikroORM `where` option
    if (options && options.where) {
        where = convertTypeORMWhereToMikroORM(options.where);
    }
    // Parses TypeORM `select` option to MikroORM `fields` option
    if (options && options.select) {
        mikroOptions.fields = (0, exports.flatten)(options.select);
    }
    // Parses TypeORM `relations` option to MikroORM `populate` option
    if (options && options.relations) {
        mikroOptions.populate = (0, exports.flatten)(options.relations);
    }
    // Parses TypeORM `order` option to MikroORM `orderBy` option
    if (options && options.order) {
        mikroOptions.orderBy = parseOrderOptions(options.order);
    }
    // Parses TypeORM `skip` option to MikroORM `offset` option
    if (options && options.skip) {
        mikroOptions.offset = options.take * (options.skip - 1);
    }
    // Parses TypeORM `take` option to MikroORM `limit` option
    if (options && options.take) {
        mikroOptions.limit = options.take;
    }
    // If options contain 'withDeleted', add the SOFT_DELETABLE_FILTER to existing filters
    if (options && options.withDeleted) {
        mikroOptions.filters = { [mikro_orm_soft_delete_1.SOFT_DELETABLE_FILTER]: false };
    }
    return { where, mikroOptions };
}
/**
 * Parses TypeORM 'order' option to MikroORM 'orderBy' option.
 * @param order TypeORM 'order' option
 * @returns Parsed MikroORM 'orderBy' option
 */
function parseOrderOptions(order) {
    return Object.entries(order).reduce((acc, [key, value]) => {
        acc[key] = `${value}`.toLowerCase();
        return acc;
    }, {});
}
/**
 * Transforms a FindOperator object into a query condition suitable for database operations.
 * It handles simple conditions such as 'equal', 'in' and 'between',
 * as well as complex conditions like recursive 'not' operators and range queries with 'between'.
 *
 * @param operator A FindOperator object containing the type of condition and its corresponding value.
 * @returns A query condition in the format of a Record<string, any> that represents the translated condition.
 *
 */
function processFindOperator(operator) {
    switch (operator.type) {
        case 'isNull': {
            return null;
        }
        case 'not': {
            // If the nested value is also a FindOperator, process it recursively
            if (operator.child && operator.child instanceof typeorm_1.FindOperator) {
                return { $ne: processFindOperator(operator.child) };
            }
            else {
                const nested = operator.value || null;
                return { $ne: nested };
            }
        }
        case 'in': {
            return { $in: operator.value };
        }
        case 'equal': {
            return { $eq: operator.value };
        }
        case 'between': {
            // Assuming the value for 'between' is an array with two elements
            return {
                $gte: operator.value[0],
                $lte: operator.value[1]
            };
        }
        case 'moreThanOrEqual': {
            return { $gte: operator.value };
        }
        case 'moreThan': {
            return { $gt: operator.value };
        }
        // Add additional cases for other operator types if needed
        default: {
            // Handle unknown or unimplemented operator types
            console.warn(`Unsupported FindOperator type: ${operator.type}`);
            return {};
        }
    }
}
/**
 * Converts a TypeORM query condition into a format that is compatible with MikroORM.
 * This function recursively processes each condition, handling both simple key-value
 * pairs and complex nested objects including FindOperators.
 *
 * @param where The TypeORM condition to be converted, typically as a filter query object.
 * @returns An object representing the MikroORM compatible condition.
 */
function convertTypeORMConditionToMikroORM(where) {
    const mikroORMCondition = {};
    for (const [key, value] of Object.entries(where)) {
        if (typeof value === 'object' && value !== null && !(value instanceof Array)) {
            if (value instanceof typeorm_1.FindOperator) {
                // Convert nested FindOperators
                mikroORMCondition[key] = processFindOperator(value);
            }
            else {
                // Recursively convert nested objects
                mikroORMCondition[key] = convertTypeORMConditionToMikroORM(value);
            }
        }
        else {
            // Assign simple key-value pairs directly
            mikroORMCondition[key] = value;
        }
    }
    return mikroORMCondition;
}
/**
 * Converts TypeORM 'where' conditions into a format compatible with MikroORM.
 * This function can handle both individual condition objects and arrays of conditions,
 * applying the necessary conversion to each condition.
 *
 * @param where The TypeORM 'where' condition or an array of conditions to be converted.
 * @returns A MikroORM compatible condition or array of conditions.
 */
function convertTypeORMWhereToMikroORM(where) {
    // If 'where' is an array, process each condition in the array
    if (Array.isArray(where)) {
        return where.map((condition) => convertTypeORMConditionToMikroORM(condition));
    }
    // Otherwise, just convert the single condition object
    return convertTypeORMConditionToMikroORM(where);
}
/**
 * Serializes the provided entity based on the ORM type.
 * @param entity The entity to be serialized.
 * @returns The serialized entity.
 */
function wrapSerialize(entity) {
    // If using MikroORM, use wrap(entity).toJSON() for serialization
    return (0, core_1.wrap)(entity).toJSON();
}
/**
 * Converts the given entity instance to a plain object.
 *
 * This function creates a shallow copy of the entity, retaining its properties as a plain object,
 * making it suitable for use in contexts where a non-class representation is required.
 *
 * @param entity - The entity instance to be converted to a plain object.
 * @returns A plain object representation of the given entity instance.
 */
function toPlain(entity) {
    return { ...entity };
}
/**
 * Converts the given entity instance to a JSON object.
 *
 * This function creates a deep copy of the entity, converting it into a JSON-compatible structure,
 * making it suitable for serialization or transferring over a network.
 *
 * @param entity - The entity instance to be converted to a JSON object.
 * @returns A JSON representation of the given entity instance.
 */
function toJSON(entity) {
    return JSON.parse(JSON.stringify(toPlain(entity)));
}
/**
 * Replace $ placeholders with ? for mysql, sqlite, and better-sqlite3
 * @param query - The SQL query with $ placeholders
 * @param dbType - The database type
 * @returns The SQL query with ? placeholders if applicable
 */
function replacePlaceholders(query, dbType) {
    if ([config_1.DatabaseTypeEnum.sqlite, config_1.DatabaseTypeEnum.betterSqlite3, config_1.DatabaseTypeEnum.mysql].includes(dbType)) {
        return query.replace(/\$\d+/g, '?');
    }
    if ([config_1.DatabaseTypeEnum.mysql].includes(dbType)) {
        // Replace double quotes with backticks for MySQL
        query = query.replace(/"/g, '`');
    }
    return query;
}
/**
 * Retries a given asynchronous query function for a specified number of times.
 *
 * @param query - A function returning a Promise of type T.
 * @param retries - The number of retries allowed (default is 3).
 * @returns A Promise that resolves with the query result if successful.
 * @throws An error if all retries fail.
 */
async function retryQuery(query, retries = 3) {
    try {
        return await query();
    }
    catch (error) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return retryQuery(query, retries - 1);
        }
        throw new Error(`Failed to fetch data: ${error?.message}`, error);
    }
}
//# sourceMappingURL=utils.js.map