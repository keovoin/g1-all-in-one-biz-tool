"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddActivityRecordedAtCompositeIndexes1784469645043 = void 0;
const config_1 = require("@gauzy/config");
const chalk = require("chalk");
class AddActivityRecordedAtCompositeIndexes1784469645043 {
    constructor() {
        this.name = 'AddActivityRecordedAtCompositeIndexes1784469645043';
    }
    /**
     * Up Migration
     *
     * (1) Backfills `activity.recordedAt` from `date` + `time` for legacy rows where it is NULL,
     *     so the report/statistic queries — which now filter on `recordedAt` — do not silently
     *     omit those rows.
     * (2) Adds composite indexes on `activity` to support the Time & Activity reports and the
     *     dashboard activity statistics, which filter by `(organizationId, employeeId, recordedAt)`
     *     (per-employee) and `(organizationId, recordedAt)` (org-wide) over a date range.
     *
     * NOTE: On existing large deployments, create the indexes out-of-band first with
     * `CREATE INDEX CONCURRENTLY` (the Postgres/SQLite branches use `IF NOT EXISTS`, so this
     * migration is then a no-op for them) and run the backfill out-of-band too, so this migration's
     * in-transaction backfill + index build stays fast and does not hold a write lock.
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        switch (queryRunner.connection.options.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
                await this.sqliteUpQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresUpQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlUpQueryRunner(queryRunner);
                break;
            default:
                throw new Error(`Unsupported database: ${queryRunner.connection.options.type}`);
        }
    }
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    async down(queryRunner) {
        switch (queryRunner.connection.options.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
                await this.sqliteDownQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresDownQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlDownQueryRunner(queryRunner);
                break;
            default:
                throw new Error(`Unsupported database: ${queryRunner.connection.options.type}`);
        }
    }
    /**
     * Postgres and SQLite share identical index DDL (both accept double-quoted identifiers and
     * `IF NOT EXISTS`), so the creation/removal is factored out to avoid duplicated SQL.
     */
    async createStandardIndexes(queryRunner) {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_activity_org_emp_recordedat" ON "activity" ("organizationId", "employeeId", "recordedAt")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_activity_org_recordedat" ON "activity" ("organizationId", "recordedAt")`);
    }
    async dropStandardIndexes(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_activity_org_recordedat"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_activity_org_emp_recordedat"`);
    }
    /**
     * PostgreSQL Up Migration
     *
     * @param queryRunner
     */
    async postgresUpQueryRunner(queryRunner) {
        await queryRunner.query(`UPDATE "activity" SET "recordedAt" = CONCAT("date", ' ', "time")::timestamp WHERE "recordedAt" IS NULL AND "date" IS NOT NULL AND "time" IS NOT NULL`);
        await this.createStandardIndexes(queryRunner);
    }
    /**
     * PostgreSQL Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await this.dropStandardIndexes(queryRunner);
    }
    /**
     * SQLite Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`UPDATE "activity" SET "recordedAt" = datetime("date" || ' ' || "time") WHERE "recordedAt" IS NULL AND "date" IS NOT NULL AND "time" IS NOT NULL`);
        await this.createStandardIndexes(queryRunner);
    }
    /**
     * SQLite Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await this.dropStandardIndexes(queryRunner);
    }
    /**
     * MySQL Up Migration
     *
     * MySQL has no `CREATE INDEX ... IF NOT EXISTS`, so these run as plain statements. MySQL is not
     * part of the out-of-band `CREATE INDEX CONCURRENTLY` pre-creation path, so a fresh migration
     * run does not encounter pre-existing indexes.
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
        await queryRunner.query(`UPDATE \`activity\` SET \`recordedAt\` = STR_TO_DATE(CONCAT(\`date\`, ' ', \`time\`), '%Y-%m-%d %H:%i:%s') WHERE \`recordedAt\` IS NULL AND \`date\` IS NOT NULL AND \`time\` IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`idx_activity_org_emp_recordedat\` ON \`activity\` (\`organizationId\`, \`employeeId\`, \`recordedAt\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_activity_org_recordedat\` ON \`activity\` (\`organizationId\`, \`recordedAt\`)`);
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX \`idx_activity_org_recordedat\` ON \`activity\``);
        await queryRunner.query(`DROP INDEX \`idx_activity_org_emp_recordedat\` ON \`activity\``);
    }
}
exports.AddActivityRecordedAtCompositeIndexes1784469645043 = AddActivityRecordedAtCompositeIndexes1784469645043;
//# sourceMappingURL=1784469645043-AddActivityRecordedAtCompositeIndexes.js.map