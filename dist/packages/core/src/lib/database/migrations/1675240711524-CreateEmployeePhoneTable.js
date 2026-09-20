"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeePhoneTable1675240711524 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class CreateEmployeePhoneTable1675240711524 {
    constructor() {
        this.name = 'CreateEmployeePhoneTable1675240711524';
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
        await queryRunner.query(`CREATE TABLE "employee_phone" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid, "organizationId" uuid, "type" character varying, "phoneNumber" character varying NOT NULL, "employeeId" uuid NOT NULL, CONSTRAINT "PK_c36300253feafdecf31e89b9ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d543336994b1f764c449e0b1d3" ON "employee_phone" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f9cefa604913e1ab322591546" ON "employee_phone" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ba7b2ef5a9cd165a1e4e2ad0ef" ON "employee_phone" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_329ebd01a757d1a0c3c4d628e2" ON "employee_phone" ("employeeId") `);
        await queryRunner.query(`ALTER TABLE "employee_phone" ADD CONSTRAINT "FK_d543336994b1f764c449e0b1d3c" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_phone" ADD CONSTRAINT "FK_0f9cefa604913e1ab3225915469" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_phone" ADD CONSTRAINT "FK_329ebd01a757d1a0c3c4d628e29" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "employee_phone" DROP CONSTRAINT "FK_329ebd01a757d1a0c3c4d628e29"`);
        await queryRunner.query(`ALTER TABLE "employee_phone" DROP CONSTRAINT "FK_0f9cefa604913e1ab3225915469"`);
        await queryRunner.query(`ALTER TABLE "employee_phone" DROP CONSTRAINT "FK_d543336994b1f764c449e0b1d3c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_329ebd01a757d1a0c3c4d628e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba7b2ef5a9cd165a1e4e2ad0ef"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f9cefa604913e1ab322591546"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d543336994b1f764c449e0b1d3"`);
        await queryRunner.query(`DROP TABLE "employee_phone"`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "employee_phone" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "type" varchar, "phoneNumber" varchar NOT NULL, "employeeId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_d543336994b1f764c449e0b1d3" ON "employee_phone" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f9cefa604913e1ab322591546" ON "employee_phone" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ba7b2ef5a9cd165a1e4e2ad0ef" ON "employee_phone" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_329ebd01a757d1a0c3c4d628e2" ON "employee_phone" ("employeeId") `);
        await queryRunner.query(`DROP INDEX "IDX_d543336994b1f764c449e0b1d3"`);
        await queryRunner.query(`DROP INDEX "IDX_0f9cefa604913e1ab322591546"`);
        await queryRunner.query(`DROP INDEX "IDX_ba7b2ef5a9cd165a1e4e2ad0ef"`);
        await queryRunner.query(`DROP INDEX "IDX_329ebd01a757d1a0c3c4d628e2"`);
        await queryRunner.query(`CREATE TABLE "temporary_employee_phone" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "type" varchar, "phoneNumber" varchar NOT NULL, "employeeId" varchar NOT NULL, CONSTRAINT "FK_d543336994b1f764c449e0b1d3c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_0f9cefa604913e1ab3225915469" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_329ebd01a757d1a0c3c4d628e29" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_employee_phone"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "type", "phoneNumber", "employeeId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "type", "phoneNumber", "employeeId" FROM "employee_phone"`);
        await queryRunner.query(`DROP TABLE "employee_phone"`);
        await queryRunner.query(`ALTER TABLE "temporary_employee_phone" RENAME TO "employee_phone"`);
        await queryRunner.query(`CREATE INDEX "IDX_d543336994b1f764c449e0b1d3" ON "employee_phone" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f9cefa604913e1ab322591546" ON "employee_phone" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ba7b2ef5a9cd165a1e4e2ad0ef" ON "employee_phone" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_329ebd01a757d1a0c3c4d628e2" ON "employee_phone" ("employeeId") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_329ebd01a757d1a0c3c4d628e2"`);
        await queryRunner.query(`DROP INDEX "IDX_ba7b2ef5a9cd165a1e4e2ad0ef"`);
        await queryRunner.query(`DROP INDEX "IDX_0f9cefa604913e1ab322591546"`);
        await queryRunner.query(`DROP INDEX "IDX_d543336994b1f764c449e0b1d3"`);
        await queryRunner.query(`ALTER TABLE "employee_phone" RENAME TO "temporary_employee_phone"`);
        await queryRunner.query(`CREATE TABLE "employee_phone" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "type" varchar, "phoneNumber" varchar NOT NULL, "employeeId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "employee_phone"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "type", "phoneNumber", "employeeId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "type", "phoneNumber", "employeeId" FROM "temporary_employee_phone"`);
        await queryRunner.query(`DROP TABLE "temporary_employee_phone"`);
        await queryRunner.query(`CREATE INDEX "IDX_329ebd01a757d1a0c3c4d628e2" ON "employee_phone" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ba7b2ef5a9cd165a1e4e2ad0ef" ON "employee_phone" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f9cefa604913e1ab322591546" ON "employee_phone" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d543336994b1f764c449e0b1d3" ON "employee_phone" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_329ebd01a757d1a0c3c4d628e2"`);
        await queryRunner.query(`DROP INDEX "IDX_ba7b2ef5a9cd165a1e4e2ad0ef"`);
        await queryRunner.query(`DROP INDEX "IDX_0f9cefa604913e1ab322591546"`);
        await queryRunner.query(`DROP INDEX "IDX_d543336994b1f764c449e0b1d3"`);
        await queryRunner.query(`DROP TABLE "employee_phone"`);
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
exports.CreateEmployeePhoneTable1675240711524 = CreateEmployeePhoneTable1675240711524;
//# sourceMappingURL=1675240711524-CreateEmployeePhoneTable.js.map