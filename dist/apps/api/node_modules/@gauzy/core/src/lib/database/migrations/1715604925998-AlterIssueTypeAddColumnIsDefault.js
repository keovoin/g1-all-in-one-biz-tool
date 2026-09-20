"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterIssueTypeAddColumnIsDefault1715604925998 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterIssueTypeAddColumnIsDefault1715604925998 {
    constructor() {
        this.name = 'AlterIssueTypeAddColumnIsDefault1715604925998';
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
        await queryRunner.query(`ALTER TABLE "issue_type" ADD "isDefault" boolean NOT NULL DEFAULT false`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "issue_type" DROP COLUMN "isDefault"`);
    }
    /**
     * SqliteDB and BetterSQlite3DB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_586513cceb16777fd14a17bfe1"`);
        await queryRunner.query(`DROP INDEX "IDX_131331557078611a68b4a5b2e7"`);
        await queryRunner.query(`DROP INDEX "IDX_33779b0395f72af0b50dc526d1"`);
        await queryRunner.query(`DROP INDEX "IDX_af2d743ed61571bcdc5d9a27a0"`);
        await queryRunner.query(`DROP INDEX "IDX_4af451ab46a94e94394c72d911"`);
        await queryRunner.query(`DROP INDEX "IDX_16dbef9d1b2b422abdce8ee3ae"`);
        await queryRunner.query(`DROP INDEX "IDX_8b12c913c39c72fe5980427c96"`);
        await queryRunner.query(`DROP INDEX "IDX_722ce5d7535524b96c6d03f7c4"`);
        await queryRunner.query(`DROP INDEX "IDX_1909e9bae7d8b2c920b3e4d859"`);
        await queryRunner.query(`CREATE TABLE "temporary_issue_type" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "value" varchar NOT NULL, "description" varchar, "icon" varchar, "color" varchar, "isSystem" boolean NOT NULL DEFAULT (0), "imageId" varchar, "projectId" varchar, "organizationTeamId" varchar, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "deletedAt" datetime, "isDefault" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_586513cceb16777fd14a17bfe10" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_131331557078611a68b4a5b2e7e" FOREIGN KEY ("projectId") REFERENCES "organization_project" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_33779b0395f72af0b50dc526d1d" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_16dbef9d1b2b422abdce8ee3ae2" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_8b12c913c39c72fe5980427c963" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_issue_type"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "value", "description", "icon", "color", "isSystem", "imageId", "projectId", "organizationTeamId", "isActive", "isArchived", "deletedAt") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "value", "description", "icon", "color", "isSystem", "imageId", "projectId", "organizationTeamId", "isActive", "isArchived", "deletedAt" FROM "issue_type"`);
        await queryRunner.query(`DROP TABLE "issue_type"`);
        await queryRunner.query(`ALTER TABLE "temporary_issue_type" RENAME TO "issue_type"`);
        await queryRunner.query(`CREATE INDEX "IDX_586513cceb16777fd14a17bfe1" ON "issue_type" ("organizationTeamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_131331557078611a68b4a5b2e7" ON "issue_type" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_33779b0395f72af0b50dc526d1" ON "issue_type" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_af2d743ed61571bcdc5d9a27a0" ON "issue_type" ("value") `);
        await queryRunner.query(`CREATE INDEX "IDX_4af451ab46a94e94394c72d911" ON "issue_type" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_16dbef9d1b2b422abdce8ee3ae" ON "issue_type" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b12c913c39c72fe5980427c96" ON "issue_type" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_722ce5d7535524b96c6d03f7c4" ON "issue_type" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_1909e9bae7d8b2c920b3e4d859" ON "issue_type" ("isArchived") `);
    }
    /**
     * SqliteDB and BetterSQlite3DB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_1909e9bae7d8b2c920b3e4d859"`);
        await queryRunner.query(`DROP INDEX "IDX_722ce5d7535524b96c6d03f7c4"`);
        await queryRunner.query(`DROP INDEX "IDX_8b12c913c39c72fe5980427c96"`);
        await queryRunner.query(`DROP INDEX "IDX_16dbef9d1b2b422abdce8ee3ae"`);
        await queryRunner.query(`DROP INDEX "IDX_4af451ab46a94e94394c72d911"`);
        await queryRunner.query(`DROP INDEX "IDX_af2d743ed61571bcdc5d9a27a0"`);
        await queryRunner.query(`DROP INDEX "IDX_33779b0395f72af0b50dc526d1"`);
        await queryRunner.query(`DROP INDEX "IDX_131331557078611a68b4a5b2e7"`);
        await queryRunner.query(`DROP INDEX "IDX_586513cceb16777fd14a17bfe1"`);
        await queryRunner.query(`ALTER TABLE "issue_type" RENAME TO "temporary_issue_type"`);
        await queryRunner.query(`CREATE TABLE "issue_type" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "value" varchar NOT NULL, "description" varchar, "icon" varchar, "color" varchar, "isSystem" boolean NOT NULL DEFAULT (0), "imageId" varchar, "projectId" varchar, "organizationTeamId" varchar, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "deletedAt" datetime, CONSTRAINT "FK_586513cceb16777fd14a17bfe10" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_131331557078611a68b4a5b2e7e" FOREIGN KEY ("projectId") REFERENCES "organization_project" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_33779b0395f72af0b50dc526d1d" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_16dbef9d1b2b422abdce8ee3ae2" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_8b12c913c39c72fe5980427c963" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "issue_type"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "value", "description", "icon", "color", "isSystem", "imageId", "projectId", "organizationTeamId", "isActive", "isArchived", "deletedAt") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "value", "description", "icon", "color", "isSystem", "imageId", "projectId", "organizationTeamId", "isActive", "isArchived", "deletedAt" FROM "temporary_issue_type"`);
        await queryRunner.query(`DROP TABLE "temporary_issue_type"`);
        await queryRunner.query(`CREATE INDEX "IDX_1909e9bae7d8b2c920b3e4d859" ON "issue_type" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_722ce5d7535524b96c6d03f7c4" ON "issue_type" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b12c913c39c72fe5980427c96" ON "issue_type" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16dbef9d1b2b422abdce8ee3ae" ON "issue_type" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4af451ab46a94e94394c72d911" ON "issue_type" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_af2d743ed61571bcdc5d9a27a0" ON "issue_type" ("value") `);
        await queryRunner.query(`CREATE INDEX "IDX_33779b0395f72af0b50dc526d1" ON "issue_type" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_131331557078611a68b4a5b2e7" ON "issue_type" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_586513cceb16777fd14a17bfe1" ON "issue_type" ("organizationTeamId") `);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`issue_type\` ADD \`isDefault\` tinyint NOT NULL DEFAULT 0`);
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`issue_type\` DROP COLUMN \`isDefault\``);
    }
}
exports.AlterIssueTypeAddColumnIsDefault1715604925998 = AlterIssueTypeAddColumnIsDefault1715604925998;
//# sourceMappingURL=1715604925998-AlterIssueTypeAddColumnIsDefault.js.map