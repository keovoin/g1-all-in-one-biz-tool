"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterScreenshotTable1646117679347 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterScreenshotTable1646117679347 {
    constructor() {
        this.name = 'AlterScreenshotTable1646117679347';
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
        await queryRunner.query(`CREATE TYPE "public"."screenshot_storageprovider_enum" AS ENUM('LOCAL', 'S3', 'WASABI')`);
        await queryRunner.query(`ALTER TABLE "screenshot" ADD "storageProvider" "public"."screenshot_storageprovider_enum"`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "screenshot" DROP COLUMN "storageProvider"`);
        await queryRunner.query(`DROP TYPE "public"."screenshot_storageprovider_enum"`);
    }
    /**
   * SqliteDB Up Migration
   *
   * @param queryRunner
   */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_5b594d02d98d5defcde323abe5"`);
        await queryRunner.query(`DROP INDEX "IDX_0951aacffe3f8d0cff54cf2f34"`);
        await queryRunner.query(`DROP INDEX "IDX_235004f3dafac90692cd64d915"`);
        await queryRunner.query(`CREATE TABLE "temporary_screenshot" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "file" varchar NOT NULL, "thumb" varchar, "recordedAt" datetime, "deletedAt" datetime, "timeSlotId" varchar, "storageProvider" varchar CHECK( storageProvider IN ('LOCAL','S3','WASABI') ), CONSTRAINT "FK_5b594d02d98d5defcde323abe5b" FOREIGN KEY ("timeSlotId") REFERENCES "time_slot" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_0951aacffe3f8d0cff54cf2f341" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_235004f3dafac90692cd64d9158" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_screenshot"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "file", "thumb", "recordedAt", "deletedAt", "timeSlotId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "file", "thumb", "recordedAt", "deletedAt", "timeSlotId" FROM "screenshot"`);
        await queryRunner.query(`DROP TABLE "screenshot"`);
        await queryRunner.query(`ALTER TABLE "temporary_screenshot" RENAME TO "screenshot"`);
        await queryRunner.query(`CREATE INDEX "IDX_5b594d02d98d5defcde323abe5" ON "screenshot" ("timeSlotId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0951aacffe3f8d0cff54cf2f34" ON "screenshot" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_235004f3dafac90692cd64d915" ON "screenshot" ("tenantId") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_235004f3dafac90692cd64d915"`);
        await queryRunner.query(`DROP INDEX "IDX_0951aacffe3f8d0cff54cf2f34"`);
        await queryRunner.query(`DROP INDEX "IDX_5b594d02d98d5defcde323abe5"`);
        await queryRunner.query(`ALTER TABLE "screenshot" RENAME TO "temporary_screenshot"`);
        await queryRunner.query(`CREATE TABLE "screenshot" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "file" varchar NOT NULL, "thumb" varchar, "recordedAt" datetime, "deletedAt" datetime, "timeSlotId" varchar, CONSTRAINT "FK_5b594d02d98d5defcde323abe5b" FOREIGN KEY ("timeSlotId") REFERENCES "time_slot" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_0951aacffe3f8d0cff54cf2f341" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_235004f3dafac90692cd64d9158" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "screenshot"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "file", "thumb", "recordedAt", "deletedAt", "timeSlotId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "file", "thumb", "recordedAt", "deletedAt", "timeSlotId" FROM "temporary_screenshot"`);
        await queryRunner.query(`DROP TABLE "temporary_screenshot"`);
        await queryRunner.query(`CREATE INDEX "IDX_235004f3dafac90692cd64d915" ON "screenshot" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0951aacffe3f8d0cff54cf2f34" ON "screenshot" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5b594d02d98d5defcde323abe5" ON "screenshot" ("timeSlotId") `);
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
exports.AlterScreenshotTable1646117679347 = AlterScreenshotTable1646117679347;
//# sourceMappingURL=1646117679347-AlterScreenshotTable.js.map