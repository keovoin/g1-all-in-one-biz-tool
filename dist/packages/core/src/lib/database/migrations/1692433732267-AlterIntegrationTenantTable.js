"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterIntegrationTenantTable1692433732267 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterIntegrationTenantTable1692433732267 {
    constructor() {
        this.name = 'AlterIntegrationTenantTable1692433732267';
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
        await queryRunner.query(`ALTER TABLE "integration_tenant" ADD "integrationId" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_0d6ddc27d687ca879042c5f3ce" ON "integration_tenant" ("integrationId") `);
        await queryRunner.query(`ALTER TABLE "integration_tenant" ADD CONSTRAINT "FK_0d6ddc27d687ca879042c5f3ce3" FOREIGN KEY ("integrationId") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "integration_tenant" DROP CONSTRAINT "FK_0d6ddc27d687ca879042c5f3ce3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d6ddc27d687ca879042c5f3ce"`);
        await queryRunner.query(`ALTER TABLE "integration_tenant" DROP COLUMN "integrationId"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_33ab224e7755a46fff5bc1e64e"`);
        await queryRunner.query(`DROP INDEX "IDX_24e37d03ef224f1a16a35069c2"`);
        await queryRunner.query(`CREATE TABLE "temporary_integration_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "integrationId" varchar, CONSTRAINT "FK_33ab224e7755a46fff5bc1e64e5" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_24e37d03ef224f1a16a35069c2c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_integration_tenant"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name" FROM "integration_tenant"`);
        await queryRunner.query(`DROP TABLE "integration_tenant"`);
        await queryRunner.query(`ALTER TABLE "temporary_integration_tenant" RENAME TO "integration_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_33ab224e7755a46fff5bc1e64e" ON "integration_tenant" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24e37d03ef224f1a16a35069c2" ON "integration_tenant" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d6ddc27d687ca879042c5f3ce" ON "integration_tenant" ("integrationId") `);
        await queryRunner.query(`DROP INDEX "IDX_33ab224e7755a46fff5bc1e64e"`);
        await queryRunner.query(`DROP INDEX "IDX_24e37d03ef224f1a16a35069c2"`);
        await queryRunner.query(`DROP INDEX "IDX_0d6ddc27d687ca879042c5f3ce"`);
        await queryRunner.query(`CREATE TABLE "temporary_integration_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "integrationId" varchar, CONSTRAINT "FK_33ab224e7755a46fff5bc1e64e5" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_24e37d03ef224f1a16a35069c2c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_0d6ddc27d687ca879042c5f3ce3" FOREIGN KEY ("integrationId") REFERENCES "integration" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_integration_tenant"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "integrationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "integrationId" FROM "integration_tenant"`);
        await queryRunner.query(`DROP TABLE "integration_tenant"`);
        await queryRunner.query(`ALTER TABLE "temporary_integration_tenant" RENAME TO "integration_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_33ab224e7755a46fff5bc1e64e" ON "integration_tenant" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24e37d03ef224f1a16a35069c2" ON "integration_tenant" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d6ddc27d687ca879042c5f3ce" ON "integration_tenant" ("integrationId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_0d6ddc27d687ca879042c5f3ce"`);
        await queryRunner.query(`DROP INDEX "IDX_24e37d03ef224f1a16a35069c2"`);
        await queryRunner.query(`DROP INDEX "IDX_33ab224e7755a46fff5bc1e64e"`);
        await queryRunner.query(`ALTER TABLE "integration_tenant" RENAME TO "temporary_integration_tenant"`);
        await queryRunner.query(`CREATE TABLE "integration_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "integrationId" varchar, CONSTRAINT "FK_33ab224e7755a46fff5bc1e64e5" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_24e37d03ef224f1a16a35069c2c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "integration_tenant"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "integrationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "integrationId" FROM "temporary_integration_tenant"`);
        await queryRunner.query(`DROP TABLE "temporary_integration_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_0d6ddc27d687ca879042c5f3ce" ON "integration_tenant" ("integrationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24e37d03ef224f1a16a35069c2" ON "integration_tenant" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_33ab224e7755a46fff5bc1e64e" ON "integration_tenant" ("organizationId") `);
        await queryRunner.query(`DROP INDEX "IDX_0d6ddc27d687ca879042c5f3ce"`);
        await queryRunner.query(`DROP INDEX "IDX_24e37d03ef224f1a16a35069c2"`);
        await queryRunner.query(`DROP INDEX "IDX_33ab224e7755a46fff5bc1e64e"`);
        await queryRunner.query(`ALTER TABLE "integration_tenant" RENAME TO "temporary_integration_tenant"`);
        await queryRunner.query(`CREATE TABLE "integration_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, CONSTRAINT "FK_33ab224e7755a46fff5bc1e64e5" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_24e37d03ef224f1a16a35069c2c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "integration_tenant"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name" FROM "temporary_integration_tenant"`);
        await queryRunner.query(`DROP TABLE "temporary_integration_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_24e37d03ef224f1a16a35069c2" ON "integration_tenant" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_33ab224e7755a46fff5bc1e64e" ON "integration_tenant" ("organizationId") `);
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
exports.AlterIntegrationTenantTable1692433732267 = AlterIntegrationTenantTable1692433732267;
//# sourceMappingURL=1692433732267-AlterIntegrationTenantTable.js.map