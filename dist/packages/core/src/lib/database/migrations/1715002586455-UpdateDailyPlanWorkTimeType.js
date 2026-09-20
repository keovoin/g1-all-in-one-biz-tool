"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDailyPlanWorkTimeType1715002586455 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class UpdateDailyPlanWorkTimeType1715002586455 {
    constructor() {
        this.name = 'UpdateDailyPlanWorkTimeType1715002586455';
    }
    /**
     * Up Migration
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
                throw Error(`Unsupported database: ${queryRunner.connection.options.type}`);
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
                throw Error(`Unsupported database: ${queryRunner.connection.options.type}`);
        }
    }
    /**
     * PostgresDB Up Migration
     *
     * @param queryRunner
     */
    async postgresUpQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "daily_plan" DROP COLUMN "workTimePlanned"`);
        await queryRunner.query(`ALTER TABLE "daily_plan" ADD "workTimePlanned" numeric NOT NULL`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "daily_plan" DROP COLUMN "workTimePlanned"`);
        await queryRunner.query(`ALTER TABLE "daily_plan" ADD "workTimePlanned" integer NOT NULL`);
    }
    /**
     * SqliteDB and BetterSQlite3DB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_903b08cd4c8025e73316342452"`);
        await queryRunner.query(`DROP INDEX "IDX_ce5e588780497b05cd6267e20e"`);
        await queryRunner.query(`DROP INDEX "IDX_ecb357a3764a7344c633a257d7"`);
        await queryRunner.query(`DROP INDEX "IDX_9779a35ef1338bafb7b90714f1"`);
        await queryRunner.query(`DROP INDEX "IDX_f2cf366f3f08e31784b056df88"`);
        await queryRunner.query(`CREATE TABLE "temporary_daily_plan" ("deletedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "tenantId" varchar, "organizationId" varchar, "date" datetime NOT NULL, "workTimePlanned" decimal NOT NULL, "status" varchar NOT NULL, "employeeId" varchar, CONSTRAINT "FK_ecb357a3764a7344c633a257d76" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_9779a35ef1338bafb7b90714f16" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_f2cf366f3f08e31784b056df880" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_daily_plan"("deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "tenantId", "organizationId", "date", "workTimePlanned", "status", "employeeId") SELECT "deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "tenantId", "organizationId", "date", "workTimePlanned", "status", "employeeId" FROM "daily_plan"`);
        await queryRunner.query(`DROP TABLE "daily_plan"`);
        await queryRunner.query(`ALTER TABLE "temporary_daily_plan" RENAME TO "daily_plan"`);
        await queryRunner.query(`CREATE INDEX "IDX_903b08cd4c8025e73316342452" ON "daily_plan" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce5e588780497b05cd6267e20e" ON "daily_plan" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_ecb357a3764a7344c633a257d7" ON "daily_plan" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9779a35ef1338bafb7b90714f1" ON "daily_plan" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2cf366f3f08e31784b056df88" ON "daily_plan" ("employeeId") `);
        await queryRunner.query(`CREATE TABLE "temporary_daily_plan" ("deletedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "tenantId" varchar, "organizationId" varchar, "date" datetime NOT NULL, "workTimePlanned" decimal NOT NULL, "status" varchar NOT NULL, "employeeId" varchar, CONSTRAINT "FK_ecb357a3764a7344c633a257d76" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_9779a35ef1338bafb7b90714f16" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_f2cf366f3f08e31784b056df880" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_daily_plan"("deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "tenantId", "organizationId", "date", "workTimePlanned", "status", "employeeId") SELECT "deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "tenantId", "organizationId", "date", "workTimePlanned", "status", "employeeId" FROM "daily_plan"`);
        await queryRunner.query(`DROP TABLE "daily_plan"`);
        await queryRunner.query(`ALTER TABLE "temporary_daily_plan" RENAME TO "daily_plan"`);
        await queryRunner.query(`CREATE INDEX "IDX_903b08cd4c8025e73316342452" ON "daily_plan" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce5e588780497b05cd6267e20e" ON "daily_plan" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_ecb357a3764a7344c633a257d7" ON "daily_plan" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9779a35ef1338bafb7b90714f1" ON "daily_plan" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2cf366f3f08e31784b056df88" ON "daily_plan" ("employeeId") `);
    }
    /**
     * SqliteDB and BetterSQlite3DB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_f2cf366f3f08e31784b056df88"`);
        await queryRunner.query(`DROP INDEX "IDX_9779a35ef1338bafb7b90714f1"`);
        await queryRunner.query(`DROP INDEX "IDX_ecb357a3764a7344c633a257d7"`);
        await queryRunner.query(`DROP INDEX "IDX_ce5e588780497b05cd6267e20e"`);
        await queryRunner.query(`DROP INDEX "IDX_903b08cd4c8025e73316342452"`);
        await queryRunner.query(`ALTER TABLE "daily_plan" RENAME TO "temporary_daily_plan"`);
        await queryRunner.query(`CREATE TABLE "daily_plan" ("deletedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "tenantId" varchar, "organizationId" varchar, "date" datetime NOT NULL, "workTimePlanned" integer NOT NULL, "status" varchar NOT NULL, "employeeId" varchar, CONSTRAINT "FK_ecb357a3764a7344c633a257d76" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_9779a35ef1338bafb7b90714f16" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_f2cf366f3f08e31784b056df880" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "daily_plan"("deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "tenantId", "organizationId", "date", "workTimePlanned", "status", "employeeId") SELECT "deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "tenantId", "organizationId", "date", "workTimePlanned", "status", "employeeId" FROM "temporary_daily_plan"`);
        await queryRunner.query(`DROP TABLE "temporary_daily_plan"`);
        await queryRunner.query(`CREATE INDEX "IDX_f2cf366f3f08e31784b056df88" ON "daily_plan" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9779a35ef1338bafb7b90714f1" ON "daily_plan" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ecb357a3764a7344c633a257d7" ON "daily_plan" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce5e588780497b05cd6267e20e" ON "daily_plan" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_903b08cd4c8025e73316342452" ON "daily_plan" ("isActive") `);
        await queryRunner.query(`DROP INDEX "IDX_01856a9a730b7e79d70aa661cb"`);
        await queryRunner.query(`DROP INDEX "IDX_d3675304df9971cccf96d9a7c3"`);
        await queryRunner.query(`DROP INDEX "IDX_9d44ce9eb8689e578b941a6a54"`);
        await queryRunner.query(`DROP INDEX "IDX_af1a212cb378bb0eed51c1b2bc"`);
        await queryRunner.query(`DROP INDEX "IDX_f2cf366f3f08e31784b056df88"`);
        await queryRunner.query(`DROP INDEX "IDX_9779a35ef1338bafb7b90714f1"`);
        await queryRunner.query(`DROP INDEX "IDX_ecb357a3764a7344c633a257d7"`);
        await queryRunner.query(`DROP INDEX "IDX_ce5e588780497b05cd6267e20e"`);
        await queryRunner.query(`DROP INDEX "IDX_903b08cd4c8025e73316342452"`);
        await queryRunner.query(`ALTER TABLE "daily_plan" RENAME TO "temporary_daily_plan"`);
        await queryRunner.query(`CREATE TABLE "daily_plan" ("deletedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "tenantId" varchar, "organizationId" varchar, "date" datetime NOT NULL, "workTimePlanned" integer NOT NULL, "status" varchar NOT NULL, "employeeId" varchar, CONSTRAINT "FK_ecb357a3764a7344c633a257d76" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_9779a35ef1338bafb7b90714f16" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_f2cf366f3f08e31784b056df880" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "daily_plan"("deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "tenantId", "organizationId", "date", "workTimePlanned", "status", "employeeId") SELECT "deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "tenantId", "organizationId", "date", "workTimePlanned", "status", "employeeId" FROM "temporary_daily_plan"`);
        await queryRunner.query(`DROP TABLE "temporary_daily_plan"`);
        await queryRunner.query(`CREATE INDEX "IDX_f2cf366f3f08e31784b056df88" ON "daily_plan" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9779a35ef1338bafb7b90714f1" ON "daily_plan" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ecb357a3764a7344c633a257d7" ON "daily_plan" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce5e588780497b05cd6267e20e" ON "daily_plan" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_903b08cd4c8025e73316342452" ON "daily_plan" ("isActive") `);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`daily_plan\` DROP COLUMN \`workTimePlanned\``);
        await queryRunner.query(`ALTER TABLE \`daily_plan\` ADD \`workTimePlanned\` decimal NOT NULL`);
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`daily_plan\` DROP COLUMN \`workTimePlanned\``);
        await queryRunner.query(`ALTER TABLE \`daily_plan\` ADD \`workTimePlanned\` int NOT NULL`);
    }
}
exports.UpdateDailyPlanWorkTimeType1715002586455 = UpdateDailyPlanWorkTimeType1715002586455;
//# sourceMappingURL=1715002586455-UpdateDailyPlanWorkTimeType.js.map