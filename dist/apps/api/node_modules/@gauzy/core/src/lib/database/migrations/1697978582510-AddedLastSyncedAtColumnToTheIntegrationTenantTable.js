"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddedLastSyncedAtColumnToTheIntegrationTenantTable1697978582510 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddedLastSyncedAtColumnToTheIntegrationTenantTable1697978582510 {
    constructor() {
        this.name = 'AddedLastSyncedAtColumnToTheIntegrationTenantTable1697978582510';
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
        await queryRunner.query(`ALTER TABLE "integration_tenant" ADD "lastSyncedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_d0532ed8020981736b58748de6" ON "integration_tenant" ("lastSyncedAt") `);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_d0532ed8020981736b58748de6"`);
        await queryRunner.query(`ALTER TABLE "integration_tenant" DROP COLUMN "lastSyncedAt"`);
    }
    /**
   * SqliteDB and BetterSQlite3DB Up Migration
   *
   * @param queryRunner
   */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_5487f9197c106d774bae20991c"`);
        await queryRunner.query(`DROP INDEX "IDX_c5ff5d3ab364b7da72bf3fbb46"`);
        await queryRunner.query(`DROP INDEX "IDX_33ab224e7755a46fff5bc1e64e"`);
        await queryRunner.query(`DROP INDEX "IDX_24e37d03ef224f1a16a35069c2"`);
        await queryRunner.query(`DROP INDEX "IDX_0d6ddc27d687ca879042c5f3ce"`);
        await queryRunner.query(`CREATE TABLE "temporary_integration_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "integrationId" varchar, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "lastSyncedAt" datetime DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_33ab224e7755a46fff5bc1e64e5" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_24e37d03ef224f1a16a35069c2c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_0d6ddc27d687ca879042c5f3ce3" FOREIGN KEY ("integrationId") REFERENCES "integration" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_integration_tenant"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "integrationId", "isActive", "isArchived") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "integrationId", "isActive", "isArchived" FROM "integration_tenant"`);
        await queryRunner.query(`DROP TABLE "integration_tenant"`);
        await queryRunner.query(`ALTER TABLE "temporary_integration_tenant" RENAME TO "integration_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_5487f9197c106d774bae20991c" ON "integration_tenant" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5ff5d3ab364b7da72bf3fbb46" ON "integration_tenant" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_33ab224e7755a46fff5bc1e64e" ON "integration_tenant" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24e37d03ef224f1a16a35069c2" ON "integration_tenant" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d6ddc27d687ca879042c5f3ce" ON "integration_tenant" ("integrationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d0532ed8020981736b58748de6" ON "integration_tenant" ("lastSyncedAt") `);
    }
    /**
    * SqliteDB and BetterSQlite3DB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_d0532ed8020981736b58748de6"`);
        await queryRunner.query(`DROP INDEX "IDX_0d6ddc27d687ca879042c5f3ce"`);
        await queryRunner.query(`DROP INDEX "IDX_24e37d03ef224f1a16a35069c2"`);
        await queryRunner.query(`DROP INDEX "IDX_33ab224e7755a46fff5bc1e64e"`);
        await queryRunner.query(`DROP INDEX "IDX_c5ff5d3ab364b7da72bf3fbb46"`);
        await queryRunner.query(`DROP INDEX "IDX_5487f9197c106d774bae20991c"`);
        await queryRunner.query(`ALTER TABLE "integration_tenant" RENAME TO "temporary_integration_tenant"`);
        await queryRunner.query(`CREATE TABLE "integration_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "integrationId" varchar, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), CONSTRAINT "FK_33ab224e7755a46fff5bc1e64e5" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_24e37d03ef224f1a16a35069c2c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_0d6ddc27d687ca879042c5f3ce3" FOREIGN KEY ("integrationId") REFERENCES "integration" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "integration_tenant"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "integrationId", "isActive", "isArchived") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "integrationId", "isActive", "isArchived" FROM "temporary_integration_tenant"`);
        await queryRunner.query(`DROP TABLE "temporary_integration_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_0d6ddc27d687ca879042c5f3ce" ON "integration_tenant" ("integrationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24e37d03ef224f1a16a35069c2" ON "integration_tenant" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_33ab224e7755a46fff5bc1e64e" ON "integration_tenant" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5ff5d3ab364b7da72bf3fbb46" ON "integration_tenant" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_5487f9197c106d774bae20991c" ON "integration_tenant" ("isArchived") `);
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
exports.AddedLastSyncedAtColumnToTheIntegrationTenantTable1697978582510 = AddedLastSyncedAtColumnToTheIntegrationTenantTable1697978582510;
//# sourceMappingURL=1697978582510-AddedLastSyncedAtColumnToTheIntegrationTenantTable.js.map