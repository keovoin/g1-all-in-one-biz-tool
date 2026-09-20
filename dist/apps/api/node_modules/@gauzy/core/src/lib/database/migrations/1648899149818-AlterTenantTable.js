"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterTenantTable1648899149818 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterTenantTable1648899149818 {
    constructor() {
        this.name = 'AlterTenantTable1648899149818';
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
        await queryRunner.query(`ALTER TABLE "tenant" ADD "logo" character varying`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "logo"`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_56211336b5ff35fd944f225917"`);
        await queryRunner.query(`CREATE TABLE "temporary_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "logo" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_tenant"("id", "createdAt", "updatedAt", "name") SELECT "id", "createdAt", "updatedAt", "name" FROM "tenant"`);
        await queryRunner.query(`DROP TABLE "tenant"`);
        await queryRunner.query(`ALTER TABLE "temporary_tenant" RENAME TO "tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_56211336b5ff35fd944f225917" ON "tenant" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_3062637d94040b8a277c5e6367" ON "tenant" ("logo") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_3062637d94040b8a277c5e6367"`);
        await queryRunner.query(`DROP INDEX "IDX_60468af1ce34043a900809c84f"`);
        await queryRunner.query(`ALTER TABLE "tenant" RENAME TO "temporary_tenant"`);
        await queryRunner.query(`CREATE TABLE "tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "tenant"("id", "createdAt", "updatedAt", "name") SELECT "id", "createdAt", "updatedAt", "name" FROM "temporary_tenant"`);
        await queryRunner.query(`DROP TABLE "temporary_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_56211336b5ff35fd944f225917" ON "tenant" ("name") `);
    }
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
exports.AlterTenantTable1648899149818 = AlterTenantTable1648899149818;
//# sourceMappingURL=1648899149818-AlterTenantTable.js.map