"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterWarehouseProductTable1660988196279 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterWarehouseProductTable1660988196279 {
    constructor() {
        this.name = 'AlterWarehouseProductTable1660988196279';
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
        await queryRunner.query(`ALTER TABLE "warehouse_product" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse_product_variant" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" DROP CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" ALTER COLUMN "warehouseId" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_c899e17322d11e1977832e8c65" ON "warehouse_product" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d5f4b64e6a80546fd6dd4ac3ed" ON "warehouse_product_variant" ("organizationId") `);
        await queryRunner.query(`ALTER TABLE "warehouse_product" ADD CONSTRAINT "FK_c899e17322d11e1977832e8c656" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" ADD CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_product_variant" ADD CONSTRAINT "FK_d5f4b64e6a80546fd6dd4ac3ed0" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "warehouse_product_variant" DROP CONSTRAINT "FK_d5f4b64e6a80546fd6dd4ac3ed0"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" DROP CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" DROP CONSTRAINT "FK_c899e17322d11e1977832e8c656"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d5f4b64e6a80546fd6dd4ac3ed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c899e17322d11e1977832e8c65"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" ALTER COLUMN "warehouseId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" ADD CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_product_variant" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" DROP COLUMN "organizationId"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7"`);
        await queryRunner.query(`DROP INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb"`);
        await queryRunner.query(`DROP INDEX "IDX_62573a939f834f2de343f98288"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse_product" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "warehouseId" varchar, "productId" varchar NOT NULL, "organizationId" varchar, CONSTRAINT "FK_3f934c4772e7c7f2c66d7ea4e72" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc" FOREIGN KEY ("warehouseId") REFERENCES "warehouse" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_62573a939f834f2de343f98288c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse_product"("id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId" FROM "warehouse_product"`);
        await queryRunner.query(`DROP TABLE "warehouse_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse_product" RENAME TO "warehouse_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7" ON "warehouse_product" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb" ON "warehouse_product" ("warehouseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_62573a939f834f2de343f98288" ON "warehouse_product" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_617306cb3613dd8d59301ae16f"`);
        await queryRunner.query(`DROP INDEX "IDX_a2f863689d1316810c41c1ea38"`);
        await queryRunner.query(`DROP INDEX "IDX_a1c4a97b928b547c3041d3ac1f"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse_product_variant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "variantId" varchar NOT NULL, "warehouseProductId" varchar NOT NULL, "organizationId" varchar, CONSTRAINT "FK_617306cb3613dd8d59301ae16fd" FOREIGN KEY ("warehouseProductId") REFERENCES "warehouse_product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2f863689d1316810c41c1ea38e" FOREIGN KEY ("variantId") REFERENCES "product_variant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a1c4a97b928b547c3041d3ac1f6" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse_product_variant"("id", "createdAt", "updatedAt", "tenantId", "quantity", "variantId", "warehouseProductId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "variantId", "warehouseProductId" FROM "warehouse_product_variant"`);
        await queryRunner.query(`DROP TABLE "warehouse_product_variant"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse_product_variant" RENAME TO "warehouse_product_variant"`);
        await queryRunner.query(`CREATE INDEX "IDX_617306cb3613dd8d59301ae16f" ON "warehouse_product_variant" ("warehouseProductId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2f863689d1316810c41c1ea38" ON "warehouse_product_variant" ("variantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1c4a97b928b547c3041d3ac1f" ON "warehouse_product_variant" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7"`);
        await queryRunner.query(`DROP INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb"`);
        await queryRunner.query(`DROP INDEX "IDX_62573a939f834f2de343f98288"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse_product" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "warehouseId" varchar, "productId" varchar NOT NULL, "organizationId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse_product"("id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId" FROM "warehouse_product"`);
        await queryRunner.query(`DROP TABLE "warehouse_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse_product" RENAME TO "warehouse_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7" ON "warehouse_product" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb" ON "warehouse_product" ("warehouseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_62573a939f834f2de343f98288" ON "warehouse_product" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7"`);
        await queryRunner.query(`DROP INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb"`);
        await queryRunner.query(`DROP INDEX "IDX_62573a939f834f2de343f98288"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse_product" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "warehouseId" varchar NOT NULL, "productId" varchar NOT NULL, "organizationId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse_product"("id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId" FROM "warehouse_product"`);
        await queryRunner.query(`DROP TABLE "warehouse_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse_product" RENAME TO "warehouse_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7" ON "warehouse_product" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb" ON "warehouse_product" ("warehouseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_62573a939f834f2de343f98288" ON "warehouse_product" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c899e17322d11e1977832e8c65" ON "warehouse_product" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d5f4b64e6a80546fd6dd4ac3ed" ON "warehouse_product_variant" ("organizationId") `);
        await queryRunner.query(`DROP INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7"`);
        await queryRunner.query(`DROP INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb"`);
        await queryRunner.query(`DROP INDEX "IDX_62573a939f834f2de343f98288"`);
        await queryRunner.query(`DROP INDEX "IDX_c899e17322d11e1977832e8c65"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse_product" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "warehouseId" varchar NOT NULL, "productId" varchar NOT NULL, "organizationId" varchar, CONSTRAINT "FK_62573a939f834f2de343f98288c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c899e17322d11e1977832e8c656" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc" FOREIGN KEY ("warehouseId") REFERENCES "warehouse" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_3f934c4772e7c7f2c66d7ea4e72" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse_product"("id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId" FROM "warehouse_product"`);
        await queryRunner.query(`DROP TABLE "warehouse_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse_product" RENAME TO "warehouse_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7" ON "warehouse_product" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb" ON "warehouse_product" ("warehouseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_62573a939f834f2de343f98288" ON "warehouse_product" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c899e17322d11e1977832e8c65" ON "warehouse_product" ("organizationId") `);
        await queryRunner.query(`DROP INDEX "IDX_617306cb3613dd8d59301ae16f"`);
        await queryRunner.query(`DROP INDEX "IDX_a2f863689d1316810c41c1ea38"`);
        await queryRunner.query(`DROP INDEX "IDX_a1c4a97b928b547c3041d3ac1f"`);
        await queryRunner.query(`DROP INDEX "IDX_d5f4b64e6a80546fd6dd4ac3ed"`);
        await queryRunner.query(`CREATE TABLE "temporary_warehouse_product_variant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "variantId" varchar NOT NULL, "warehouseProductId" varchar NOT NULL, "organizationId" varchar, CONSTRAINT "FK_617306cb3613dd8d59301ae16fd" FOREIGN KEY ("warehouseProductId") REFERENCES "warehouse_product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2f863689d1316810c41c1ea38e" FOREIGN KEY ("variantId") REFERENCES "product_variant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a1c4a97b928b547c3041d3ac1f6" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d5f4b64e6a80546fd6dd4ac3ed0" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_warehouse_product_variant"("id", "createdAt", "updatedAt", "tenantId", "quantity", "variantId", "warehouseProductId", "organizationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "variantId", "warehouseProductId", "organizationId" FROM "warehouse_product_variant"`);
        await queryRunner.query(`DROP TABLE "warehouse_product_variant"`);
        await queryRunner.query(`ALTER TABLE "temporary_warehouse_product_variant" RENAME TO "warehouse_product_variant"`);
        await queryRunner.query(`CREATE INDEX "IDX_617306cb3613dd8d59301ae16f" ON "warehouse_product_variant" ("warehouseProductId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2f863689d1316810c41c1ea38" ON "warehouse_product_variant" ("variantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1c4a97b928b547c3041d3ac1f" ON "warehouse_product_variant" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d5f4b64e6a80546fd6dd4ac3ed" ON "warehouse_product_variant" ("organizationId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_d5f4b64e6a80546fd6dd4ac3ed"`);
        await queryRunner.query(`DROP INDEX "IDX_a1c4a97b928b547c3041d3ac1f"`);
        await queryRunner.query(`DROP INDEX "IDX_a2f863689d1316810c41c1ea38"`);
        await queryRunner.query(`DROP INDEX "IDX_617306cb3613dd8d59301ae16f"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product_variant" RENAME TO "temporary_warehouse_product_variant"`);
        await queryRunner.query(`CREATE TABLE "warehouse_product_variant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "variantId" varchar NOT NULL, "warehouseProductId" varchar NOT NULL, "organizationId" varchar, CONSTRAINT "FK_617306cb3613dd8d59301ae16fd" FOREIGN KEY ("warehouseProductId") REFERENCES "warehouse_product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2f863689d1316810c41c1ea38e" FOREIGN KEY ("variantId") REFERENCES "product_variant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a1c4a97b928b547c3041d3ac1f6" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "warehouse_product_variant"("id", "createdAt", "updatedAt", "tenantId", "quantity", "variantId", "warehouseProductId", "organizationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "variantId", "warehouseProductId", "organizationId" FROM "temporary_warehouse_product_variant"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse_product_variant"`);
        await queryRunner.query(`CREATE INDEX "IDX_d5f4b64e6a80546fd6dd4ac3ed" ON "warehouse_product_variant" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1c4a97b928b547c3041d3ac1f" ON "warehouse_product_variant" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2f863689d1316810c41c1ea38" ON "warehouse_product_variant" ("variantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_617306cb3613dd8d59301ae16f" ON "warehouse_product_variant" ("warehouseProductId") `);
        await queryRunner.query(`DROP INDEX "IDX_c899e17322d11e1977832e8c65"`);
        await queryRunner.query(`DROP INDEX "IDX_62573a939f834f2de343f98288"`);
        await queryRunner.query(`DROP INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb"`);
        await queryRunner.query(`DROP INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" RENAME TO "temporary_warehouse_product"`);
        await queryRunner.query(`CREATE TABLE "warehouse_product" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "warehouseId" varchar NOT NULL, "productId" varchar NOT NULL, "organizationId" varchar)`);
        await queryRunner.query(`INSERT INTO "warehouse_product"("id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId" FROM "temporary_warehouse_product"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_c899e17322d11e1977832e8c65" ON "warehouse_product" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_62573a939f834f2de343f98288" ON "warehouse_product" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb" ON "warehouse_product" ("warehouseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7" ON "warehouse_product" ("productId") `);
        await queryRunner.query(`DROP INDEX "IDX_d5f4b64e6a80546fd6dd4ac3ed"`);
        await queryRunner.query(`DROP INDEX "IDX_c899e17322d11e1977832e8c65"`);
        await queryRunner.query(`DROP INDEX "IDX_62573a939f834f2de343f98288"`);
        await queryRunner.query(`DROP INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb"`);
        await queryRunner.query(`DROP INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" RENAME TO "temporary_warehouse_product"`);
        await queryRunner.query(`CREATE TABLE "warehouse_product" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "warehouseId" varchar, "productId" varchar NOT NULL, "organizationId" varchar)`);
        await queryRunner.query(`INSERT INTO "warehouse_product"("id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId" FROM "temporary_warehouse_product"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_62573a939f834f2de343f98288" ON "warehouse_product" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb" ON "warehouse_product" ("warehouseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7" ON "warehouse_product" ("productId") `);
        await queryRunner.query(`DROP INDEX "IDX_62573a939f834f2de343f98288"`);
        await queryRunner.query(`DROP INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb"`);
        await queryRunner.query(`DROP INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" RENAME TO "temporary_warehouse_product"`);
        await queryRunner.query(`CREATE TABLE "warehouse_product" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "warehouseId" varchar, "productId" varchar NOT NULL, "organizationId" varchar, CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc" FOREIGN KEY ("warehouseId") REFERENCES "warehouse" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "warehouse_product"("id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId", "organizationId" FROM "temporary_warehouse_product"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_62573a939f834f2de343f98288" ON "warehouse_product" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb" ON "warehouse_product" ("warehouseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7" ON "warehouse_product" ("productId") `);
        await queryRunner.query(`DROP INDEX "IDX_a1c4a97b928b547c3041d3ac1f"`);
        await queryRunner.query(`DROP INDEX "IDX_a2f863689d1316810c41c1ea38"`);
        await queryRunner.query(`DROP INDEX "IDX_617306cb3613dd8d59301ae16f"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product_variant" RENAME TO "temporary_warehouse_product_variant"`);
        await queryRunner.query(`CREATE TABLE "warehouse_product_variant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "variantId" varchar NOT NULL, "warehouseProductId" varchar NOT NULL, CONSTRAINT "FK_617306cb3613dd8d59301ae16fd" FOREIGN KEY ("warehouseProductId") REFERENCES "warehouse_product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2f863689d1316810c41c1ea38e" FOREIGN KEY ("variantId") REFERENCES "product_variant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a1c4a97b928b547c3041d3ac1f6" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "warehouse_product_variant"("id", "createdAt", "updatedAt", "tenantId", "quantity", "variantId", "warehouseProductId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "variantId", "warehouseProductId" FROM "temporary_warehouse_product_variant"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse_product_variant"`);
        await queryRunner.query(`CREATE INDEX "IDX_a1c4a97b928b547c3041d3ac1f" ON "warehouse_product_variant" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2f863689d1316810c41c1ea38" ON "warehouse_product_variant" ("variantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_617306cb3613dd8d59301ae16f" ON "warehouse_product_variant" ("warehouseProductId") `);
        await queryRunner.query(`DROP INDEX "IDX_62573a939f834f2de343f98288"`);
        await queryRunner.query(`DROP INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb"`);
        await queryRunner.query(`DROP INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7"`);
        await queryRunner.query(`ALTER TABLE "warehouse_product" RENAME TO "temporary_warehouse_product"`);
        await queryRunner.query(`CREATE TABLE "warehouse_product" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "quantity" numeric DEFAULT (0), "warehouseId" varchar, "productId" varchar NOT NULL, CONSTRAINT "FK_3f934c4772e7c7f2c66d7ea4e72" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a8c9aee14d47ec7b3f2ac429ebc" FOREIGN KEY ("warehouseId") REFERENCES "warehouse" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_62573a939f834f2de343f98288c" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "warehouse_product"("id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId") SELECT "id", "createdAt", "updatedAt", "tenantId", "quantity", "warehouseId", "productId" FROM "temporary_warehouse_product"`);
        await queryRunner.query(`DROP TABLE "temporary_warehouse_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_62573a939f834f2de343f98288" ON "warehouse_product" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8c9aee14d47ec7b3f2ac429eb" ON "warehouse_product" ("warehouseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f934c4772e7c7f2c66d7ea4e7" ON "warehouse_product" ("productId") `);
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
exports.AlterWarehouseProductTable1660988196279 = AlterWarehouseProductTable1660988196279;
//# sourceMappingURL=1660988196279-AlterWarehouseProductTable.js.map