"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDashboardTable1734955984574 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class CreateDashboardTable1734955984574 {
    constructor() {
        this.name = 'CreateDashboardTable1734955984574';
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
        await queryRunner.query(`CREATE TABLE "dashboard" ("deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean DEFAULT true, "isArchived" boolean DEFAULT false, "archivedAt" TIMESTAMP, "tenantId" uuid, "organizationId" uuid, "name" character varying NOT NULL, "identifier" character varying NOT NULL, "description" text, "contentHtml" jsonb, "isDefault" boolean NOT NULL DEFAULT false, "creatorId" uuid NOT NULL, CONSTRAINT "PK_233ed28fa3a1f9fbe743f571f75" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d988d1036760b5841e9e9f5509" ON "dashboard" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0dec9fe24b4c3731c6b30a1ba" ON "dashboard" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_c35744fa39ab7f9326a0b07a81" ON "dashboard" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_458f459afdb1dbb19c5d80c276" ON "dashboard" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d343751cf98e2bfd85754a35a1" ON "dashboard" ("creatorId") `);
        await queryRunner.query(`ALTER TABLE "dashboard" ADD CONSTRAINT "FK_c35744fa39ab7f9326a0b07a812" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dashboard" ADD CONSTRAINT "FK_458f459afdb1dbb19c5d80c2767" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dashboard" ADD CONSTRAINT "FK_d343751cf98e2bfd85754a35a12" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "dashboard" DROP CONSTRAINT "FK_d343751cf98e2bfd85754a35a12"`);
        await queryRunner.query(`ALTER TABLE "dashboard" DROP CONSTRAINT "FK_458f459afdb1dbb19c5d80c2767"`);
        await queryRunner.query(`ALTER TABLE "dashboard" DROP CONSTRAINT "FK_c35744fa39ab7f9326a0b07a812"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d343751cf98e2bfd85754a35a1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_458f459afdb1dbb19c5d80c276"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c35744fa39ab7f9326a0b07a81"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0dec9fe24b4c3731c6b30a1ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d988d1036760b5841e9e9f5509"`);
        await queryRunner.query(`DROP TABLE "dashboard"`);
    }
    /**
    * SqliteDB and BetterSQlite3DB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "dashboard" ("deletedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "archivedAt" datetime, "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "identifier" varchar NOT NULL, "description" text, "contentHtml" text, "isDefault" boolean NOT NULL DEFAULT (0), "creatorId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_d988d1036760b5841e9e9f5509" ON "dashboard" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0dec9fe24b4c3731c6b30a1ba" ON "dashboard" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_c35744fa39ab7f9326a0b07a81" ON "dashboard" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_458f459afdb1dbb19c5d80c276" ON "dashboard" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d343751cf98e2bfd85754a35a1" ON "dashboard" ("creatorId") `);
        await queryRunner.query(`DROP INDEX "IDX_d988d1036760b5841e9e9f5509"`);
        await queryRunner.query(`DROP INDEX "IDX_c0dec9fe24b4c3731c6b30a1ba"`);
        await queryRunner.query(`DROP INDEX "IDX_c35744fa39ab7f9326a0b07a81"`);
        await queryRunner.query(`DROP INDEX "IDX_458f459afdb1dbb19c5d80c276"`);
        await queryRunner.query(`DROP INDEX "IDX_d343751cf98e2bfd85754a35a1"`);
        await queryRunner.query(`CREATE TABLE "temporary_dashboard" ("deletedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "archivedAt" datetime, "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "identifier" varchar NOT NULL, "description" text, "contentHtml" text, "isDefault" boolean NOT NULL DEFAULT (0), "creatorId" varchar NOT NULL, CONSTRAINT "FK_c35744fa39ab7f9326a0b07a812" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_458f459afdb1dbb19c5d80c2767" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_d343751cf98e2bfd85754a35a12" FOREIGN KEY ("creatorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_dashboard"("deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "archivedAt", "tenantId", "organizationId", "name", "identifier", "description", "contentHtml", "isDefault", "creatorId") SELECT "deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "archivedAt", "tenantId", "organizationId", "name", "identifier", "description", "contentHtml", "isDefault", "creatorId" FROM "dashboard"`);
        await queryRunner.query(`DROP TABLE "dashboard"`);
        await queryRunner.query(`ALTER TABLE "temporary_dashboard" RENAME TO "dashboard"`);
        await queryRunner.query(`CREATE INDEX "IDX_d988d1036760b5841e9e9f5509" ON "dashboard" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0dec9fe24b4c3731c6b30a1ba" ON "dashboard" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_c35744fa39ab7f9326a0b07a81" ON "dashboard" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_458f459afdb1dbb19c5d80c276" ON "dashboard" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d343751cf98e2bfd85754a35a1" ON "dashboard" ("creatorId") `);
    }
    /**
    * SqliteDB and BetterSQlite3DB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_d343751cf98e2bfd85754a35a1"`);
        await queryRunner.query(`DROP INDEX "IDX_458f459afdb1dbb19c5d80c276"`);
        await queryRunner.query(`DROP INDEX "IDX_c35744fa39ab7f9326a0b07a81"`);
        await queryRunner.query(`DROP INDEX "IDX_c0dec9fe24b4c3731c6b30a1ba"`);
        await queryRunner.query(`DROP INDEX "IDX_d988d1036760b5841e9e9f5509"`);
        await queryRunner.query(`ALTER TABLE "dashboard" RENAME TO "temporary_dashboard"`);
        await queryRunner.query(`CREATE TABLE "dashboard" ("deletedAt" datetime, "id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "archivedAt" datetime, "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "identifier" varchar NOT NULL, "description" text, "contentHtml" text, "isDefault" boolean NOT NULL DEFAULT (0), "creatorId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "dashboard"("deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "archivedAt", "tenantId", "organizationId", "name", "identifier", "description", "contentHtml", "isDefault", "creatorId") SELECT "deletedAt", "id", "createdAt", "updatedAt", "isActive", "isArchived", "archivedAt", "tenantId", "organizationId", "name", "identifier", "description", "contentHtml", "isDefault", "creatorId" FROM "temporary_dashboard"`);
        await queryRunner.query(`DROP TABLE "temporary_dashboard"`);
        await queryRunner.query(`CREATE INDEX "IDX_d343751cf98e2bfd85754a35a1" ON "dashboard" ("creatorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_458f459afdb1dbb19c5d80c276" ON "dashboard" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c35744fa39ab7f9326a0b07a81" ON "dashboard" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0dec9fe24b4c3731c6b30a1ba" ON "dashboard" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_d988d1036760b5841e9e9f5509" ON "dashboard" ("isActive") `);
        await queryRunner.query(`DROP INDEX "IDX_d343751cf98e2bfd85754a35a1"`);
        await queryRunner.query(`DROP INDEX "IDX_458f459afdb1dbb19c5d80c276"`);
        await queryRunner.query(`DROP INDEX "IDX_c35744fa39ab7f9326a0b07a81"`);
        await queryRunner.query(`DROP INDEX "IDX_c0dec9fe24b4c3731c6b30a1ba"`);
        await queryRunner.query(`DROP INDEX "IDX_d988d1036760b5841e9e9f5509"`);
        await queryRunner.query(`DROP TABLE "dashboard"`);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`dashboard\` (\`deletedAt\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isActive\` tinyint NULL DEFAULT 1, \`isArchived\` tinyint NULL DEFAULT 0, \`archivedAt\` datetime NULL, \`tenantId\` varchar(255) NULL, \`organizationId\` varchar(255) NULL, \`name\` varchar(255) NOT NULL, \`identifier\` varchar(255) NOT NULL, \`description\` text NULL, \`contentHtml\` json NULL, \`isDefault\` tinyint NOT NULL DEFAULT 0, \`creatorId\` varchar(255) NOT NULL, INDEX \`IDX_d988d1036760b5841e9e9f5509\` (\`isActive\`), INDEX \`IDX_c0dec9fe24b4c3731c6b30a1ba\` (\`isArchived\`), INDEX \`IDX_c35744fa39ab7f9326a0b07a81\` (\`tenantId\`), INDEX \`IDX_458f459afdb1dbb19c5d80c276\` (\`organizationId\`), INDEX \`IDX_d343751cf98e2bfd85754a35a1\` (\`creatorId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`dashboard\` ADD CONSTRAINT \`FK_c35744fa39ab7f9326a0b07a812\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dashboard\` ADD CONSTRAINT \`FK_458f459afdb1dbb19c5d80c2767\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organization\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`dashboard\` ADD CONSTRAINT \`FK_d343751cf98e2bfd85754a35a12\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`dashboard\` DROP FOREIGN KEY \`FK_d343751cf98e2bfd85754a35a12\``);
        await queryRunner.query(`ALTER TABLE \`dashboard\` DROP FOREIGN KEY \`FK_458f459afdb1dbb19c5d80c2767\``);
        await queryRunner.query(`ALTER TABLE \`dashboard\` DROP FOREIGN KEY \`FK_c35744fa39ab7f9326a0b07a812\``);
        await queryRunner.query(`DROP INDEX \`IDX_d343751cf98e2bfd85754a35a1\` ON \`dashboard\``);
        await queryRunner.query(`DROP INDEX \`IDX_458f459afdb1dbb19c5d80c276\` ON \`dashboard\``);
        await queryRunner.query(`DROP INDEX \`IDX_c35744fa39ab7f9326a0b07a81\` ON \`dashboard\``);
        await queryRunner.query(`DROP INDEX \`IDX_c0dec9fe24b4c3731c6b30a1ba\` ON \`dashboard\``);
        await queryRunner.query(`DROP INDEX \`IDX_d988d1036760b5841e9e9f5509\` ON \`dashboard\``);
        await queryRunner.query(`DROP TABLE \`dashboard\``);
    }
}
exports.CreateDashboardTable1734955984574 = CreateDashboardTable1734955984574;
//# sourceMappingURL=1734955984574-CreateDashboardTable.js.map