"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterCandidateFeedbackTable1664869127437 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterCandidateFeedbackTable1664869127437 {
    constructor() {
        this.name = 'AlterCandidateFeedbackTable1664869127437';
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
        await queryRunner.query(`ALTER TABLE "candidate_feedback" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."candidate_feedback_status_enum" AS ENUM('APPLIED', 'REJECTED', 'HIRED')`);
        await queryRunner.query(`ALTER TABLE "candidate_feedback" ADD "status" "public"."candidate_feedback_status_enum"`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "candidate_feedback" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."candidate_feedback_status_enum"`);
        await queryRunner.query(`ALTER TABLE "candidate_feedback" ADD "status" character varying`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) { }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) { }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
    }
}
exports.AlterCandidateFeedbackTable1664869127437 = AlterCandidateFeedbackTable1664869127437;
//# sourceMappingURL=1664869127437-AlterCandidateFeedbackTable.js.map