"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterPasswordResetTable1699353179526 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterPasswordResetTable1699353179526 {
    constructor() {
        this.name = 'AlterPasswordResetTable1699353179526';
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
        await queryRunner.query(`ALTER TABLE "password_reset" ADD "tenantId" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_1fa632f2d12a06ef8dcc00858f" ON "password_reset" ("tenantId") `);
        await queryRunner.query(`ALTER TABLE "password_reset" ADD CONSTRAINT "FK_1fa632f2d12a06ef8dcc00858ff" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "password_reset" DROP CONSTRAINT "FK_1fa632f2d12a06ef8dcc00858ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fa632f2d12a06ef8dcc00858f"`);
        await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "tenantId"`);
    }
    /**
    * SqliteDB and BetterSQlite3DB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_36e929b98372d961bb63bd4b4e"`);
        await queryRunner.query(`DROP INDEX "IDX_1c88db6e50f0704688d1f1978c"`);
        await queryRunner.query(`DROP INDEX "IDX_380c03025a41ad032191f1ef2d"`);
        await queryRunner.query(`DROP INDEX "IDX_e71a736d52820b568f6b0ca203"`);
        await queryRunner.query(`CREATE TABLE "temporary_password_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "token" varchar NOT NULL, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "deletedAt" datetime, "tenantId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_password_reset"("id", "createdAt", "updatedAt", "email", "token", "isActive", "isArchived", "deletedAt") SELECT "id", "createdAt", "updatedAt", "email", "token", "isActive", "isArchived", "deletedAt" FROM "password_reset"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
        await queryRunner.query(`ALTER TABLE "temporary_password_reset" RENAME TO "password_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_36e929b98372d961bb63bd4b4e" ON "password_reset" ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c88db6e50f0704688d1f1978c" ON "password_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_380c03025a41ad032191f1ef2d" ON "password_reset" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_e71a736d52820b568f6b0ca203" ON "password_reset" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_1fa632f2d12a06ef8dcc00858f" ON "password_reset" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_36e929b98372d961bb63bd4b4e"`);
        await queryRunner.query(`DROP INDEX "IDX_1c88db6e50f0704688d1f1978c"`);
        await queryRunner.query(`DROP INDEX "IDX_380c03025a41ad032191f1ef2d"`);
        await queryRunner.query(`DROP INDEX "IDX_e71a736d52820b568f6b0ca203"`);
        await queryRunner.query(`DROP INDEX "IDX_1fa632f2d12a06ef8dcc00858f"`);
        await queryRunner.query(`CREATE TABLE "temporary_password_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "token" varchar NOT NULL, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "deletedAt" datetime, "tenantId" varchar, CONSTRAINT "FK_1fa632f2d12a06ef8dcc00858ff" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_password_reset"("id", "createdAt", "updatedAt", "email", "token", "isActive", "isArchived", "deletedAt", "tenantId") SELECT "id", "createdAt", "updatedAt", "email", "token", "isActive", "isArchived", "deletedAt", "tenantId" FROM "password_reset"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
        await queryRunner.query(`ALTER TABLE "temporary_password_reset" RENAME TO "password_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_36e929b98372d961bb63bd4b4e" ON "password_reset" ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c88db6e50f0704688d1f1978c" ON "password_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_380c03025a41ad032191f1ef2d" ON "password_reset" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_e71a736d52820b568f6b0ca203" ON "password_reset" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_1fa632f2d12a06ef8dcc00858f" ON "password_reset" ("tenantId") `);
    }
    /**
    * SqliteDB and BetterSQlite3DB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_1fa632f2d12a06ef8dcc00858f"`);
        await queryRunner.query(`DROP INDEX "IDX_e71a736d52820b568f6b0ca203"`);
        await queryRunner.query(`DROP INDEX "IDX_380c03025a41ad032191f1ef2d"`);
        await queryRunner.query(`DROP INDEX "IDX_1c88db6e50f0704688d1f1978c"`);
        await queryRunner.query(`DROP INDEX "IDX_36e929b98372d961bb63bd4b4e"`);
        await queryRunner.query(`ALTER TABLE "password_reset" RENAME TO "temporary_password_reset"`);
        await queryRunner.query(`CREATE TABLE "password_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "token" varchar NOT NULL, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "deletedAt" datetime, "tenantId" varchar)`);
        await queryRunner.query(`INSERT INTO "password_reset"("id", "createdAt", "updatedAt", "email", "token", "isActive", "isArchived", "deletedAt", "tenantId") SELECT "id", "createdAt", "updatedAt", "email", "token", "isActive", "isArchived", "deletedAt", "tenantId" FROM "temporary_password_reset"`);
        await queryRunner.query(`DROP TABLE "temporary_password_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_1fa632f2d12a06ef8dcc00858f" ON "password_reset" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e71a736d52820b568f6b0ca203" ON "password_reset" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_380c03025a41ad032191f1ef2d" ON "password_reset" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c88db6e50f0704688d1f1978c" ON "password_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_36e929b98372d961bb63bd4b4e" ON "password_reset" ("token") `);
        await queryRunner.query(`DROP INDEX "IDX_1fa632f2d12a06ef8dcc00858f"`);
        await queryRunner.query(`DROP INDEX "IDX_e71a736d52820b568f6b0ca203"`);
        await queryRunner.query(`DROP INDEX "IDX_380c03025a41ad032191f1ef2d"`);
        await queryRunner.query(`DROP INDEX "IDX_1c88db6e50f0704688d1f1978c"`);
        await queryRunner.query(`DROP INDEX "IDX_36e929b98372d961bb63bd4b4e"`);
        await queryRunner.query(`ALTER TABLE "password_reset" RENAME TO "temporary_password_reset"`);
        await queryRunner.query(`CREATE TABLE "password_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "token" varchar NOT NULL, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "deletedAt" datetime)`);
        await queryRunner.query(`INSERT INTO "password_reset"("id", "createdAt", "updatedAt", "email", "token", "isActive", "isArchived", "deletedAt") SELECT "id", "createdAt", "updatedAt", "email", "token", "isActive", "isArchived", "deletedAt" FROM "temporary_password_reset"`);
        await queryRunner.query(`DROP TABLE "temporary_password_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_e71a736d52820b568f6b0ca203" ON "password_reset" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_380c03025a41ad032191f1ef2d" ON "password_reset" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c88db6e50f0704688d1f1978c" ON "password_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_36e929b98372d961bb63bd4b4e" ON "password_reset" ("token") `);
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
exports.AlterPasswordResetTable1699353179526 = AlterPasswordResetTable1699353179526;
//# sourceMappingURL=1699353179526-AlterPasswordResetTable.js.map