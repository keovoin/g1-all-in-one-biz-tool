"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterRolePermissionTable1643807301083 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterRolePermissionTable1643807301083 {
    constructor() {
        this.name = 'AlterRolePermissionTable1643807301083';
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
        await queryRunner.query(`ALTER TABLE "role_permission" ADD "description" character varying`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "role_permission" DROP COLUMN "description"`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_e3130a39c1e4a740d044e68573"`);
        await queryRunner.query(`DROP INDEX "IDX_8307c5c44a4ad6210b767b17a9"`);
        await queryRunner.query(`DROP INDEX "IDX_cbd053921056e77c0a8e03122a"`);
        await queryRunner.query(`CREATE TABLE "temporary_role_permission" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "permission" varchar NOT NULL, "enabled" boolean DEFAULT (0), "roleId" varchar NOT NULL, "description" varchar, CONSTRAINT "FK_e3130a39c1e4a740d044e685730" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_cbd053921056e77c0a8e03122af" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_role_permission"("id", "createdAt", "updatedAt", "tenantId", "permission", "enabled", "roleId") SELECT "id", "createdAt", "updatedAt", "tenantId", "permission", "enabled", "roleId" FROM "role_permission"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`ALTER TABLE "temporary_role_permission" RENAME TO "role_permission"`);
        await queryRunner.query(`CREATE INDEX "IDX_e3130a39c1e4a740d044e68573" ON "role_permission" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8307c5c44a4ad6210b767b17a9" ON "role_permission" ("permission") `);
        await queryRunner.query(`CREATE INDEX "IDX_cbd053921056e77c0a8e03122a" ON "role_permission" ("tenantId") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_cbd053921056e77c0a8e03122a"`);
        await queryRunner.query(`DROP INDEX "IDX_8307c5c44a4ad6210b767b17a9"`);
        await queryRunner.query(`DROP INDEX "IDX_e3130a39c1e4a740d044e68573"`);
        await queryRunner.query(`ALTER TABLE "role_permission" RENAME TO "temporary_role_permission"`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "permission" varchar NOT NULL, "enabled" boolean DEFAULT (0), "roleId" varchar NOT NULL, CONSTRAINT "FK_e3130a39c1e4a740d044e685730" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_cbd053921056e77c0a8e03122af" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "role_permission"("id", "createdAt", "updatedAt", "tenantId", "permission", "enabled", "roleId") SELECT "id", "createdAt", "updatedAt", "tenantId", "permission", "enabled", "roleId" FROM "temporary_role_permission"`);
        await queryRunner.query(`DROP TABLE "temporary_role_permission"`);
        await queryRunner.query(`CREATE INDEX "IDX_cbd053921056e77c0a8e03122a" ON "role_permission" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8307c5c44a4ad6210b767b17a9" ON "role_permission" ("permission") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3130a39c1e4a740d044e68573" ON "role_permission" ("roleId") `);
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
exports.AlterRolePermissionTable1643807301083 = AlterRolePermissionTable1643807301083;
//# sourceMappingURL=1643807301083-AlterRolePermissionTable.js.map