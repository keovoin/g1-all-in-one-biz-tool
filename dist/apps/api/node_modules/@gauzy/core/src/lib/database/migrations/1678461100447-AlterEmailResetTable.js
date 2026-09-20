"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterEmailResetTable1678461100447 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterEmailResetTable1678461100447 {
    constructor() {
        this.name = 'AlterEmailResetTable1678461100447';
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
        await queryRunner.query(`ALTER TABLE "email_reset" DROP CONSTRAINT "FK_e37af4ab2ba0bf268bfd9826345"`);
        await queryRunner.query(`ALTER TABLE "email_reset" ADD "token" character varying`);
        await queryRunner.query(`ALTER TABLE "email_reset" ADD "expiredAt" TIMESTAMP`);
        await queryRunner.query(`CREATE INDEX "IDX_4ac734f2a1a3c055dca04fba99" ON "email_reset" ("token") `);
        await queryRunner.query(`ALTER TABLE "email_reset" ADD CONSTRAINT "FK_e37af4ab2ba0bf268bfd9826345" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "email_reset" DROP CONSTRAINT "FK_e37af4ab2ba0bf268bfd9826345"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4ac734f2a1a3c055dca04fba99"`);
        await queryRunner.query(`ALTER TABLE "email_reset" DROP COLUMN "expiredAt"`);
        await queryRunner.query(`ALTER TABLE "email_reset" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "email_reset" ADD CONSTRAINT "FK_e37af4ab2ba0bf268bfd9826345" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_e37af4ab2ba0bf268bfd982634"`);
        await queryRunner.query(`DROP INDEX "IDX_9e80c9ec749dfda6dbe2cd9704"`);
        await queryRunner.query(`DROP INDEX "IDX_4be518a169bbcbfe92025ac574"`);
        await queryRunner.query(`DROP INDEX "IDX_03d16a2fd43d7c601743440212"`);
        await queryRunner.query(`DROP INDEX "IDX_93799dfaeff51de06f1e02ac41"`);
        await queryRunner.query(`CREATE TABLE "temporary_email_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "email" varchar NOT NULL, "oldEmail" varchar NOT NULL, "code" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_93799dfaeff51de06f1e02ac414" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_email_reset"("id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId") SELECT "id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId" FROM "email_reset"`);
        await queryRunner.query(`DROP TABLE "email_reset"`);
        await queryRunner.query(`ALTER TABLE "temporary_email_reset" RENAME TO "email_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_e37af4ab2ba0bf268bfd982634" ON "email_reset" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e80c9ec749dfda6dbe2cd9704" ON "email_reset" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be518a169bbcbfe92025ac574" ON "email_reset" ("oldEmail") `);
        await queryRunner.query(`CREATE INDEX "IDX_03d16a2fd43d7c601743440212" ON "email_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_93799dfaeff51de06f1e02ac41" ON "email_reset" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_e37af4ab2ba0bf268bfd982634"`);
        await queryRunner.query(`DROP INDEX "IDX_9e80c9ec749dfda6dbe2cd9704"`);
        await queryRunner.query(`DROP INDEX "IDX_4be518a169bbcbfe92025ac574"`);
        await queryRunner.query(`DROP INDEX "IDX_03d16a2fd43d7c601743440212"`);
        await queryRunner.query(`DROP INDEX "IDX_93799dfaeff51de06f1e02ac41"`);
        await queryRunner.query(`CREATE TABLE "temporary_email_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "email" varchar NOT NULL, "oldEmail" varchar NOT NULL, "code" integer NOT NULL, "userId" varchar, "token" varchar, "expiredAt" datetime, CONSTRAINT "FK_93799dfaeff51de06f1e02ac414" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_email_reset"("id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId") SELECT "id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId" FROM "email_reset"`);
        await queryRunner.query(`DROP TABLE "email_reset"`);
        await queryRunner.query(`ALTER TABLE "temporary_email_reset" RENAME TO "email_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_e37af4ab2ba0bf268bfd982634" ON "email_reset" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e80c9ec749dfda6dbe2cd9704" ON "email_reset" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be518a169bbcbfe92025ac574" ON "email_reset" ("oldEmail") `);
        await queryRunner.query(`CREATE INDEX "IDX_03d16a2fd43d7c601743440212" ON "email_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_93799dfaeff51de06f1e02ac41" ON "email_reset" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4ac734f2a1a3c055dca04fba99" ON "email_reset" ("token") `);
        await queryRunner.query(`DROP INDEX "IDX_e37af4ab2ba0bf268bfd982634"`);
        await queryRunner.query(`DROP INDEX "IDX_9e80c9ec749dfda6dbe2cd9704"`);
        await queryRunner.query(`DROP INDEX "IDX_4be518a169bbcbfe92025ac574"`);
        await queryRunner.query(`DROP INDEX "IDX_03d16a2fd43d7c601743440212"`);
        await queryRunner.query(`DROP INDEX "IDX_93799dfaeff51de06f1e02ac41"`);
        await queryRunner.query(`DROP INDEX "IDX_4ac734f2a1a3c055dca04fba99"`);
        await queryRunner.query(`CREATE TABLE "temporary_email_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "email" varchar NOT NULL, "oldEmail" varchar NOT NULL, "code" integer NOT NULL, "userId" varchar, "token" varchar, "expiredAt" datetime, CONSTRAINT "FK_93799dfaeff51de06f1e02ac414" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_e37af4ab2ba0bf268bfd9826345" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_email_reset"("id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId", "token", "expiredAt") SELECT "id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId", "token", "expiredAt" FROM "email_reset"`);
        await queryRunner.query(`DROP TABLE "email_reset"`);
        await queryRunner.query(`ALTER TABLE "temporary_email_reset" RENAME TO "email_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_e37af4ab2ba0bf268bfd982634" ON "email_reset" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e80c9ec749dfda6dbe2cd9704" ON "email_reset" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be518a169bbcbfe92025ac574" ON "email_reset" ("oldEmail") `);
        await queryRunner.query(`CREATE INDEX "IDX_03d16a2fd43d7c601743440212" ON "email_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_93799dfaeff51de06f1e02ac41" ON "email_reset" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4ac734f2a1a3c055dca04fba99" ON "email_reset" ("token") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_4ac734f2a1a3c055dca04fba99"`);
        await queryRunner.query(`DROP INDEX "IDX_93799dfaeff51de06f1e02ac41"`);
        await queryRunner.query(`DROP INDEX "IDX_03d16a2fd43d7c601743440212"`);
        await queryRunner.query(`DROP INDEX "IDX_4be518a169bbcbfe92025ac574"`);
        await queryRunner.query(`DROP INDEX "IDX_9e80c9ec749dfda6dbe2cd9704"`);
        await queryRunner.query(`DROP INDEX "IDX_e37af4ab2ba0bf268bfd982634"`);
        await queryRunner.query(`ALTER TABLE "email_reset" RENAME TO "temporary_email_reset"`);
        await queryRunner.query(`CREATE TABLE "email_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "email" varchar NOT NULL, "oldEmail" varchar NOT NULL, "code" integer NOT NULL, "userId" varchar, "token" varchar, "expiredAt" datetime, CONSTRAINT "FK_93799dfaeff51de06f1e02ac414" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "email_reset"("id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId", "token", "expiredAt") SELECT "id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId", "token", "expiredAt" FROM "temporary_email_reset"`);
        await queryRunner.query(`DROP TABLE "temporary_email_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_4ac734f2a1a3c055dca04fba99" ON "email_reset" ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_93799dfaeff51de06f1e02ac41" ON "email_reset" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03d16a2fd43d7c601743440212" ON "email_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be518a169bbcbfe92025ac574" ON "email_reset" ("oldEmail") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e80c9ec749dfda6dbe2cd9704" ON "email_reset" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_e37af4ab2ba0bf268bfd982634" ON "email_reset" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_4ac734f2a1a3c055dca04fba99"`);
        await queryRunner.query(`DROP INDEX "IDX_93799dfaeff51de06f1e02ac41"`);
        await queryRunner.query(`DROP INDEX "IDX_03d16a2fd43d7c601743440212"`);
        await queryRunner.query(`DROP INDEX "IDX_4be518a169bbcbfe92025ac574"`);
        await queryRunner.query(`DROP INDEX "IDX_9e80c9ec749dfda6dbe2cd9704"`);
        await queryRunner.query(`DROP INDEX "IDX_e37af4ab2ba0bf268bfd982634"`);
        await queryRunner.query(`ALTER TABLE "email_reset" RENAME TO "temporary_email_reset"`);
        await queryRunner.query(`CREATE TABLE "email_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "email" varchar NOT NULL, "oldEmail" varchar NOT NULL, "code" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_93799dfaeff51de06f1e02ac414" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "email_reset"("id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId") SELECT "id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId" FROM "temporary_email_reset"`);
        await queryRunner.query(`DROP TABLE "temporary_email_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_93799dfaeff51de06f1e02ac41" ON "email_reset" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03d16a2fd43d7c601743440212" ON "email_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be518a169bbcbfe92025ac574" ON "email_reset" ("oldEmail") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e80c9ec749dfda6dbe2cd9704" ON "email_reset" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_e37af4ab2ba0bf268bfd982634" ON "email_reset" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_93799dfaeff51de06f1e02ac41"`);
        await queryRunner.query(`DROP INDEX "IDX_03d16a2fd43d7c601743440212"`);
        await queryRunner.query(`DROP INDEX "IDX_4be518a169bbcbfe92025ac574"`);
        await queryRunner.query(`DROP INDEX "IDX_9e80c9ec749dfda6dbe2cd9704"`);
        await queryRunner.query(`DROP INDEX "IDX_e37af4ab2ba0bf268bfd982634"`);
        await queryRunner.query(`ALTER TABLE "email_reset" RENAME TO "temporary_email_reset"`);
        await queryRunner.query(`CREATE TABLE "email_reset" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "email" varchar NOT NULL, "oldEmail" varchar NOT NULL, "code" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_e37af4ab2ba0bf268bfd9826345" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_93799dfaeff51de06f1e02ac414" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "email_reset"("id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId") SELECT "id", "createdAt", "updatedAt", "tenantId", "email", "oldEmail", "code", "userId" FROM "temporary_email_reset"`);
        await queryRunner.query(`DROP TABLE "temporary_email_reset"`);
        await queryRunner.query(`CREATE INDEX "IDX_93799dfaeff51de06f1e02ac41" ON "email_reset" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03d16a2fd43d7c601743440212" ON "email_reset" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be518a169bbcbfe92025ac574" ON "email_reset" ("oldEmail") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e80c9ec749dfda6dbe2cd9704" ON "email_reset" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_e37af4ab2ba0bf268bfd982634" ON "email_reset" ("userId") `);
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
exports.AlterEmailResetTable1678461100447 = AlterEmailResetTable1678461100447;
//# sourceMappingURL=1678461100447-AlterEmailResetTable.js.map