"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskEstimationTable1689670799675 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class CreateTaskEstimationTable1689670799675 {
    constructor() {
        this.name = 'CreateTaskEstimationTable1689670799675';
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
        await queryRunner.query(`CREATE TABLE "task_estimation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid, "organizationId" uuid, "estimate" integer NOT NULL, "employeeId" uuid NOT NULL, "taskId" uuid NOT NULL, CONSTRAINT "PK_66744e711a8663030cbe16e2799" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87bfea6d0b9a1ec602ee88e5f6" ON "task_estimation" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16507eb222e3c50be077fb4ace" ON "task_estimation" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f274646f2bdf4e12990feeb04" ON "task_estimation" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a3ee022203211f678376cd919b" ON "task_estimation" ("taskId") `);
        await queryRunner.query(`ALTER TABLE "task_estimation" ADD CONSTRAINT "FK_87bfea6d0b9a1ec602ee88e5f68" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_estimation" ADD CONSTRAINT "FK_16507eb222e3c50be077fb4ace2" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_estimation" ADD CONSTRAINT "FK_8f274646f2bdf4e12990feeb040" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_estimation" ADD CONSTRAINT "FK_a3ee022203211f678376cd919bb" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "task_estimation" DROP CONSTRAINT "FK_a3ee022203211f678376cd919bb"`);
        await queryRunner.query(`ALTER TABLE "task_estimation" DROP CONSTRAINT "FK_8f274646f2bdf4e12990feeb040"`);
        await queryRunner.query(`ALTER TABLE "task_estimation" DROP CONSTRAINT "FK_16507eb222e3c50be077fb4ace2"`);
        await queryRunner.query(`ALTER TABLE "task_estimation" DROP CONSTRAINT "FK_87bfea6d0b9a1ec602ee88e5f68"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3ee022203211f678376cd919b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f274646f2bdf4e12990feeb04"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16507eb222e3c50be077fb4ace"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87bfea6d0b9a1ec602ee88e5f6"`);
        await queryRunner.query(`DROP TABLE "task_estimation"`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "task_estimation" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "estimate" integer NOT NULL, "employeeId" varchar NOT NULL, "taskId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_87bfea6d0b9a1ec602ee88e5f6" ON "task_estimation" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16507eb222e3c50be077fb4ace" ON "task_estimation" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f274646f2bdf4e12990feeb04" ON "task_estimation" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a3ee022203211f678376cd919b" ON "task_estimation" ("taskId") `);
        await queryRunner.query(`DROP INDEX "IDX_87bfea6d0b9a1ec602ee88e5f6"`);
        await queryRunner.query(`DROP INDEX "IDX_16507eb222e3c50be077fb4ace"`);
        await queryRunner.query(`DROP INDEX "IDX_8f274646f2bdf4e12990feeb04"`);
        await queryRunner.query(`DROP INDEX "IDX_a3ee022203211f678376cd919b"`);
        await queryRunner.query(`CREATE TABLE "temporary_task_estimation" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "estimate" integer NOT NULL, "employeeId" varchar NOT NULL, "taskId" varchar NOT NULL, CONSTRAINT "FK_87bfea6d0b9a1ec602ee88e5f68" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_16507eb222e3c50be077fb4ace2" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_8f274646f2bdf4e12990feeb040" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a3ee022203211f678376cd919bb" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task_estimation"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "estimate", "employeeId", "taskId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "estimate", "employeeId", "taskId" FROM "task_estimation"`);
        await queryRunner.query(`DROP TABLE "task_estimation"`);
        await queryRunner.query(`ALTER TABLE "temporary_task_estimation" RENAME TO "task_estimation"`);
        await queryRunner.query(`CREATE INDEX "IDX_87bfea6d0b9a1ec602ee88e5f6" ON "task_estimation" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16507eb222e3c50be077fb4ace" ON "task_estimation" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f274646f2bdf4e12990feeb04" ON "task_estimation" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a3ee022203211f678376cd919b" ON "task_estimation" ("taskId") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_a3ee022203211f678376cd919b"`);
        await queryRunner.query(`DROP INDEX "IDX_8f274646f2bdf4e12990feeb04"`);
        await queryRunner.query(`DROP INDEX "IDX_16507eb222e3c50be077fb4ace"`);
        await queryRunner.query(`DROP INDEX "IDX_87bfea6d0b9a1ec602ee88e5f6"`);
        await queryRunner.query(`ALTER TABLE "task_estimation" RENAME TO "temporary_task_estimation"`);
        await queryRunner.query(`CREATE TABLE "task_estimation" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "estimate" integer NOT NULL, "employeeId" varchar NOT NULL, "taskId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "task_estimation"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "estimate", "employeeId", "taskId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "estimate", "employeeId", "taskId" FROM "temporary_task_estimation"`);
        await queryRunner.query(`DROP TABLE "temporary_task_estimation"`);
        await queryRunner.query(`CREATE INDEX "IDX_a3ee022203211f678376cd919b" ON "task_estimation" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f274646f2bdf4e12990feeb04" ON "task_estimation" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16507eb222e3c50be077fb4ace" ON "task_estimation" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_87bfea6d0b9a1ec602ee88e5f6" ON "task_estimation" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_a3ee022203211f678376cd919b"`);
        await queryRunner.query(`DROP INDEX "IDX_8f274646f2bdf4e12990feeb04"`);
        await queryRunner.query(`DROP INDEX "IDX_16507eb222e3c50be077fb4ace"`);
        await queryRunner.query(`DROP INDEX "IDX_87bfea6d0b9a1ec602ee88e5f6"`);
        await queryRunner.query(`DROP TABLE "task_estimation"`);
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
exports.CreateTaskEstimationTable1689670799675 = CreateTaskEstimationTable1689670799675;
//# sourceMappingURL=1689670799675-CreateTaskEstimationTable.js.map