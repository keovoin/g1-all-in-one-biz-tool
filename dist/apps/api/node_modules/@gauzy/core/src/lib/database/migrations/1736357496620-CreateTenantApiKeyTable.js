"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTenantApiKeyTable1736357496620 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class CreateTenantApiKeyTable1736357496620 {
    constructor() {
        this.name = 'CreateTenantApiKeyTable1736357496620';
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
        await queryRunner.query(`CREATE TABLE "tenant_api_key" ("deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT gen_random_uuid(), "isActive" boolean DEFAULT true, "isArchived" boolean DEFAULT false, "archivedAt" TIMESTAMP, "tenantId" uuid, "name" character varying, "apiKey" character varying NOT NULL, "apiSecret" text NOT NULL, CONSTRAINT "PK_83032288ad7173ddc31dc5a0c34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_686a4464635f3dbb77411dd5e8" ON "tenant_api_key" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_21056fa2d8b060d3049f50ec0b" ON "tenant_api_key" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_df44cc2b5ba1a4cc95850eea7c" ON "tenant_api_key" ("tenantId") `);
        await queryRunner.query(`ALTER TABLE "tenant_api_key" ADD CONSTRAINT "FK_df44cc2b5ba1a4cc95850eea7c2" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tenant_api_key" DROP CONSTRAINT "FK_df44cc2b5ba1a4cc95850eea7c2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df44cc2b5ba1a4cc95850eea7c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21056fa2d8b060d3049f50ec0b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_686a4464635f3dbb77411dd5e8"`);
        await queryRunner.query(`DROP TABLE "tenant_api_key"`);
    }
    /**
    * SqliteDB and BetterSQlite3DB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "tenant_api_key" ("deletedAt" datetime, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" varchar PRIMARY KEY NOT NULL, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "archivedAt" datetime, "tenantId" varchar, "name" varchar, "apiKey" varchar NOT NULL, "apiSecret" text NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_686a4464635f3dbb77411dd5e8" ON "tenant_api_key" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_21056fa2d8b060d3049f50ec0b" ON "tenant_api_key" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_df44cc2b5ba1a4cc95850eea7c" ON "tenant_api_key" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_686a4464635f3dbb77411dd5e8"`);
        await queryRunner.query(`DROP INDEX "IDX_21056fa2d8b060d3049f50ec0b"`);
        await queryRunner.query(`DROP INDEX "IDX_df44cc2b5ba1a4cc95850eea7c"`);
        await queryRunner.query(`CREATE TABLE "temporary_tenant_api_key" ("deletedAt" datetime, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" varchar PRIMARY KEY NOT NULL, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "archivedAt" datetime, "tenantId" varchar, "name" varchar, "apiKey" varchar NOT NULL, "apiSecret" text NOT NULL, CONSTRAINT "FK_df44cc2b5ba1a4cc95850eea7c2" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tenant_api_key"("deletedAt", "createdAt", "updatedAt", "id", "isActive", "isArchived", "archivedAt", "tenantId", "name", "apiKey", "apiSecret") SELECT "deletedAt", "createdAt", "updatedAt", "id", "isActive", "isArchived", "archivedAt", "tenantId", "name", "apiKey", "apiSecret" FROM "tenant_api_key"`);
        await queryRunner.query(`DROP TABLE "tenant_api_key"`);
        await queryRunner.query(`ALTER TABLE "temporary_tenant_api_key" RENAME TO "tenant_api_key"`);
        await queryRunner.query(`CREATE INDEX "IDX_686a4464635f3dbb77411dd5e8" ON "tenant_api_key" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_21056fa2d8b060d3049f50ec0b" ON "tenant_api_key" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_df44cc2b5ba1a4cc95850eea7c" ON "tenant_api_key" ("tenantId") `);
    }
    /**
    * SqliteDB and BetterSQlite3DB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_df44cc2b5ba1a4cc95850eea7c"`);
        await queryRunner.query(`DROP INDEX "IDX_21056fa2d8b060d3049f50ec0b"`);
        await queryRunner.query(`DROP INDEX "IDX_686a4464635f3dbb77411dd5e8"`);
        await queryRunner.query(`ALTER TABLE "tenant_api_key" RENAME TO "temporary_tenant_api_key"`);
        await queryRunner.query(`CREATE TABLE "tenant_api_key" ("deletedAt" datetime, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" varchar PRIMARY KEY NOT NULL, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "archivedAt" datetime, "tenantId" varchar, "name" varchar, "apiKey" varchar NOT NULL, "apiSecret" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "tenant_api_key"("deletedAt", "createdAt", "updatedAt", "id", "isActive", "isArchived", "archivedAt", "tenantId", "name", "apiKey", "apiSecret") SELECT "deletedAt", "createdAt", "updatedAt", "id", "isActive", "isArchived", "archivedAt", "tenantId", "name", "apiKey", "apiSecret" FROM "temporary_tenant_api_key"`);
        await queryRunner.query(`DROP TABLE "temporary_tenant_api_key"`);
        await queryRunner.query(`CREATE INDEX "IDX_df44cc2b5ba1a4cc95850eea7c" ON "tenant_api_key" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_21056fa2d8b060d3049f50ec0b" ON "tenant_api_key" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_686a4464635f3dbb77411dd5e8" ON "tenant_api_key" ("isActive") `);
        await queryRunner.query(`DROP INDEX "IDX_df44cc2b5ba1a4cc95850eea7c"`);
        await queryRunner.query(`DROP INDEX "IDX_21056fa2d8b060d3049f50ec0b"`);
        await queryRunner.query(`DROP INDEX "IDX_686a4464635f3dbb77411dd5e8"`);
        await queryRunner.query(`DROP TABLE "tenant_api_key"`);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`tenant_api_key\` (\`deletedAt\` datetime(6) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`isActive\` tinyint NULL DEFAULT 1, \`isArchived\` tinyint NULL DEFAULT 0, \`archivedAt\` datetime NULL, \`tenantId\` varchar(255) NULL, \`name\` varchar(255) NULL, \`apiKey\` varchar(255) NOT NULL, \`apiSecret\` text NOT NULL, INDEX \`IDX_686a4464635f3dbb77411dd5e8\` (\`isActive\`), INDEX \`IDX_21056fa2d8b060d3049f50ec0b\` (\`isArchived\`), INDEX \`IDX_df44cc2b5ba1a4cc95850eea7c\` (\`tenantId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tenant_api_key\` ADD CONSTRAINT \`FK_df44cc2b5ba1a4cc95850eea7c2\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`tenant_api_key\` DROP FOREIGN KEY \`FK_df44cc2b5ba1a4cc95850eea7c2\``);
        await queryRunner.query(`DROP INDEX \`IDX_df44cc2b5ba1a4cc95850eea7c\` ON \`tenant_api_key\``);
        await queryRunner.query(`DROP INDEX \`IDX_21056fa2d8b060d3049f50ec0b\` ON \`tenant_api_key\``);
        await queryRunner.query(`DROP INDEX \`IDX_686a4464635f3dbb77411dd5e8\` ON \`tenant_api_key\``);
        await queryRunner.query(`DROP TABLE \`tenant_api_key\``);
    }
}
exports.CreateTenantApiKeyTable1736357496620 = CreateTenantApiKeyTable1736357496620;
//# sourceMappingURL=1736357496620-CreateTenantApiKeyTable.js.map