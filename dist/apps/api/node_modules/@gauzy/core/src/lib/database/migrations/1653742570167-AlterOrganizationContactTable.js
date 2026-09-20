"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterOrganizationContactTable1653742570167 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterOrganizationContactTable1653742570167 {
    constructor() {
        this.name = 'AlterOrganizationContactTable1653742570167';
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
        await queryRunner.query(`ALTER TABLE "organization_contact" DROP COLUMN "inviteStatus"`);
        await queryRunner.query(`CREATE TYPE "public"."organization_contact_invitestatus_enum" AS ENUM('NOT_INVITED', 'INVITED', 'ACCEPTED')`);
        await queryRunner.query(`ALTER TABLE "organization_contact" ADD "inviteStatus" "public"."organization_contact_invitestatus_enum"`);
        await queryRunner.query(`ALTER TABLE "organization_contact" DROP COLUMN "contactType"`);
        await queryRunner.query(`CREATE TYPE "public"."organization_contact_contacttype_enum" AS ENUM('CLIENT', 'CUSTOMER', 'LEAD')`);
        await queryRunner.query(`ALTER TABLE "organization_contact" ADD "contactType" "public"."organization_contact_contacttype_enum" NOT NULL DEFAULT 'CLIENT'`);
        await queryRunner.query(`ALTER TABLE "organization_contact" DROP COLUMN "budgetType"`);
        await queryRunner.query(`CREATE TYPE "public"."organization_contact_budgettype_enum" AS ENUM('hours', 'cost')`);
        await queryRunner.query(`ALTER TABLE "organization_contact" ADD "budgetType" "public"."organization_contact_budgettype_enum" DEFAULT 'cost'`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "organization_contact" DROP COLUMN "budgetType"`);
        await queryRunner.query(`DROP TYPE "public"."organization_contact_budgettype_enum"`);
        await queryRunner.query(`ALTER TABLE "organization_contact" ADD "budgetType" text DEFAULT 'cost'`);
        await queryRunner.query(`ALTER TABLE "organization_contact" DROP COLUMN "contactType"`);
        await queryRunner.query(`DROP TYPE "public"."organization_contact_contacttype_enum"`);
        await queryRunner.query(`ALTER TABLE "organization_contact" ADD "contactType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization_contact" DROP COLUMN "inviteStatus"`);
        await queryRunner.query(`DROP TYPE "public"."organization_contact_invitestatus_enum"`);
        await queryRunner.query(`ALTER TABLE "organization_contact" ADD "inviteStatus" character varying`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_a86d2e378b953cb39261f457d2"`);
        await queryRunner.query(`DROP INDEX "IDX_de33f92e042365d196d959e774"`);
        await queryRunner.query(`DROP INDEX "IDX_6200736cb4d3617b004e5b647f"`);
        await queryRunner.query(`DROP INDEX "IDX_e68c43e315ad3aaea4e99cf461"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_contact" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "primaryEmail" varchar, "primaryPhone" varchar, "inviteStatus" varchar, "notes" varchar, "contactType" varchar NOT NULL, "imageUrl" varchar(500), "budget" integer, "budgetType" text DEFAULT ('cost'), "createdBy" varchar, "contactId" varchar, CONSTRAINT "REL_a86d2e378b953cb39261f457d2" UNIQUE ("contactId"), CONSTRAINT "FK_a86d2e378b953cb39261f457d26" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_6200736cb4d3617b004e5b647ff" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_e68c43e315ad3aaea4e99cf461d" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_contact"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "primaryEmail", "primaryPhone", "inviteStatus", "notes", "contactType", "imageUrl", "budget", "budgetType", "createdBy", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "primaryEmail", "primaryPhone", "inviteStatus", "notes", "contactType", "imageUrl", "budget", "budgetType", "createdBy", "contactId" FROM "organization_contact"`);
        await queryRunner.query(`DROP TABLE "organization_contact"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_contact" RENAME TO "organization_contact"`);
        await queryRunner.query(`CREATE INDEX "IDX_a86d2e378b953cb39261f457d2" ON "organization_contact" ("contactId") `);
        await queryRunner.query(`CREATE INDEX "IDX_de33f92e042365d196d959e774" ON "organization_contact" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_6200736cb4d3617b004e5b647f" ON "organization_contact" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e68c43e315ad3aaea4e99cf461" ON "organization_contact" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_a86d2e378b953cb39261f457d2"`);
        await queryRunner.query(`DROP INDEX "IDX_de33f92e042365d196d959e774"`);
        await queryRunner.query(`DROP INDEX "IDX_6200736cb4d3617b004e5b647f"`);
        await queryRunner.query(`DROP INDEX "IDX_e68c43e315ad3aaea4e99cf461"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_contact" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "primaryEmail" varchar, "primaryPhone" varchar, "inviteStatus" varchar, "notes" varchar, "contactType" varchar CHECK( "contactType" IN ('CLIENT','CUSTOMER','LEAD') ) NOT NULL DEFAULT ('CLIENT'), "imageUrl" varchar(500), "budget" integer, "budgetType" varchar CHECK( "budgetType" IN ('hours','cost') ) DEFAULT ('cost'), "createdBy" varchar, "contactId" varchar, CONSTRAINT "REL_a86d2e378b953cb39261f457d2" UNIQUE ("contactId"), CONSTRAINT "FK_a86d2e378b953cb39261f457d26" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_6200736cb4d3617b004e5b647ff" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_e68c43e315ad3aaea4e99cf461d" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_contact"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "primaryEmail", "primaryPhone", "inviteStatus", "notes", "contactType", "imageUrl", "budget", "budgetType", "createdBy", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "primaryEmail", "primaryPhone", "inviteStatus", "notes", "contactType", "imageUrl", "budget", "budgetType", "createdBy", "contactId" FROM "organization_contact"`);
        await queryRunner.query(`DROP TABLE "organization_contact"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_contact" RENAME TO "organization_contact"`);
        await queryRunner.query(`CREATE INDEX "IDX_a86d2e378b953cb39261f457d2" ON "organization_contact" ("contactId") `);
        await queryRunner.query(`CREATE INDEX "IDX_de33f92e042365d196d959e774" ON "organization_contact" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_6200736cb4d3617b004e5b647f" ON "organization_contact" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e68c43e315ad3aaea4e99cf461" ON "organization_contact" ("tenantId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_e68c43e315ad3aaea4e99cf461"`);
        await queryRunner.query(`DROP INDEX "IDX_6200736cb4d3617b004e5b647f"`);
        await queryRunner.query(`DROP INDEX "IDX_de33f92e042365d196d959e774"`);
        await queryRunner.query(`DROP INDEX "IDX_a86d2e378b953cb39261f457d2"`);
        await queryRunner.query(`ALTER TABLE "organization_contact" RENAME TO "temporary_organization_contact"`);
        await queryRunner.query(`CREATE TABLE "organization_contact" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "primaryEmail" varchar, "primaryPhone" varchar, "inviteStatus" varchar, "notes" varchar, "contactType" varchar NOT NULL, "imageUrl" varchar(500), "budget" integer, "budgetType" text DEFAULT ('cost'), "createdBy" varchar, "contactId" varchar, CONSTRAINT "REL_a86d2e378b953cb39261f457d2" UNIQUE ("contactId"), CONSTRAINT "FK_a86d2e378b953cb39261f457d26" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_6200736cb4d3617b004e5b647ff" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_e68c43e315ad3aaea4e99cf461d" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_contact"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "primaryEmail", "primaryPhone", "inviteStatus", "notes", "contactType", "imageUrl", "budget", "budgetType", "createdBy", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "primaryEmail", "primaryPhone", "inviteStatus", "notes", "contactType", "imageUrl", "budget", "budgetType", "createdBy", "contactId" FROM "temporary_organization_contact"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_contact"`);
        await queryRunner.query(`CREATE INDEX "IDX_e68c43e315ad3aaea4e99cf461" ON "organization_contact" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6200736cb4d3617b004e5b647f" ON "organization_contact" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_de33f92e042365d196d959e774" ON "organization_contact" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_a86d2e378b953cb39261f457d2" ON "organization_contact" ("contactId") `);
        await queryRunner.query(`DROP INDEX "IDX_e68c43e315ad3aaea4e99cf461"`);
        await queryRunner.query(`DROP INDEX "IDX_6200736cb4d3617b004e5b647f"`);
        await queryRunner.query(`DROP INDEX "IDX_de33f92e042365d196d959e774"`);
        await queryRunner.query(`DROP INDEX "IDX_a86d2e378b953cb39261f457d2"`);
        await queryRunner.query(`ALTER TABLE "organization_contact" RENAME TO "temporary_organization_contact"`);
        await queryRunner.query(`CREATE TABLE "organization_contact" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "primaryEmail" varchar, "primaryPhone" varchar, "inviteStatus" varchar, "notes" varchar, "contactType" varchar NOT NULL, "imageUrl" varchar(500), "budget" integer, "budgetType" text DEFAULT ('cost'), "createdBy" varchar, "contactId" varchar, CONSTRAINT "REL_a86d2e378b953cb39261f457d2" UNIQUE ("contactId"), CONSTRAINT "FK_a86d2e378b953cb39261f457d26" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_6200736cb4d3617b004e5b647ff" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_e68c43e315ad3aaea4e99cf461d" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_contact"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "primaryEmail", "primaryPhone", "inviteStatus", "notes", "contactType", "imageUrl", "budget", "budgetType", "createdBy", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "primaryEmail", "primaryPhone", "inviteStatus", "notes", "contactType", "imageUrl", "budget", "budgetType", "createdBy", "contactId" FROM "temporary_organization_contact"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_contact"`);
        await queryRunner.query(`CREATE INDEX "IDX_e68c43e315ad3aaea4e99cf461" ON "organization_contact" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6200736cb4d3617b004e5b647f" ON "organization_contact" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_de33f92e042365d196d959e774" ON "organization_contact" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_a86d2e378b953cb39261f457d2" ON "organization_contact" ("contactId") `);
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
exports.AlterOrganizationContactTable1653742570167 = AlterOrganizationContactTable1653742570167;
//# sourceMappingURL=1653742570167-AlterOrganizationContactTable.js.map