/**
 * Generates a duration query string based on the provided database type, log query alias, and slot query alias.
 *
 * @param dbType The type of database (e.g., sqlite, postgres, mysql).
 * @param logQueryAlias The alias used for the log query.
 * @param slotQueryAlias The alias used for the slot query.
 * @returns A string representing the duration query.
 */
export declare const getDurationQueryString: (dbType: string, logQueryAlias: string, slotQueryAlias: string) => string;
/**
 * Generates a SQL query string for calculating the total duration of tasks across all time.
 * The query varies depending on the database type.
 *
 * @param dbType The type of the database (e.g., SQLite, PostgreSQL, MySQL).
 * @param queryAlias The alias used for the table in the SQL query.
 * @returns The SQL query string for calculating task total duration.
 */
export declare const getTotalDurationQueryString: (dbType: string, queryAlias: string) => string;
/**
 * Generates the SQL query string for filtering activity duration based on database type.
 *
 * Filters on the indexed `recordedAt` timestamp column instead of a non-sargable
 * `concat(date, time)::timestamp` expression. The old form had to compute the value for every
 * row, so it could not use an index and forced a full scan of the (very large) activity table.
 * `recordedAt` holds the same instant (date + time) and is covered by the
 * (organizationId, employeeId, recordedAt) / (organizationId, recordedAt) indexes, turning the
 * range filter into an index range scan. Since it is a plain column comparison, the per-dialect
 * concat/cast branching is no longer needed — only identifier quoting differs, handled by `p()`.
 *
 * @param dbType The type of the database (e.g., sqlite, postgres, mysql).
 * @param queryAlias The alias used for the query table in SQL.
 * @returns The SQL query string for filtering activity duration.
 */
export declare const getActivityDurationQueryString: (dbType: string, queryAlias: string) => string;
