"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddColumnsToTheIntegrationTypeTable1695111838783 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddColumnsToTheIntegrationTypeTable1695111838783 {
    constructor() {
        this.name = 'AddColumnsToTheIntegrationTypeTable1695111838783';
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
        await queryRunner.query(`ALTER TABLE "integration_type" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "integration_type" ADD "icon" character varying`);
        await queryRunner.query(`ALTER TABLE "integration_type" ADD CONSTRAINT "UQ_83443d669822bbbf2bd0ebdacd7" UNIQUE ("name")`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "integration_type" DROP CONSTRAINT "UQ_83443d669822bbbf2bd0ebdacd7"`);
        await queryRunner.query(`ALTER TABLE "integration_type" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "integration_type" DROP COLUMN "description"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_integration_type" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "groupName" varchar NOT NULL, "order" integer NOT NULL, "description" varchar, "icon" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_integration_type"("id", "createdAt", "updatedAt", "name", "groupName", "order") SELECT "id", "createdAt", "updatedAt", "name", "groupName", "order" FROM "integration_type"`);
        await queryRunner.query(`DROP TABLE "integration_type"`);
        await queryRunner.query(`ALTER TABLE "temporary_integration_type" RENAME TO "integration_type"`);
        await queryRunner.query(`CREATE TABLE "temporary_integration_type" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "groupName" varchar NOT NULL, "order" integer NOT NULL, "description" varchar, "icon" varchar, CONSTRAINT "UQ_be0d67f4df84f036fab2ed89c47" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_integration_type"("id", "createdAt", "updatedAt", "name", "groupName", "order", "description", "icon") SELECT "id", "createdAt", "updatedAt", "name", "groupName", "order", "description", "icon" FROM "integration_type"`);
        await queryRunner.query(`DROP TABLE "integration_type"`);
        await queryRunner.query(`ALTER TABLE "temporary_integration_type" RENAME TO "integration_type"`);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "integration_type" RENAME TO "temporary_integration_type"`);
        await queryRunner.query(`CREATE TABLE "integration_type" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "groupName" varchar NOT NULL, "order" integer NOT NULL, "description" varchar, "icon" varchar)`);
        await queryRunner.query(`INSERT INTO "integration_type"("id", "createdAt", "updatedAt", "name", "groupName", "order", "description", "icon") SELECT "id", "createdAt", "updatedAt", "name", "groupName", "order", "description", "icon" FROM "temporary_integration_type"`);
        await queryRunner.query(`DROP TABLE "temporary_integration_type"`);
        await queryRunner.query(`ALTER TABLE "integration_type" RENAME TO "temporary_integration_type"`);
        await queryRunner.query(`CREATE TABLE "integration_type" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "groupName" varchar NOT NULL, "order" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "integration_type"("id", "createdAt", "updatedAt", "name", "groupName", "order") SELECT "id", "createdAt", "updatedAt", "name", "groupName", "order" FROM "temporary_integration_type"`);
        await queryRunner.query(`DROP TABLE "temporary_integration_type"`);
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
exports.AddColumnsToTheIntegrationTypeTable1695111838783 = AddColumnsToTheIntegrationTypeTable1695111838783;
//# sourceMappingURL=1695111838783-AddColumnsToTheIntegrationTypeTable.js.map