"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterTimeOffRequestTable1652270907163 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterTimeOffRequestTable1652270907163 {
    constructor() {
        this.name = 'AlterTimeOffRequestTable1652270907163';
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
        await queryRunner.query(`ALTER TABLE "time_off_request" ALTER COLUMN "isHoliday" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "time_off_request" ALTER COLUMN "isHoliday" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "time_off_request" ALTER COLUMN "isArchived" SET DEFAULT false`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "time_off_request" ALTER COLUMN "isArchived" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "time_off_request" ALTER COLUMN "isHoliday" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "time_off_request" ALTER COLUMN "isHoliday" SET NOT NULL`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_c1f8ae47dc2f1882afc5045c73"`);
        await queryRunner.query(`DROP INDEX "IDX_981333982a6df8b815957dcbf2"`);
        await queryRunner.query(`DROP INDEX "IDX_4989834dd1c9c8ea3576ed99ce"`);
        await queryRunner.query(`CREATE TABLE "temporary_time_off_request" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "documentUrl" varchar, "description" varchar, "start" datetime NOT NULL, "end" datetime NOT NULL, "requestDate" datetime NOT NULL, "status" varchar NOT NULL, "isHoliday" boolean NOT NULL, "isArchived" boolean, "policyId" varchar NOT NULL, CONSTRAINT "FK_c1f8ae47dc2f1882afc5045c739" FOREIGN KEY ("policyId") REFERENCES "time_off_policy" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_981333982a6df8b815957dcbf27" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4989834dd1c9c8ea3576ed99ce5" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_time_off_request"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "documentUrl", "description", "start", "end", "requestDate", "status", "isHoliday", "isArchived", "policyId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "documentUrl", "description", "start", "end", "requestDate", "status", "isHoliday", "isArchived", "policyId" FROM "time_off_request"`);
        await queryRunner.query(`DROP TABLE "time_off_request"`);
        await queryRunner.query(`ALTER TABLE "temporary_time_off_request" RENAME TO "time_off_request"`);
        await queryRunner.query(`CREATE INDEX "IDX_c1f8ae47dc2f1882afc5045c73" ON "time_off_request" ("policyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_981333982a6df8b815957dcbf2" ON "time_off_request" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4989834dd1c9c8ea3576ed99ce" ON "time_off_request" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_c1f8ae47dc2f1882afc5045c73"`);
        await queryRunner.query(`DROP INDEX "IDX_981333982a6df8b815957dcbf2"`);
        await queryRunner.query(`DROP INDEX "IDX_4989834dd1c9c8ea3576ed99ce"`);
        await queryRunner.query(`CREATE TABLE "temporary_time_off_request" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "documentUrl" varchar, "description" varchar, "start" datetime NOT NULL, "end" datetime NOT NULL, "requestDate" datetime NOT NULL, "status" varchar NOT NULL, "isHoliday" boolean DEFAULT (0), "isArchived" boolean DEFAULT (0), "policyId" varchar NOT NULL, CONSTRAINT "FK_c1f8ae47dc2f1882afc5045c739" FOREIGN KEY ("policyId") REFERENCES "time_off_policy" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_981333982a6df8b815957dcbf27" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4989834dd1c9c8ea3576ed99ce5" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_time_off_request"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "documentUrl", "description", "start", "end", "requestDate", "status", "isHoliday", "isArchived", "policyId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "documentUrl", "description", "start", "end", "requestDate", "status", "isHoliday", "isArchived", "policyId" FROM "time_off_request"`);
        await queryRunner.query(`DROP TABLE "time_off_request"`);
        await queryRunner.query(`ALTER TABLE "temporary_time_off_request" RENAME TO "time_off_request"`);
        await queryRunner.query(`CREATE INDEX "IDX_c1f8ae47dc2f1882afc5045c73" ON "time_off_request" ("policyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_981333982a6df8b815957dcbf2" ON "time_off_request" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4989834dd1c9c8ea3576ed99ce" ON "time_off_request" ("tenantId") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_4989834dd1c9c8ea3576ed99ce"`);
        await queryRunner.query(`DROP INDEX "IDX_981333982a6df8b815957dcbf2"`);
        await queryRunner.query(`DROP INDEX "IDX_c1f8ae47dc2f1882afc5045c73"`);
        await queryRunner.query(`ALTER TABLE "time_off_request" RENAME TO "temporary_time_off_request"`);
        await queryRunner.query(`CREATE TABLE "time_off_request" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "documentUrl" varchar, "description" varchar, "start" datetime NOT NULL, "end" datetime NOT NULL, "requestDate" datetime NOT NULL, "status" varchar NOT NULL, "isHoliday" boolean NOT NULL, "isArchived" boolean, "policyId" varchar NOT NULL, CONSTRAINT "FK_c1f8ae47dc2f1882afc5045c739" FOREIGN KEY ("policyId") REFERENCES "time_off_policy" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_981333982a6df8b815957dcbf27" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4989834dd1c9c8ea3576ed99ce5" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "time_off_request"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "documentUrl", "description", "start", "end", "requestDate", "status", "isHoliday", "isArchived", "policyId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "documentUrl", "description", "start", "end", "requestDate", "status", "isHoliday", "isArchived", "policyId" FROM "temporary_time_off_request"`);
        await queryRunner.query(`DROP TABLE "temporary_time_off_request"`);
        await queryRunner.query(`CREATE INDEX "IDX_4989834dd1c9c8ea3576ed99ce" ON "time_off_request" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_981333982a6df8b815957dcbf2" ON "time_off_request" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1f8ae47dc2f1882afc5045c73" ON "time_off_request" ("policyId") `);
        await queryRunner.query(`DROP INDEX "IDX_4989834dd1c9c8ea3576ed99ce"`);
        await queryRunner.query(`DROP INDEX "IDX_981333982a6df8b815957dcbf2"`);
        await queryRunner.query(`DROP INDEX "IDX_c1f8ae47dc2f1882afc5045c73"`);
        await queryRunner.query(`ALTER TABLE "time_off_request" RENAME TO "temporary_time_off_request"`);
        await queryRunner.query(`CREATE TABLE "time_off_request" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "documentUrl" varchar, "description" varchar, "start" datetime NOT NULL, "end" datetime NOT NULL, "requestDate" datetime NOT NULL, "status" varchar NOT NULL, "isHoliday" boolean NOT NULL, "isArchived" boolean, "policyId" varchar NOT NULL, CONSTRAINT "FK_c1f8ae47dc2f1882afc5045c739" FOREIGN KEY ("policyId") REFERENCES "time_off_policy" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_981333982a6df8b815957dcbf27" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4989834dd1c9c8ea3576ed99ce5" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "time_off_request"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "documentUrl", "description", "start", "end", "requestDate", "status", "isHoliday", "isArchived", "policyId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "documentUrl", "description", "start", "end", "requestDate", "status", "isHoliday", "isArchived", "policyId" FROM "temporary_time_off_request"`);
        await queryRunner.query(`DROP TABLE "temporary_time_off_request"`);
        await queryRunner.query(`CREATE INDEX "IDX_4989834dd1c9c8ea3576ed99ce" ON "time_off_request" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_981333982a6df8b815957dcbf2" ON "time_off_request" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1f8ae47dc2f1882afc5045c73" ON "time_off_request" ("policyId") `);
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
exports.AlterTimeOffRequestTable1652270907163 = AlterTimeOffRequestTable1652270907163;
//# sourceMappingURL=1652270907163-AlterTimeOffRequestTable.js.map