/**
 * Database serialization utilities for handling JSON data across different database types
 * SQLite requires JSON to be stored as strings, while PostgreSQL/MySQL can handle objects directly
 */
/**
 * Checks if the current database requires JSON serialization (SQLite variants)
 * @returns true if database needs JSON serialization, false otherwise
 */
export declare function requiresJsonSerialization(): boolean;
/**
 *  Serializes data for database storage
 * Converts objects to JSON strings for SQLite, leaves as-is for other databases
 * @param data - The data to serialize
 * @returns Serialized data (string for SQLite, original object for others)
 */
export declare function stringifyForDatabase<T = any>(data: T): string | T;
/**
 * Parse data from database storage
 * Parses JSON strings from SQLite, returns as-is for other databases
 * @param data - The data to parse
 * @returns Parsed data
 */
export declare function parseFromDatabase<T = any>(data: any): T | null;
