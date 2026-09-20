"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterChangelogTable1650704972412 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterChangelogTable1650704972412 {
    constructor() {
        this.name = 'AlterChangelogTable1650704972412';
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
        await queryRunner.query(`ALTER TABLE "changelog" ADD "isFeature" boolean`);
        await queryRunner.query(`ALTER TABLE "changelog" ADD "imageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "changelog" ALTER COLUMN "learnMoreUrl" DROP NOT NULL`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "changelog" ALTER COLUMN "learnMoreUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "changelog" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "changelog" DROP COLUMN "isFeature"`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_c2037b621d2e8023898aee4ac7"`);
        await queryRunner.query(`DROP INDEX "IDX_744268ee0ec6073883267bc3b6"`);
        await queryRunner.query(`CREATE TABLE "temporary_changelog" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "icon" varchar, "title" varchar, "date" datetime NOT NULL, "content" varchar NOT NULL, "learnMoreUrl" varchar NOT NULL, "isFeature" boolean, "imageUrl" varchar, CONSTRAINT "FK_c2037b621d2e8023898aee4ac74" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_744268ee0ec6073883267bc3b66" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_changelog"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "icon", "title", "date", "content", "learnMoreUrl") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "icon", "title", "date", "content", "learnMoreUrl" FROM "changelog"`);
        await queryRunner.query(`DROP TABLE "changelog"`);
        await queryRunner.query(`ALTER TABLE "temporary_changelog" RENAME TO "changelog"`);
        await queryRunner.query(`CREATE INDEX "IDX_c2037b621d2e8023898aee4ac7" ON "changelog" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_744268ee0ec6073883267bc3b6" ON "changelog" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_c2037b621d2e8023898aee4ac7"`);
        await queryRunner.query(`DROP INDEX "IDX_744268ee0ec6073883267bc3b6"`);
        await queryRunner.query(`CREATE TABLE "temporary_changelog" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "icon" varchar, "title" varchar, "date" datetime NOT NULL, "content" varchar NOT NULL, "learnMoreUrl" varchar, "isFeature" boolean, "imageUrl" varchar, CONSTRAINT "FK_c2037b621d2e8023898aee4ac74" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_744268ee0ec6073883267bc3b66" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_changelog"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "icon", "title", "date", "content", "learnMoreUrl", "isFeature", "imageUrl") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "icon", "title", "date", "content", "learnMoreUrl", "isFeature", "imageUrl" FROM "changelog"`);
        await queryRunner.query(`DROP TABLE "changelog"`);
        await queryRunner.query(`ALTER TABLE "temporary_changelog" RENAME TO "changelog"`);
        await queryRunner.query(`CREATE INDEX "IDX_c2037b621d2e8023898aee4ac7" ON "changelog" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_744268ee0ec6073883267bc3b6" ON "changelog" ("tenantId") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_744268ee0ec6073883267bc3b6"`);
        await queryRunner.query(`DROP INDEX "IDX_c2037b621d2e8023898aee4ac7"`);
        await queryRunner.query(`ALTER TABLE "changelog" RENAME TO "temporary_changelog"`);
        await queryRunner.query(`CREATE TABLE "changelog" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "icon" varchar, "title" varchar, "date" datetime NOT NULL, "content" varchar NOT NULL, "learnMoreUrl" varchar NOT NULL, "isFeature" boolean, "imageUrl" varchar, CONSTRAINT "FK_c2037b621d2e8023898aee4ac74" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_744268ee0ec6073883267bc3b66" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "changelog"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "icon", "title", "date", "content", "learnMoreUrl", "isFeature", "imageUrl") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "icon", "title", "date", "content", "learnMoreUrl", "isFeature", "imageUrl" FROM "temporary_changelog"`);
        await queryRunner.query(`DROP TABLE "temporary_changelog"`);
        await queryRunner.query(`CREATE INDEX "IDX_744268ee0ec6073883267bc3b6" ON "changelog" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c2037b621d2e8023898aee4ac7" ON "changelog" ("organizationId") `);
        await queryRunner.query(`DROP INDEX "IDX_744268ee0ec6073883267bc3b6"`);
        await queryRunner.query(`DROP INDEX "IDX_c2037b621d2e8023898aee4ac7"`);
        await queryRunner.query(`ALTER TABLE "changelog" RENAME TO "temporary_changelog"`);
        await queryRunner.query(`CREATE TABLE "changelog" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "icon" varchar, "title" varchar, "date" datetime NOT NULL, "content" varchar NOT NULL, "learnMoreUrl" varchar NOT NULL, CONSTRAINT "FK_c2037b621d2e8023898aee4ac74" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_744268ee0ec6073883267bc3b66" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "changelog"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "icon", "title", "date", "content", "learnMoreUrl") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "icon", "title", "date", "content", "learnMoreUrl" FROM "temporary_changelog"`);
        await queryRunner.query(`DROP TABLE "temporary_changelog"`);
        await queryRunner.query(`CREATE INDEX "IDX_744268ee0ec6073883267bc3b6" ON "changelog" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c2037b621d2e8023898aee4ac7" ON "changelog" ("organizationId") `);
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
exports.AlterChangelogTable1650704972412 = AlterChangelogTable1650704972412;
//# sourceMappingURL=1650704972412-AlterChangelogTable.js.map