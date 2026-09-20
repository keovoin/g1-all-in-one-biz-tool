"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityDurationQueryString = exports.getTotalDurationQueryString = exports.getDurationQueryString = void 0;
const config_1 = require("@gauzy/config");
const database_helper_1 = require("./../../database/database.helper");
/**
 * Generates a duration query string based on the provided database type, log query alias, and slot query alias.
 *
 * @param dbType The type of database (e.g., sqlite, postgres, mysql).
 * @param logQueryAlias The alias used for the log query.
 * @param slotQueryAlias The alias used for the slot query.
 * @returns A string representing the duration query.
 */
const getDurationQueryString = (dbType, logQueryAlias, slotQueryAlias) => {
    switch (dbType) {
        case config_1.DatabaseTypeEnum.sqlite:
        case config_1.DatabaseTypeEnum.betterSqlite3:
            return `COALESCE(
				ROUND(
					SUM(
						CASE
							WHEN (julianday(COALESCE("${logQueryAlias}"."stoppedAt", datetime('now'))) -
								  julianday("${logQueryAlias}"."startedAt")) * 86400 >= 0
							THEN (julianday(COALESCE("${logQueryAlias}"."stoppedAt", datetime('now'))) -
								  julianday("${logQueryAlias}"."startedAt")) * 86400
							ELSE 0
						END
					) / COUNT("${slotQueryAlias}"."id")
				), 0
			)`;
        case config_1.DatabaseTypeEnum.postgres:
            return `COALESCE(
				ROUND(
					SUM(
						CASE
							WHEN extract(epoch from (COALESCE("${logQueryAlias}"."stoppedAt", NOW()) - "${logQueryAlias}"."startedAt")) >= 0
							THEN extract(epoch from (COALESCE("${logQueryAlias}"."stoppedAt", NOW()) - "${logQueryAlias}"."startedAt"))
							ELSE 0
						END
					) / COUNT("${slotQueryAlias}"."id")
				), 0
			)`;
        case config_1.DatabaseTypeEnum.mysql:
            return (0, database_helper_1.prepareSQLQuery)(`COALESCE(
				ROUND(
					SUM(
						CASE
							WHEN TIMESTAMPDIFF(SECOND, \`${logQueryAlias}\`.\`startedAt\`, COALESCE(\`${logQueryAlias}\`.\`stoppedAt\`, NOW())) >= 0
							THEN TIMESTAMPDIFF(SECOND, \`${logQueryAlias}\`.\`startedAt\`, COALESCE(\`${logQueryAlias}\`.\`stoppedAt\`, NOW()))
							ELSE 0
						END
					) / COUNT(\`${slotQueryAlias}\`.\`id\`)
				), 0
			)`);
        default:
            throw new Error(`Unsupported database type: ${dbType}`);
    }
};
exports.getDurationQueryString = getDurationQueryString;
/**
 * Generates a SQL query string for calculating the total duration of tasks across all time.
 * The query varies depending on the database type.
 *
 * @param dbType The type of the database (e.g., SQLite, PostgreSQL, MySQL).
 * @param queryAlias The alias used for the table in the SQL query.
 * @returns The SQL query string for calculating task total duration.
 */
const getTotalDurationQueryString = (dbType, queryAlias) => {
    switch (dbType) {
        case config_1.DatabaseTypeEnum.sqlite:
        case config_1.DatabaseTypeEnum.betterSqlite3:
            return `COALESCE(
				ROUND(
					SUM(
						CASE
							WHEN (julianday(COALESCE("${queryAlias}"."stoppedAt", datetime('now'))) -
								  julianday("${queryAlias}"."startedAt")) * 86400 >= 0
							THEN (julianday(COALESCE("${queryAlias}"."stoppedAt", datetime('now'))) -
								  julianday("${queryAlias}"."startedAt")) * 86400
							ELSE 0
						END
					)
				), 0
			)`;
        case config_1.DatabaseTypeEnum.postgres:
            return `COALESCE(
				ROUND(
					SUM(
						CASE
							WHEN extract(epoch from (COALESCE("${queryAlias}"."stoppedAt", NOW()) - "${queryAlias}"."startedAt")) >= 0
							THEN extract(epoch from (COALESCE("${queryAlias}"."stoppedAt", NOW()) - "${queryAlias}"."startedAt"))
							ELSE 0
						END
					)
				), 0
			)`;
        case config_1.DatabaseTypeEnum.mysql:
            return (0, database_helper_1.prepareSQLQuery)(`COALESCE(
				ROUND(
					SUM(
						CASE
							WHEN TIMESTAMPDIFF(SECOND, \`${queryAlias}\`.\`startedAt\`, COALESCE(\`${queryAlias}\`.\`stoppedAt\`, NOW())) >= 0
							THEN TIMESTAMPDIFF(SECOND, \`${queryAlias}\`.\`startedAt\`, COALESCE(\`${queryAlias}\`.\`stoppedAt\`, NOW()))
							ELSE 0
						END
					)
				), 0
			)`);
        default:
            throw Error(`Unsupported database type: ${dbType}`);
    }
};
exports.getTotalDurationQueryString = getTotalDurationQueryString;
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
const getActivityDurationQueryString = (dbType, queryAlias) => {
    switch (dbType) {
        case config_1.DatabaseTypeEnum.sqlite:
        case config_1.DatabaseTypeEnum.betterSqlite3:
        case config_1.DatabaseTypeEnum.postgres:
            return `"${queryAlias}"."recordedAt" BETWEEN :start AND :end`;
        case config_1.DatabaseTypeEnum.mysql:
            return (0, database_helper_1.prepareSQLQuery)(`"${queryAlias}"."recordedAt" BETWEEN :start AND :end`);
        default:
            throw Error(`cannot create statistic query due to unsupported database type: ${dbType}`);
    }
};
exports.getActivityDurationQueryString = getActivityDurationQueryString;
//# sourceMappingURL=statistic.helper.js.map