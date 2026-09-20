"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterTagTable1677142065591 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterTagTable1677142065591 {
    constructor() {
        this.name = 'AlterTagTable1677142065591';
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
        await queryRunner.query(`ALTER TABLE "tag" ADD "icon" character varying`);
        await queryRunner.query(`ALTER TABLE "tag" ADD "organizationTeamId" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_49746602acc4e5e8721062b69e" ON "tag" ("organizationTeamId") `);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_49746602acc4e5e8721062b69ec" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_49746602acc4e5e8721062b69ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_49746602acc4e5e8721062b69e"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "organizationTeamId"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "icon"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_c2f6bec0b39eaa3a6d90903ae9"`);
        await queryRunner.query(`DROP INDEX "IDX_b08dd29fb6a8acdf83c83d8988"`);
        await queryRunner.query(`CREATE TABLE "temporary_tag" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "description" varchar, "color" varchar NOT NULL, "isSystem" boolean NOT NULL DEFAULT (0), "icon" varchar, "organizationTeamId" varchar, CONSTRAINT "FK_c2f6bec0b39eaa3a6d90903ae99" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_b08dd29fb6a8acdf83c83d8988f" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tag"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "description", "color", "isSystem") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "description", "color", "isSystem" FROM "tag"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`ALTER TABLE "temporary_tag" RENAME TO "tag"`);
        await queryRunner.query(`CREATE INDEX "IDX_c2f6bec0b39eaa3a6d90903ae9" ON "tag" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b08dd29fb6a8acdf83c83d8988" ON "tag" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_49746602acc4e5e8721062b69e" ON "tag" ("organizationTeamId") `);
        await queryRunner.query(`DROP INDEX "IDX_c2f6bec0b39eaa3a6d90903ae9"`);
        await queryRunner.query(`DROP INDEX "IDX_b08dd29fb6a8acdf83c83d8988"`);
        await queryRunner.query(`DROP INDEX "IDX_49746602acc4e5e8721062b69e"`);
        await queryRunner.query(`CREATE TABLE "temporary_tag" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "description" varchar, "color" varchar NOT NULL, "isSystem" boolean NOT NULL DEFAULT (0), "icon" varchar, "organizationTeamId" varchar, CONSTRAINT "FK_c2f6bec0b39eaa3a6d90903ae99" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_b08dd29fb6a8acdf83c83d8988f" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_49746602acc4e5e8721062b69ec" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tag"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "description", "color", "isSystem", "icon", "organizationTeamId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "description", "color", "isSystem", "icon", "organizationTeamId" FROM "tag"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`ALTER TABLE "temporary_tag" RENAME TO "tag"`);
        await queryRunner.query(`CREATE INDEX "IDX_c2f6bec0b39eaa3a6d90903ae9" ON "tag" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b08dd29fb6a8acdf83c83d8988" ON "tag" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_49746602acc4e5e8721062b69e" ON "tag" ("organizationTeamId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_49746602acc4e5e8721062b69e"`);
        await queryRunner.query(`DROP INDEX "IDX_b08dd29fb6a8acdf83c83d8988"`);
        await queryRunner.query(`DROP INDEX "IDX_c2f6bec0b39eaa3a6d90903ae9"`);
        await queryRunner.query(`ALTER TABLE "tag" RENAME TO "temporary_tag"`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "description" varchar, "color" varchar NOT NULL, "isSystem" boolean NOT NULL DEFAULT (0), "icon" varchar, "organizationTeamId" varchar, CONSTRAINT "FK_c2f6bec0b39eaa3a6d90903ae99" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_b08dd29fb6a8acdf83c83d8988f" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "tag"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "description", "color", "isSystem", "icon", "organizationTeamId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "description", "color", "isSystem", "icon", "organizationTeamId" FROM "temporary_tag"`);
        await queryRunner.query(`DROP TABLE "temporary_tag"`);
        await queryRunner.query(`CREATE INDEX "IDX_49746602acc4e5e8721062b69e" ON "tag" ("organizationTeamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b08dd29fb6a8acdf83c83d8988" ON "tag" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c2f6bec0b39eaa3a6d90903ae9" ON "tag" ("organizationId") `);
        await queryRunner.query(`DROP INDEX "IDX_49746602acc4e5e8721062b69e"`);
        await queryRunner.query(`DROP INDEX "IDX_b08dd29fb6a8acdf83c83d8988"`);
        await queryRunner.query(`DROP INDEX "IDX_c2f6bec0b39eaa3a6d90903ae9"`);
        await queryRunner.query(`ALTER TABLE "tag" RENAME TO "temporary_tag"`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "description" varchar, "color" varchar NOT NULL, "isSystem" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_c2f6bec0b39eaa3a6d90903ae99" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_b08dd29fb6a8acdf83c83d8988f" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "tag"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "description", "color", "isSystem") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "description", "color", "isSystem" FROM "temporary_tag"`);
        await queryRunner.query(`DROP TABLE "temporary_tag"`);
        await queryRunner.query(`CREATE INDEX "IDX_b08dd29fb6a8acdf83c83d8988" ON "tag" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c2f6bec0b39eaa3a6d90903ae9" ON "tag" ("organizationId") `);
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
exports.AlterTagTable1677142065591 = AlterTagTable1677142065591;
//# sourceMappingURL=1677142065591-AlterTagTable.js.map