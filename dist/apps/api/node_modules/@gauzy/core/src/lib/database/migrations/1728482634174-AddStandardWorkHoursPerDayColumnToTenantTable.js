"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStandardWorkHoursPerDayColumnToTenantTable1728482634174 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddStandardWorkHoursPerDayColumnToTenantTable1728482634174 {
    constructor() {
        this.name = 'AddStandardWorkHoursPerDayColumnToTenantTable1728482634174';
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
        await queryRunner.query(`ALTER TABLE "tenant" ADD "standardWorkHoursPerDay" integer DEFAULT '8'`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "standardWorkHoursPerDay"`);
    }
    /**
     * SqliteDB and BetterSQlite3DB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_eeedffab85b3534a1068d9270f"`);
        await queryRunner.query(`DROP INDEX "IDX_b8eb9f3e420aa846f30e291960"`);
        await queryRunner.query(`DROP INDEX "IDX_56211336b5ff35fd944f225917"`);
        await queryRunner.query(`DROP INDEX "IDX_d154d06dac0d0e0a5d9a083e25"`);
        await queryRunner.query(`CREATE TABLE "temporary_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "logo" varchar, "imageId" varchar, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "deletedAt" datetime, "archivedAt" datetime, "standardWorkHoursPerDay" integer DEFAULT (8), CONSTRAINT "FK_d154d06dac0d0e0a5d9a083e253" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tenant"("id", "createdAt", "updatedAt", "name", "logo", "imageId", "isActive", "isArchived", "deletedAt", "archivedAt") SELECT "id", "createdAt", "updatedAt", "name", "logo", "imageId", "isActive", "isArchived", "deletedAt", "archivedAt" FROM "tenant"`);
        await queryRunner.query(`DROP TABLE "tenant"`);
        await queryRunner.query(`ALTER TABLE "temporary_tenant" RENAME TO "tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_eeedffab85b3534a1068d9270f" ON "tenant" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8eb9f3e420aa846f30e291960" ON "tenant" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_56211336b5ff35fd944f225917" ON "tenant" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_d154d06dac0d0e0a5d9a083e25" ON "tenant" ("imageId") `);
    }
    /**
     * SqliteDB and BetterSQlite3DB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_d154d06dac0d0e0a5d9a083e25"`);
        await queryRunner.query(`DROP INDEX "IDX_56211336b5ff35fd944f225917"`);
        await queryRunner.query(`DROP INDEX "IDX_b8eb9f3e420aa846f30e291960"`);
        await queryRunner.query(`DROP INDEX "IDX_eeedffab85b3534a1068d9270f"`);
        await queryRunner.query(`ALTER TABLE "tenant" RENAME TO "temporary_tenant"`);
        await queryRunner.query(`CREATE TABLE "tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "logo" varchar, "imageId" varchar, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "deletedAt" datetime, "archivedAt" datetime, CONSTRAINT "FK_d154d06dac0d0e0a5d9a083e253" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "tenant"("id", "createdAt", "updatedAt", "name", "logo", "imageId", "isActive", "isArchived", "deletedAt", "archivedAt") SELECT "id", "createdAt", "updatedAt", "name", "logo", "imageId", "isActive", "isArchived", "deletedAt", "archivedAt" FROM "temporary_tenant"`);
        await queryRunner.query(`DROP TABLE "temporary_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_d154d06dac0d0e0a5d9a083e25" ON "tenant" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_56211336b5ff35fd944f225917" ON "tenant" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8eb9f3e420aa846f30e291960" ON "tenant" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_eeedffab85b3534a1068d9270f" ON "tenant" ("isArchived") `);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`tenant\` ADD \`standardWorkHoursPerDay\` int NULL DEFAULT '8'`);
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`tenant\` DROP COLUMN \`standardWorkHoursPerDay\``);
    }
}
exports.AddStandardWorkHoursPerDayColumnToTenantTable1728482634174 = AddStandardWorkHoursPerDayColumnToTenantTable1728482634174;
//# sourceMappingURL=1728482634174-AddStandardWorkHoursPerDayColumnToTenantTable.js.map