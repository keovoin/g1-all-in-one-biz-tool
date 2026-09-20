"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePasswordResetTable1639729354753 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class CreatePasswordResetTable1639729354753 {
    constructor() {
        this.name = 'CreatePasswordResetTable1639729354753';
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
        await queryRunner.query(`CREATE TABLE "password_reset" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1c88db6e50f0704688d1f1978c" ON "password_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_36e929b98372d961bb63bd4b4e" ON "password_reset" ("token") `);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "latitude" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "longitude" TYPE double precision`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "longitude" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "latitude" TYPE double precision`);
        await queryRunner.query(`DROP INDEX "public"."IDX_36e929b98372d961bb63bd4b4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c88db6e50f0704688d1f1978c"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "password_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "token" varchar NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_1c88db6e50f0704688d1f1978c" ON "password_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_36e929b98372d961bb63bd4b4e" ON "password_reset" ("token") `);
        await queryRunner.query(`DROP INDEX "IDX_7719d73cd16a9f57ecc6ac24b3"`);
        await queryRunner.query(`DROP INDEX "IDX_60468af1ce34043a900809c84f"`);
        await queryRunner.query(`CREATE TABLE "temporary_contact" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar, "firstName" varchar, "lastName" varchar, "country" varchar, "city" varchar, "address" varchar, "address2" varchar, "postcode" varchar, "latitude" float, "longitude" float, "regionCode" varchar, "fax" varchar, "fiscalInformation" varchar, "website" varchar, CONSTRAINT "FK_7719d73cd16a9f57ecc6ac24b3d" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_60468af1ce34043a900809c84f2" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_contact"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "firstName", "lastName", "country", "city", "address", "address2", "postcode", "latitude", "longitude", "regionCode", "fax", "fiscalInformation", "website") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "firstName", "lastName", "country", "city", "address", "address2", "postcode", "latitude", "longitude", "regionCode", "fax", "fiscalInformation", "website" FROM "contact"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`ALTER TABLE "temporary_contact" RENAME TO "contact"`);
        await queryRunner.query(`CREATE INDEX "IDX_7719d73cd16a9f57ecc6ac24b3" ON "contact" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_60468af1ce34043a900809c84f" ON "contact" ("tenantId") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_60468af1ce34043a900809c84f"`);
        await queryRunner.query(`DROP INDEX "IDX_7719d73cd16a9f57ecc6ac24b3"`);
        await queryRunner.query(`ALTER TABLE "contact" RENAME TO "temporary_contact"`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar, "firstName" varchar, "lastName" varchar, "country" varchar, "city" varchar, "address" varchar, "address2" varchar, "postcode" varchar, "latitude" float, "longitude" float, "regionCode" varchar, "fax" varchar, "fiscalInformation" varchar, "website" varchar, CONSTRAINT "FK_7719d73cd16a9f57ecc6ac24b3d" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_60468af1ce34043a900809c84f2" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "contact"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "firstName", "lastName", "country", "city", "address", "address2", "postcode", "latitude", "longitude", "regionCode", "fax", "fiscalInformation", "website") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "firstName", "lastName", "country", "city", "address", "address2", "postcode", "latitude", "longitude", "regionCode", "fax", "fiscalInformation", "website" FROM "temporary_contact"`);
        await queryRunner.query(`DROP TABLE "temporary_contact"`);
        await queryRunner.query(`CREATE INDEX "IDX_60468af1ce34043a900809c84f" ON "contact" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7719d73cd16a9f57ecc6ac24b3" ON "contact" ("organizationId") `);
        await queryRunner.query(`DROP INDEX "IDX_36e929b98372d961bb63bd4b4e"`);
        await queryRunner.query(`DROP INDEX "IDX_1c88db6e50f0704688d1f1978c"`);
        await queryRunner.query(`DROP TABLE "password_reset"`);
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
exports.CreatePasswordResetTable1639729354753 = CreatePasswordResetTable1639729354753;
//# sourceMappingURL=1639729354753-CreatePasswordResetTable.js.map