"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDocumentAssetColumnToTheOrganizationDocumentTable1680866279166 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddDocumentAssetColumnToTheOrganizationDocumentTable1680866279166 {
    constructor() {
        this.name = 'AddDocumentAssetColumnToTheOrganizationDocumentTable1680866279166';
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
        await queryRunner.query(`ALTER TABLE "organization_document" ADD "documentId" uuid`);
        await queryRunner.query(`ALTER TABLE "organization_document" ALTER COLUMN "documentUrl" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_c129dee7d1cb84e01e69b5e2c6" ON "organization_document" ("documentId") `);
        await queryRunner.query(`ALTER TABLE "organization_document" ADD CONSTRAINT "FK_c129dee7d1cb84e01e69b5e2c66" FOREIGN KEY ("documentId") REFERENCES "image_asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "organization_document" DROP CONSTRAINT "FK_c129dee7d1cb84e01e69b5e2c66"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c129dee7d1cb84e01e69b5e2c6"`);
        await queryRunner.query(`ALTER TABLE "organization_document" ALTER COLUMN "documentUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization_document" DROP COLUMN "documentId"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_1057ec001a4c6b258658143047"`);
        await queryRunner.query(`DROP INDEX "IDX_4bc83945c022a862a33629ff1e"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_document" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "documentUrl" varchar NOT NULL, "documentId" varchar, CONSTRAINT "FK_1057ec001a4c6b258658143047a" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4bc83945c022a862a33629ff1e1" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_document"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl" FROM "organization_document"`);
        await queryRunner.query(`DROP TABLE "organization_document"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_document" RENAME TO "organization_document"`);
        await queryRunner.query(`CREATE INDEX "IDX_1057ec001a4c6b258658143047" ON "organization_document" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4bc83945c022a862a33629ff1e" ON "organization_document" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_1057ec001a4c6b258658143047"`);
        await queryRunner.query(`DROP INDEX "IDX_4bc83945c022a862a33629ff1e"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_document" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "documentUrl" varchar, "documentId" varchar, CONSTRAINT "FK_1057ec001a4c6b258658143047a" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4bc83945c022a862a33629ff1e1" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_document"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl", "documentId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl", "documentId" FROM "organization_document"`);
        await queryRunner.query(`DROP TABLE "organization_document"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_document" RENAME TO "organization_document"`);
        await queryRunner.query(`CREATE INDEX "IDX_1057ec001a4c6b258658143047" ON "organization_document" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4bc83945c022a862a33629ff1e" ON "organization_document" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c129dee7d1cb84e01e69b5e2c6" ON "organization_document" ("documentId") `);
        await queryRunner.query(`DROP INDEX "IDX_1057ec001a4c6b258658143047"`);
        await queryRunner.query(`DROP INDEX "IDX_4bc83945c022a862a33629ff1e"`);
        await queryRunner.query(`DROP INDEX "IDX_c129dee7d1cb84e01e69b5e2c6"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_document" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "documentUrl" varchar, "documentId" varchar, CONSTRAINT "FK_1057ec001a4c6b258658143047a" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4bc83945c022a862a33629ff1e1" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c129dee7d1cb84e01e69b5e2c66" FOREIGN KEY ("documentId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_document"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl", "documentId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl", "documentId" FROM "organization_document"`);
        await queryRunner.query(`DROP TABLE "organization_document"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_document" RENAME TO "organization_document"`);
        await queryRunner.query(`CREATE INDEX "IDX_1057ec001a4c6b258658143047" ON "organization_document" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4bc83945c022a862a33629ff1e" ON "organization_document" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c129dee7d1cb84e01e69b5e2c6" ON "organization_document" ("documentId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_c129dee7d1cb84e01e69b5e2c6"`);
        await queryRunner.query(`DROP INDEX "IDX_4bc83945c022a862a33629ff1e"`);
        await queryRunner.query(`DROP INDEX "IDX_1057ec001a4c6b258658143047"`);
        await queryRunner.query(`ALTER TABLE "organization_document" RENAME TO "temporary_organization_document"`);
        await queryRunner.query(`CREATE TABLE "organization_document" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "documentUrl" varchar, "documentId" varchar, CONSTRAINT "FK_1057ec001a4c6b258658143047a" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4bc83945c022a862a33629ff1e1" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_document"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl", "documentId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl", "documentId" FROM "temporary_organization_document"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_document"`);
        await queryRunner.query(`CREATE INDEX "IDX_c129dee7d1cb84e01e69b5e2c6" ON "organization_document" ("documentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4bc83945c022a862a33629ff1e" ON "organization_document" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1057ec001a4c6b258658143047" ON "organization_document" ("organizationId") `);
        await queryRunner.query(`DROP INDEX "IDX_c129dee7d1cb84e01e69b5e2c6"`);
        await queryRunner.query(`DROP INDEX "IDX_4bc83945c022a862a33629ff1e"`);
        await queryRunner.query(`DROP INDEX "IDX_1057ec001a4c6b258658143047"`);
        await queryRunner.query(`ALTER TABLE "organization_document" RENAME TO "temporary_organization_document"`);
        await queryRunner.query(`CREATE TABLE "organization_document" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "documentUrl" varchar NOT NULL, "documentId" varchar, CONSTRAINT "FK_1057ec001a4c6b258658143047a" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4bc83945c022a862a33629ff1e1" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_document"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl", "documentId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl", "documentId" FROM "temporary_organization_document"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_document"`);
        await queryRunner.query(`CREATE INDEX "IDX_4bc83945c022a862a33629ff1e" ON "organization_document" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1057ec001a4c6b258658143047" ON "organization_document" ("organizationId") `);
        await queryRunner.query(`DROP INDEX "IDX_4bc83945c022a862a33629ff1e"`);
        await queryRunner.query(`DROP INDEX "IDX_1057ec001a4c6b258658143047"`);
        await queryRunner.query(`ALTER TABLE "organization_document" RENAME TO "temporary_organization_document"`);
        await queryRunner.query(`CREATE TABLE "organization_document" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "documentUrl" varchar NOT NULL, CONSTRAINT "FK_1057ec001a4c6b258658143047a" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_4bc83945c022a862a33629ff1e1" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_document"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "documentUrl" FROM "temporary_organization_document"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_document"`);
        await queryRunner.query(`CREATE INDEX "IDX_4bc83945c022a862a33629ff1e" ON "organization_document" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1057ec001a4c6b258658143047" ON "organization_document" ("organizationId") `);
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
exports.AddDocumentAssetColumnToTheOrganizationDocumentTable1680866279166 = AddDocumentAssetColumnToTheOrganizationDocumentTable1680866279166;
//# sourceMappingURL=1680866279166-AddDocumentAssetColumnToTheOrganizationDocumentTable.js.map