"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRelatedIssueRelationToTaskTable1688966032457 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddRelatedIssueRelationToTaskTable1688966032457 {
    constructor() {
        this.name = 'AddRelatedIssueRelationToTaskTable1688966032457';
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
        await queryRunner.query(`CREATE TABLE "task_related_issues" ("taskId_1" uuid NOT NULL, "taskId_2" uuid NOT NULL, CONSTRAINT "PK_08e0110595f637a60230cb30bd3" PRIMARY KEY ("taskId_1", "taskId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c93e2e6d5d0e3a1d7af2725f9f" ON "task_related_issues" ("taskId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_425ec34e019f63336fe8d2940c" ON "task_related_issues" ("taskId_2") `);
        await queryRunner.query(`ALTER TABLE "task_related_issues" ADD CONSTRAINT "FK_c93e2e6d5d0e3a1d7af2725f9fc" FOREIGN KEY ("taskId_1") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_related_issues" ADD CONSTRAINT "FK_425ec34e019f63336fe8d2940ce" FOREIGN KEY ("taskId_2") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "task_related_issues" DROP CONSTRAINT "FK_425ec34e019f63336fe8d2940ce"`);
        await queryRunner.query(`ALTER TABLE "task_related_issues" DROP CONSTRAINT "FK_c93e2e6d5d0e3a1d7af2725f9fc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_425ec34e019f63336fe8d2940c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c93e2e6d5d0e3a1d7af2725f9f"`);
        await queryRunner.query(`DROP TABLE "task_related_issues"`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "task_related_issues" ("taskId_1" varchar NOT NULL, "taskId_2" varchar NOT NULL, PRIMARY KEY ("taskId_1", "taskId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c93e2e6d5d0e3a1d7af2725f9f" ON "task_related_issues" ("taskId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_425ec34e019f63336fe8d2940c" ON "task_related_issues" ("taskId_2") `);
        await queryRunner.query(`DROP INDEX "IDX_c93e2e6d5d0e3a1d7af2725f9f"`);
        await queryRunner.query(`DROP INDEX "IDX_425ec34e019f63336fe8d2940c"`);
        await queryRunner.query(`CREATE TABLE "temporary_task_related_issues" ("taskId_1" varchar NOT NULL, "taskId_2" varchar NOT NULL, CONSTRAINT "FK_c93e2e6d5d0e3a1d7af2725f9fc" FOREIGN KEY ("taskId_1") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_425ec34e019f63336fe8d2940ce" FOREIGN KEY ("taskId_2") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("taskId_1", "taskId_2"))`);
        await queryRunner.query(`INSERT INTO "temporary_task_related_issues"("taskId_1", "taskId_2") SELECT "taskId_1", "taskId_2" FROM "task_related_issues"`);
        await queryRunner.query(`DROP TABLE "task_related_issues"`);
        await queryRunner.query(`ALTER TABLE "temporary_task_related_issues" RENAME TO "task_related_issues"`);
        await queryRunner.query(`CREATE INDEX "IDX_c93e2e6d5d0e3a1d7af2725f9f" ON "task_related_issues" ("taskId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_425ec34e019f63336fe8d2940c" ON "task_related_issues" ("taskId_2") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_425ec34e019f63336fe8d2940c"`);
        await queryRunner.query(`DROP INDEX "IDX_c93e2e6d5d0e3a1d7af2725f9f"`);
        await queryRunner.query(`ALTER TABLE "task_related_issues" RENAME TO "temporary_task_related_issues"`);
        await queryRunner.query(`CREATE TABLE "task_related_issues" ("taskId_1" varchar NOT NULL, "taskId_2" varchar NOT NULL, PRIMARY KEY ("taskId_1", "taskId_2"))`);
        await queryRunner.query(`INSERT INTO "task_related_issues"("taskId_1", "taskId_2") SELECT "taskId_1", "taskId_2" FROM "temporary_task_related_issues"`);
        await queryRunner.query(`DROP TABLE "temporary_task_related_issues"`);
        await queryRunner.query(`CREATE INDEX "IDX_425ec34e019f63336fe8d2940c" ON "task_related_issues" ("taskId_2") `);
        await queryRunner.query(`CREATE INDEX "IDX_c93e2e6d5d0e3a1d7af2725f9f" ON "task_related_issues" ("taskId_1") `);
        await queryRunner.query(`DROP INDEX "IDX_425ec34e019f63336fe8d2940c"`);
        await queryRunner.query(`DROP INDEX "IDX_c93e2e6d5d0e3a1d7af2725f9f"`);
        await queryRunner.query(`DROP TABLE "task_related_issues"`);
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
exports.AddRelatedIssueRelationToTaskTable1688966032457 = AddRelatedIssueRelationToTaskTable1688966032457;
//# sourceMappingURL=1688966032457-AddRelatedIssueRelationToTaskTable.js.map