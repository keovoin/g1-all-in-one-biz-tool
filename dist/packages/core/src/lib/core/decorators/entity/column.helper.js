"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDbType = resolveDbType;
exports.getColumnType = getColumnType;
exports.parseMikroOrmColumnOptions = parseMikroOrmColumnOptions;
/**
 * Resolve the database column type.
 * @param columnType - The input column type.
 * @returns The resolved column type.
 */
function resolveDbType(columnType) {
    return columnType;
}
/**
 * Maps a generic type to a database-specific column type based on the provided database engine.
 *
 * @param dbEngine - The type of the database engine.
 * @param type - The generic type to be mapped.
 * @returns The database-specific column type.
 */
function getColumnType(dbEngine, type) {
    switch (type) {
        case 'string':
            return 'varchar';
    }
    return 'varchar';
}
/**
 * Parse MikroORM column options.
 * @param param0 - The options for parsing column arguments.
 * @returns MikroORM column options.
 */
function parseMikroOrmColumnOptions({ type, options }) {
    if (typeof options?.default === 'function') {
        options.default = options.default();
    }
    if (options?.relationId) {
        options.persist = false;
    }
    return {
        type: type,
        ...options
    };
}
//# sourceMappingURL=column.helper.js.map