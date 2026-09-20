"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddColumnsToTheIntegrationTable1695023907817 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddColumnsToTheIntegrationTable1695023907817 {
    constructor() {
        this.name = 'AddColumnsToTheIntegrationTable1695023907817';
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
        await queryRunner.query(`ALTER TABLE "integration" RENAME COLUMN "navigationUrl" TO "redirectUrl"`);
        await queryRunner.query(`ALTER TABLE "integration" ADD "provider" character varying`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "integration" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "integration" RENAME COLUMN "redirectUrl" TO "navigationUrl"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_integration" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "imgSrc" varchar, "isComingSoon" boolean NOT NULL DEFAULT (0), "isPaid" boolean NOT NULL DEFAULT (0), "version" varchar, "docUrl" varchar, "isFreeTrial" boolean NOT NULL DEFAULT (0), "freeTrialPeriod" numeric DEFAULT (0), "order" integer, CONSTRAINT "UQ_938c19d92ad3f290ff5fc163531" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_integration"("id", "createdAt", "updatedAt", "name", "imgSrc", "isComingSoon", "isPaid", "version", "docUrl", "isFreeTrial", "freeTrialPeriod", "order") SELECT "id", "createdAt", "updatedAt", "name", "imgSrc", "isComingSoon", "isPaid", "version", "docUrl", "isFreeTrial", "freeTrialPeriod", "order" FROM "integration"`);
        await queryRunner.query(`DROP TABLE "integration"`);
        await queryRunner.query(`ALTER TABLE "temporary_integration" RENAME TO "integration"`);
        await queryRunner.query(`CREATE TABLE "temporary_integration" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "imgSrc" varchar, "isComingSoon" boolean NOT NULL DEFAULT (0), "isPaid" boolean NOT NULL DEFAULT (0), "version" varchar, "docUrl" varchar, "isFreeTrial" boolean NOT NULL DEFAULT (0), "freeTrialPeriod" numeric DEFAULT (0), "order" integer, "provider" varchar, "redirectUrl" varchar, CONSTRAINT "UQ_938c19d92ad3f290ff5fc163531" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_integration"("id", "createdAt", "updatedAt", "name", "imgSrc", "isComingSoon", "isPaid", "version", "docUrl", "isFreeTrial", "freeTrialPeriod", "order") SELECT "id", "createdAt", "updatedAt", "name", "imgSrc", "isComingSoon", "isPaid", "version", "docUrl", "isFreeTrial", "freeTrialPeriod", "order" FROM "integration"`);
        await queryRunner.query(`DROP TABLE "integration"`);
        await queryRunner.query(`ALTER TABLE "temporary_integration" RENAME TO "integration"`);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "integration" RENAME TO "temporary_integration"`);
        await queryRunner.query(`CREATE TABLE "integration" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "imgSrc" varchar, "isComingSoon" boolean NOT NULL DEFAULT (0), "isPaid" boolean NOT NULL DEFAULT (0), "version" varchar, "docUrl" varchar, "isFreeTrial" boolean NOT NULL DEFAULT (0), "freeTrialPeriod" numeric DEFAULT (0), "order" integer, CONSTRAINT "UQ_938c19d92ad3f290ff5fc163531" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "integration"("id", "createdAt", "updatedAt", "name", "imgSrc", "isComingSoon", "isPaid", "version", "docUrl", "isFreeTrial", "freeTrialPeriod", "order") SELECT "id", "createdAt", "updatedAt", "name", "imgSrc", "isComingSoon", "isPaid", "version", "docUrl", "isFreeTrial", "freeTrialPeriod", "order" FROM "temporary_integration"`);
        await queryRunner.query(`DROP TABLE "temporary_integration"`);
        await queryRunner.query(`ALTER TABLE "integration" RENAME TO "temporary_integration"`);
        await queryRunner.query(`CREATE TABLE "integration" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "imgSrc" varchar, "isComingSoon" boolean NOT NULL DEFAULT (0), "isPaid" boolean NOT NULL DEFAULT (0), "version" varchar, "docUrl" varchar, "isFreeTrial" boolean NOT NULL DEFAULT (0), "freeTrialPeriod" numeric DEFAULT (0), "order" integer, "navigationUrl" varchar, CONSTRAINT "UQ_938c19d92ad3f290ff5fc163531" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "integration"("id", "createdAt", "updatedAt", "name", "imgSrc", "isComingSoon", "isPaid", "version", "docUrl", "isFreeTrial", "freeTrialPeriod", "order") SELECT "id", "createdAt", "updatedAt", "name", "imgSrc", "isComingSoon", "isPaid", "version", "docUrl", "isFreeTrial", "freeTrialPeriod", "order" FROM "temporary_integration"`);
        await queryRunner.query(`DROP TABLE "temporary_integration"`);
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
exports.AddColumnsToTheIntegrationTable1695023907817 = AddColumnsToTheIntegrationTable1695023907817;
//# sourceMappingURL=1695023907817-AddColumnsToTheIntegrationTable.js.map