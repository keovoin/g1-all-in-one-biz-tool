"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresJsonSerialization = requiresJsonSerialization;
exports.stringifyForDatabase = stringifyForDatabase;
exports.parseFromDatabase = parseFromDatabase;
const config_1 = require("@gauzy/config");
/**
 * Database serialization utilities for handling JSON data across different database types
 * SQLite requires JSON to be stored as strings, while PostgreSQL/MySQL can handle objects directly
 */
/**
 * Checks if the current database requires JSON serialization (SQLite variants)
 * @returns true if database needs JSON serialization, false otherwise
 */
function requiresJsonSerialization() {
    return (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)();
}
/**
 *  Serializes data for database storage
 * Converts objects to JSON strings for SQLite, leaves as-is for other databases
 * @param data - The data to serialize
 * @returns Serialized data (string for SQLite, original object for others)
 */
function stringifyForDatabase(data) {
    if (data === null || data === undefined) {
        return data;
    }
    if (requiresJsonSerialization()) {
        try {
            if (typeof data === 'string') {
                return data;
            }
            return JSON.stringify(data);
        }
        catch (error) {
            throw new Error(`Database serialization failed: ${error.message}`);
        }
    }
    return data;
}
/**
 * Parse data from database storage
 * Parses JSON strings from SQLite, returns as-is for other databases
 * @param data - The data to parse
 * @returns Parsed data
 */
function parseFromDatabase(data) {
    if (data === null || data === undefined) {
        return null;
    }
    if (requiresJsonSerialization() && typeof data === 'string') {
        try {
            return JSON.parse(data);
        }
        catch (error) {
            return null;
        }
    }
    return data;
}
//# sourceMappingURL=db-serialization-util.js.map