"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndexesColumnsToTheTimesheetTable1680164421193 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddIndexesColumnsToTheTimesheetTable1680164421193 {
    constructor() {
        this.name = 'AddIndexesColumnsToTheTimesheetTable1680164421193';
    }
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        switch (queryRunner.dataSource.options.type) {
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
                throw Error(`Unsupported database: ${queryRunner.dataSource.options.type}`);
        }
    }
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    async down(queryRunner) {
        switch (queryRunner.dataSource.options.type) {
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
                throw Error(`Unsupported database: ${queryRunner.dataSource.options.type}`);
        }
    }
    /**
    * PostgresDB Up Migration
    *
    * @param queryRunner
    */
    async postgresUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE INDEX "IDX_930e2b28de9ecb1ea689d5a97a" ON "timesheet" ("startedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_f6558fbb3158ab90da1c41d943" ON "timesheet" ("stoppedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a79eb7534066b11f59243ede1" ON "timesheet" ("approvedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f8fc4b5718fcaa913f9438e27" ON "timesheet" ("submittedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_3502c60f98a7cda58dea75bcb5" ON "timesheet" ("lockedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_c828facbb4250117f83416d9f7" ON "timesheet" ("isBilled") `);
        await queryRunner.query(`CREATE INDEX "IDX_23fdffa8369387d87101090684" ON "timesheet" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9c9895301adc96bb9eedbc27f" ON "timesheet" ("deletedAt") `);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_d9c9895301adc96bb9eedbc27f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23fdffa8369387d87101090684"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c828facbb4250117f83416d9f7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3502c60f98a7cda58dea75bcb5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f8fc4b5718fcaa913f9438e27"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a79eb7534066b11f59243ede1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6558fbb3158ab90da1c41d943"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_930e2b28de9ecb1ea689d5a97a"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE INDEX "IDX_930e2b28de9ecb1ea689d5a97a" ON "timesheet" ("startedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_f6558fbb3158ab90da1c41d943" ON "timesheet" ("stoppedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a79eb7534066b11f59243ede1" ON "timesheet" ("approvedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f8fc4b5718fcaa913f9438e27" ON "timesheet" ("submittedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_3502c60f98a7cda58dea75bcb5" ON "timesheet" ("lockedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_c828facbb4250117f83416d9f7" ON "timesheet" ("isBilled") `);
        await queryRunner.query(`CREATE INDEX "IDX_23fdffa8369387d87101090684" ON "timesheet" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9c9895301adc96bb9eedbc27f" ON "timesheet" ("deletedAt") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_d9c9895301adc96bb9eedbc27f"`);
        await queryRunner.query(`DROP INDEX "IDX_23fdffa8369387d87101090684"`);
        await queryRunner.query(`DROP INDEX "IDX_c828facbb4250117f83416d9f7"`);
        await queryRunner.query(`DROP INDEX "IDX_3502c60f98a7cda58dea75bcb5"`);
        await queryRunner.query(`DROP INDEX "IDX_3f8fc4b5718fcaa913f9438e27"`);
        await queryRunner.query(`DROP INDEX "IDX_6a79eb7534066b11f59243ede1"`);
        await queryRunner.query(`DROP INDEX "IDX_f6558fbb3158ab90da1c41d943"`);
        await queryRunner.query(`DROP INDEX "IDX_930e2b28de9ecb1ea689d5a97a"`);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) { }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) { }
}
exports.AddIndexesColumnsToTheTimesheetTable1680164421193 = AddIndexesColumnsToTheTimesheetTable1680164421193;
//# sourceMappingURL=1680164421193-AddIndexesColumnsToTheTimesheetTable.js.map