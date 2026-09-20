"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterUserTableEmailVerificationColumns1669033406667 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterUserTableEmailVerificationColumns1669033406667 {
    constructor() {
        this.name = 'AlterUserTableEmailVerificationColumns1669033406667';
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
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerifiedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailToken" character varying`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerifiedAt"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_c28e52f758e7bbc53828db9219"`);
        await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`);
        await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`);
        await queryRunner.query(`DROP INDEX "IDX_19de43e9f1842360ce646253d7"`);
        await queryRunner.query(`DROP INDEX "IDX_685bf353c85f23b6f848e4dcde"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "thirdPartyId" varchar, "firstName" varchar, "lastName" varchar, "email" varchar, "username" varchar, "hash" varchar, "imageUrl" varchar(500), "preferredLanguage" varchar DEFAULT ('en'), "preferredComponentLayout" varchar CHECK( "preferredComponentLayout" IN ('CARDS_GRID','TABLE') ) DEFAULT ('TABLE'), "roleId" varchar, "refreshToken" varchar, "isActive" boolean DEFAULT (1), "code" integer, "codeExpireAt" datetime, "emailVerifiedAt" datetime, "emailToken" varchar, CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_685bf353c85f23b6f848e4dcded" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt") SELECT "id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE INDEX "IDX_c28e52f758e7bbc53828db9219" ON "user" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `);
        await queryRunner.query(`CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `);
        await queryRunner.query(`CREATE INDEX "IDX_19de43e9f1842360ce646253d7" ON "user" ("thirdPartyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_685bf353c85f23b6f848e4dcde" ON "user" ("tenantId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_685bf353c85f23b6f848e4dcde"`);
        await queryRunner.query(`DROP INDEX "IDX_19de43e9f1842360ce646253d7"`);
        await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`);
        await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP INDEX "IDX_c28e52f758e7bbc53828db9219"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "thirdPartyId" varchar, "firstName" varchar, "lastName" varchar, "email" varchar, "username" varchar, "hash" varchar, "imageUrl" varchar(500), "preferredLanguage" varchar DEFAULT ('en'), "preferredComponentLayout" varchar CHECK( "preferredComponentLayout" IN ('CARDS_GRID','TABLE') ) DEFAULT ('TABLE'), "roleId" varchar, "refreshToken" varchar, "isActive" boolean DEFAULT (1), "code" integer, "codeExpireAt" datetime, CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_685bf353c85f23b6f848e4dcded" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt") SELECT "id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_685bf353c85f23b6f848e4dcde" ON "user" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_19de43e9f1842360ce646253d7" ON "user" ("thirdPartyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_c28e52f758e7bbc53828db9219" ON "user" ("roleId") `);
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
exports.AlterUserTableEmailVerificationColumns1669033406667 = AlterUserTableEmailVerificationColumns1669033406667;
//# sourceMappingURL=1669033406667-AlterUserTableEmailVerificationColumns.js.map