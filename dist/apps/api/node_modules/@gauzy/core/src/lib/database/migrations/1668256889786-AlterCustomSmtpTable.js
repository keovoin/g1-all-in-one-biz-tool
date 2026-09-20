"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterCustomSmtpTable1668256889786 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterCustomSmtpTable1668256889786 {
    constructor() {
        this.name = 'AlterCustomSmtpTable1668256889786';
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
        await queryRunner.query(`ALTER TABLE "custom_smtp" ADD "fromAddress" character varying`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "custom_smtp" DROP COLUMN "fromAddress"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_15a1306132d66c63ef31f7288c"`);
        await queryRunner.query(`DROP INDEX "IDX_2aa3fc8daa25beec4788d2be26"`);
        await queryRunner.query(`CREATE TABLE "temporary_custom_smtp" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "host" varchar NOT NULL, "port" integer NOT NULL, "secure" boolean NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "isValidate" boolean NOT NULL DEFAULT (0), "fromAddress" varchar, CONSTRAINT "FK_15a1306132d66c63ef31f7288c1" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_2aa3fc8daa25beec4788d2be26c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_custom_smtp"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "host", "port", "secure", "username", "password", "isValidate") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "host", "port", "secure", "username", "password", "isValidate" FROM "custom_smtp"`);
        await queryRunner.query(`DROP TABLE "custom_smtp"`);
        await queryRunner.query(`ALTER TABLE "temporary_custom_smtp" RENAME TO "custom_smtp"`);
        await queryRunner.query(`CREATE INDEX "IDX_15a1306132d66c63ef31f7288c" ON "custom_smtp" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2aa3fc8daa25beec4788d2be26" ON "custom_smtp" ("tenantId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_2aa3fc8daa25beec4788d2be26"`);
        await queryRunner.query(`DROP INDEX "IDX_15a1306132d66c63ef31f7288c"`);
        await queryRunner.query(`ALTER TABLE "custom_smtp" RENAME TO "temporary_custom_smtp"`);
        await queryRunner.query(`CREATE TABLE "custom_smtp" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "host" varchar NOT NULL, "port" integer NOT NULL, "secure" boolean NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "isValidate" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_15a1306132d66c63ef31f7288c1" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_2aa3fc8daa25beec4788d2be26c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "custom_smtp"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "host", "port", "secure", "username", "password", "isValidate") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "host", "port", "secure", "username", "password", "isValidate" FROM "temporary_custom_smtp"`);
        await queryRunner.query(`DROP TABLE "temporary_custom_smtp"`);
        await queryRunner.query(`CREATE INDEX "IDX_2aa3fc8daa25beec4788d2be26" ON "custom_smtp" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_15a1306132d66c63ef31f7288c" ON "custom_smtp" ("organizationId") `);
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
exports.AlterCustomSmtpTable1668256889786 = AlterCustomSmtpTable1668256889786;
//# sourceMappingURL=1668256889786-AlterCustomSmtpTable.js.map