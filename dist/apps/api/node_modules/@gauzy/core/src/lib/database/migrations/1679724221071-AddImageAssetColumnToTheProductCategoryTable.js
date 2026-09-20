"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddImageAssetColumnToTheProductCategoryTable1679724221071 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddImageAssetColumnToTheProductCategoryTable1679724221071 {
    constructor() {
        this.name = 'AddImageAssetColumnToTheProductCategoryTable1679724221071';
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
        await queryRunner.query(`ALTER TABLE "product_category" ADD "imageId" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_f38e86bd280ff9c9c7d9cb7839" ON "product_category" ("imageId") `);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_f38e86bd280ff9c9c7d9cb78393" FOREIGN KEY ("imageId") REFERENCES "image_asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_f38e86bd280ff9c9c7d9cb78393"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f38e86bd280ff9c9c7d9cb7839"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP COLUMN "imageId"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_853302351eaa4daa39920c270a"`);
        await queryRunner.query(`DROP INDEX "IDX_0a0cf25cd8232a154d1cce2641"`);
        await queryRunner.query(`CREATE TABLE "temporary_product_category" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "imageUrl" varchar, "imageId" varchar, CONSTRAINT "FK_853302351eaa4daa39920c270a9" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_0a0cf25cd8232a154d1cce2641c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product_category"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "imageUrl") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "imageUrl" FROM "product_category"`);
        await queryRunner.query(`DROP TABLE "product_category"`);
        await queryRunner.query(`ALTER TABLE "temporary_product_category" RENAME TO "product_category"`);
        await queryRunner.query(`CREATE INDEX "IDX_853302351eaa4daa39920c270a" ON "product_category" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a0cf25cd8232a154d1cce2641" ON "product_category" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f38e86bd280ff9c9c7d9cb7839" ON "product_category" ("imageId") `);
        await queryRunner.query(`DROP INDEX "IDX_853302351eaa4daa39920c270a"`);
        await queryRunner.query(`DROP INDEX "IDX_0a0cf25cd8232a154d1cce2641"`);
        await queryRunner.query(`DROP INDEX "IDX_f38e86bd280ff9c9c7d9cb7839"`);
        await queryRunner.query(`CREATE TABLE "temporary_product_category" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "imageUrl" varchar, "imageId" varchar, CONSTRAINT "FK_853302351eaa4daa39920c270a9" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_0a0cf25cd8232a154d1cce2641c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_f38e86bd280ff9c9c7d9cb78393" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product_category"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "imageUrl", "imageId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "imageUrl", "imageId" FROM "product_category"`);
        await queryRunner.query(`DROP TABLE "product_category"`);
        await queryRunner.query(`ALTER TABLE "temporary_product_category" RENAME TO "product_category"`);
        await queryRunner.query(`CREATE INDEX "IDX_853302351eaa4daa39920c270a" ON "product_category" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a0cf25cd8232a154d1cce2641" ON "product_category" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f38e86bd280ff9c9c7d9cb7839" ON "product_category" ("imageId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_f38e86bd280ff9c9c7d9cb7839"`);
        await queryRunner.query(`DROP INDEX "IDX_0a0cf25cd8232a154d1cce2641"`);
        await queryRunner.query(`DROP INDEX "IDX_853302351eaa4daa39920c270a"`);
        await queryRunner.query(`ALTER TABLE "product_category" RENAME TO "temporary_product_category"`);
        await queryRunner.query(`CREATE TABLE "product_category" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "imageUrl" varchar, "imageId" varchar, CONSTRAINT "FK_853302351eaa4daa39920c270a9" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_0a0cf25cd8232a154d1cce2641c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "product_category"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "imageUrl", "imageId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "imageUrl", "imageId" FROM "temporary_product_category"`);
        await queryRunner.query(`DROP TABLE "temporary_product_category"`);
        await queryRunner.query(`CREATE INDEX "IDX_f38e86bd280ff9c9c7d9cb7839" ON "product_category" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a0cf25cd8232a154d1cce2641" ON "product_category" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_853302351eaa4daa39920c270a" ON "product_category" ("organizationId") `);
        await queryRunner.query(`DROP INDEX "IDX_f38e86bd280ff9c9c7d9cb7839"`);
        await queryRunner.query(`DROP INDEX "IDX_0a0cf25cd8232a154d1cce2641"`);
        await queryRunner.query(`DROP INDEX "IDX_853302351eaa4daa39920c270a"`);
        await queryRunner.query(`ALTER TABLE "product_category" RENAME TO "temporary_product_category"`);
        await queryRunner.query(`CREATE TABLE "product_category" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "imageUrl" varchar, CONSTRAINT "FK_853302351eaa4daa39920c270a9" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_0a0cf25cd8232a154d1cce2641c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "product_category"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "imageUrl") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "imageUrl" FROM "temporary_product_category"`);
        await queryRunner.query(`DROP TABLE "temporary_product_category"`);
        await queryRunner.query(`CREATE INDEX "IDX_0a0cf25cd8232a154d1cce2641" ON "product_category" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_853302351eaa4daa39920c270a" ON "product_category" ("organizationId") `);
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
exports.AddImageAssetColumnToTheProductCategoryTable1679724221071 = AddImageAssetColumnToTheProductCategoryTable1679724221071;
//# sourceMappingURL=1679724221071-AddImageAssetColumnToTheProductCategoryTable.js.map