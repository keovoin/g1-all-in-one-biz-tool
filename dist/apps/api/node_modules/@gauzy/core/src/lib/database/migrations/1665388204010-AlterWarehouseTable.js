"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterWarehouseTable1665388204010 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterWarehouseTable1665388204010 {
    constructor() {
        this.name = 'AlterWarehouseTable1665388204010';
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
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "FK_84594016a98da8b87e0f51cd931"`);
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "contactId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "FK_84594016a98da8b87e0f51cd931" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "FK_84594016a98da8b87e0f51cd931"`);
        await queryRunner.query(`ALTER TABLE "warehouse" ALTER COLUMN "contactId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "FK_84594016a98da8b87e0f51cd931" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_84594016a98da8b87e0f51cd93"`);
        await queryRunner.query(`DROP INDEX "IDX_f502dc6d9802306f9d1584932b"`);
        await queryRunner.query(`DROP INDEX "IDX_f5735eafddabdb4b20f621a976"`);
        await queryRunner.query(`DROP INDEX "IDX_9b2f00761a6b1b77cb6289e3ff"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (1), "logoId" varchar, "contactId" varchar NOT NULL, CONSTRAINT "REL_84594016a98da8b87e0f51cd93" UNIQUE ("contactId"), CONSTRAINT "FK_84594016a98da8b87e0f51cd931" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_f502dc6d9802306f9d1584932b8" FOREIGN KEY ("logoId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_f5735eafddabdb4b20f621a976a" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_9b2f00761a6b1b77cb6289e3fff" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId" FROM "warehouse"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse" RENAME TO "warehouse"`);
        await queryRunner.query(`CREATE INDEX "IDX_84594016a98da8b87e0f51cd93" ON "warehouse" ("contactId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f502dc6d9802306f9d1584932b" ON "warehouse" ("logoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5735eafddabdb4b20f621a976" ON "warehouse" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9b2f00761a6b1b77cb6289e3ff" ON "warehouse" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_84594016a98da8b87e0f51cd93"`);
        await queryRunner.query(`DROP INDEX "IDX_f502dc6d9802306f9d1584932b"`);
        await queryRunner.query(`DROP INDEX "IDX_f5735eafddabdb4b20f621a976"`);
        await queryRunner.query(`DROP INDEX "IDX_9b2f00761a6b1b77cb6289e3ff"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (1), "logoId" varchar, "contactId" varchar NOT NULL, CONSTRAINT "REL_84594016a98da8b87e0f51cd93" UNIQUE ("contactId"))`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId" FROM "warehouse"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse" RENAME TO "warehouse"`);
        await queryRunner.query(`CREATE INDEX "IDX_84594016a98da8b87e0f51cd93" ON "warehouse" ("contactId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f502dc6d9802306f9d1584932b" ON "warehouse" ("logoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5735eafddabdb4b20f621a976" ON "warehouse" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9b2f00761a6b1b77cb6289e3ff" ON "warehouse" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_84594016a98da8b87e0f51cd93"`);
        await queryRunner.query(`DROP INDEX "IDX_f502dc6d9802306f9d1584932b"`);
        await queryRunner.query(`DROP INDEX "IDX_f5735eafddabdb4b20f621a976"`);
        await queryRunner.query(`DROP INDEX "IDX_9b2f00761a6b1b77cb6289e3ff"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (1), "logoId" varchar, "contactId" varchar, CONSTRAINT "REL_84594016a98da8b87e0f51cd93" UNIQUE ("contactId"))`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId" FROM "warehouse"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse" RENAME TO "warehouse"`);
        await queryRunner.query(`CREATE INDEX "IDX_84594016a98da8b87e0f51cd93" ON "warehouse" ("contactId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f502dc6d9802306f9d1584932b" ON "warehouse" ("logoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5735eafddabdb4b20f621a976" ON "warehouse" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9b2f00761a6b1b77cb6289e3ff" ON "warehouse" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_84594016a98da8b87e0f51cd93"`);
        await queryRunner.query(`DROP INDEX "IDX_f502dc6d9802306f9d1584932b"`);
        await queryRunner.query(`DROP INDEX "IDX_f5735eafddabdb4b20f621a976"`);
        await queryRunner.query(`DROP INDEX "IDX_9b2f00761a6b1b77cb6289e3ff"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (1), "logoId" varchar, "contactId" varchar, CONSTRAINT "REL_84594016a98da8b87e0f51cd93" UNIQUE ("contactId"), CONSTRAINT "FK_9b2f00761a6b1b77cb6289e3fff" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_f5735eafddabdb4b20f621a976a" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_f502dc6d9802306f9d1584932b8" FOREIGN KEY ("logoId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_84594016a98da8b87e0f51cd931" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId" FROM "warehouse"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse" RENAME TO "warehouse"`);
        await queryRunner.query(`CREATE INDEX "IDX_84594016a98da8b87e0f51cd93" ON "warehouse" ("contactId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f502dc6d9802306f9d1584932b" ON "warehouse" ("logoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5735eafddabdb4b20f621a976" ON "warehouse" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9b2f00761a6b1b77cb6289e3ff" ON "warehouse" ("tenantId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_9b2f00761a6b1b77cb6289e3ff"`);
        await queryRunner.query(`DROP INDEX "IDX_f5735eafddabdb4b20f621a976"`);
        await queryRunner.query(`DROP INDEX "IDX_f502dc6d9802306f9d1584932b"`);
        await queryRunner.query(`DROP INDEX "IDX_84594016a98da8b87e0f51cd93"`);
        await queryRunner.query(`ALTER TABLE "warehouse" RENAME TO "temporary_warehouse"`);
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (1), "logoId" varchar, "contactId" varchar, CONSTRAINT "REL_84594016a98da8b87e0f51cd93" UNIQUE ("contactId"))`);
        await queryRunner.query(`INSERT INTO "warehouse"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId" FROM "temporary_warehouse"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse"`);
        await queryRunner.query(`CREATE INDEX "IDX_9b2f00761a6b1b77cb6289e3ff" ON "warehouse" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5735eafddabdb4b20f621a976" ON "warehouse" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f502dc6d9802306f9d1584932b" ON "warehouse" ("logoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84594016a98da8b87e0f51cd93" ON "warehouse" ("contactId") `);
        await queryRunner.query(`DROP INDEX "IDX_9b2f00761a6b1b77cb6289e3ff"`);
        await queryRunner.query(`DROP INDEX "IDX_f5735eafddabdb4b20f621a976"`);
        await queryRunner.query(`DROP INDEX "IDX_f502dc6d9802306f9d1584932b"`);
        await queryRunner.query(`DROP INDEX "IDX_84594016a98da8b87e0f51cd93"`);
        await queryRunner.query(`ALTER TABLE "warehouse" RENAME TO "temporary_warehouse"`);
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (1), "logoId" varchar, "contactId" varchar NOT NULL, CONSTRAINT "REL_84594016a98da8b87e0f51cd93" UNIQUE ("contactId"))`);
        await queryRunner.query(`INSERT INTO "warehouse"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId" FROM "temporary_warehouse"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse"`);
        await queryRunner.query(`CREATE INDEX "IDX_9b2f00761a6b1b77cb6289e3ff" ON "warehouse" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5735eafddabdb4b20f621a976" ON "warehouse" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f502dc6d9802306f9d1584932b" ON "warehouse" ("logoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84594016a98da8b87e0f51cd93" ON "warehouse" ("contactId") `);
        await queryRunner.query(`DROP INDEX "IDX_9b2f00761a6b1b77cb6289e3ff"`);
        await queryRunner.query(`DROP INDEX "IDX_f5735eafddabdb4b20f621a976"`);
        await queryRunner.query(`DROP INDEX "IDX_f502dc6d9802306f9d1584932b"`);
        await queryRunner.query(`DROP INDEX "IDX_84594016a98da8b87e0f51cd93"`);
        await queryRunner.query(`ALTER TABLE "warehouse" RENAME TO "temporary_warehouse"`);
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (1), "logoId" varchar, "contactId" varchar NOT NULL, CONSTRAINT "REL_84594016a98da8b87e0f51cd93" UNIQUE ("contactId"), CONSTRAINT "FK_84594016a98da8b87e0f51cd931" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "warehouse"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId" FROM "temporary_warehouse"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse"`);
        await queryRunner.query(`CREATE INDEX "IDX_9b2f00761a6b1b77cb6289e3ff" ON "warehouse" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5735eafddabdb4b20f621a976" ON "warehouse" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f502dc6d9802306f9d1584932b" ON "warehouse" ("logoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84594016a98da8b87e0f51cd93" ON "warehouse" ("contactId") `);
        await queryRunner.query(`DROP INDEX "IDX_9b2f00761a6b1b77cb6289e3ff"`);
        await queryRunner.query(`DROP INDEX "IDX_f5735eafddabdb4b20f621a976"`);
        await queryRunner.query(`DROP INDEX "IDX_f502dc6d9802306f9d1584932b"`);
        await queryRunner.query(`DROP INDEX "IDX_84594016a98da8b87e0f51cd93"`);
        await queryRunner.query(`ALTER TABLE "warehouse" RENAME TO "temporary_warehouse"`);
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "code" varchar NOT NULL, "email" varchar NOT NULL, "description" varchar, "active" boolean NOT NULL DEFAULT (1), "logoId" varchar, "contactId" varchar NOT NULL, CONSTRAINT "REL_84594016a98da8b87e0f51cd93" UNIQUE ("contactId"), CONSTRAINT "FK_84594016a98da8b87e0f51cd931" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_f502dc6d9802306f9d1584932b8" FOREIGN KEY ("logoId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_f5735eafddabdb4b20f621a976a" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_9b2f00761a6b1b77cb6289e3fff" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "warehouse"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "code", "email", "description", "active", "logoId", "contactId" FROM "temporary_warehouse"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse"`);
        await queryRunner.query(`CREATE INDEX "IDX_9b2f00761a6b1b77cb6289e3ff" ON "warehouse" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5735eafddabdb4b20f621a976" ON "warehouse" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f502dc6d9802306f9d1584932b" ON "warehouse" ("logoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84594016a98da8b87e0f51cd93" ON "warehouse" ("contactId") `);
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
exports.AlterWarehouseTable1665388204010 = AlterWarehouseTable1665388204010;
//# sourceMappingURL=1665388204010-AlterWarehouseTable.js.map