"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterOrganizationTeamTable1686195290990 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterOrganizationTeamTable1686195290990 {
    constructor() {
        this.name = 'AlterOrganizationTeamTable1686195290990';
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
        await queryRunner.query(`ALTER TABLE "organization_team" ADD "color" character varying`);
        await queryRunner.query(`ALTER TABLE "organization_team" ADD "emoji" character varying`);
        await queryRunner.query(`ALTER TABLE "organization_team" ADD "teamSize" character varying`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "organization_team" DROP COLUMN "teamSize"`);
        await queryRunner.query(`ALTER TABLE "organization_team" DROP COLUMN "emoji"`);
        await queryRunner.query(`ALTER TABLE "organization_team" DROP COLUMN "color"`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_51e91be110fa0b8e70066f5727"`);
        await queryRunner.query(`DROP INDEX "IDX_da625f694eb1e23e585f301008"`);
        await queryRunner.query(`DROP INDEX "IDX_103ae3eb65f4b091efc55cb532"`);
        await queryRunner.query(`DROP INDEX "IDX_eef1c19a0cb5321223cfe3286c"`);
        await queryRunner.query(`DROP INDEX "IDX_176f5ed3c4534f3110d423d569"`);
        await queryRunner.query(`DROP INDEX "IDX_e22ab0f1236b1a07785b641727"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_team" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "prefix" varchar, "createdById" varchar, "public" boolean DEFAULT (0), "profile_link" varchar, "logo" varchar, "imageId" varchar, "color" varchar, "emoji" varchar, "teamSize" varchar, CONSTRAINT "FK_51e91be110fa0b8e70066f5727f" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_da625f694eb1e23e585f3010082" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_eef1c19a0cb5321223cfe3286c4" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_176f5ed3c4534f3110d423d5690" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_team"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo", "imageId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo", "imageId" FROM "organization_team"`);
        await queryRunner.query(`DROP TABLE "organization_team"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_team" RENAME TO "organization_team"`);
        await queryRunner.query(`CREATE INDEX "IDX_51e91be110fa0b8e70066f5727" ON "organization_team" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_da625f694eb1e23e585f301008" ON "organization_team" ("createdById") `);
        await queryRunner.query(`CREATE INDEX "IDX_103ae3eb65f4b091efc55cb532" ON "organization_team" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_eef1c19a0cb5321223cfe3286c" ON "organization_team" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_176f5ed3c4534f3110d423d569" ON "organization_team" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e22ab0f1236b1a07785b641727" ON "organization_team" ("profile_link") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_e22ab0f1236b1a07785b641727"`);
        await queryRunner.query(`DROP INDEX "IDX_176f5ed3c4534f3110d423d569"`);
        await queryRunner.query(`DROP INDEX "IDX_eef1c19a0cb5321223cfe3286c"`);
        await queryRunner.query(`DROP INDEX "IDX_103ae3eb65f4b091efc55cb532"`);
        await queryRunner.query(`DROP INDEX "IDX_da625f694eb1e23e585f301008"`);
        await queryRunner.query(`DROP INDEX "IDX_51e91be110fa0b8e70066f5727"`);
        await queryRunner.query(`ALTER TABLE "organization_team" RENAME TO "temporary_organization_team"`);
        await queryRunner.query(`CREATE TABLE "organization_team" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "prefix" varchar, "createdById" varchar, "public" boolean DEFAULT (0), "profile_link" varchar, "logo" varchar, "imageId" varchar, CONSTRAINT "FK_51e91be110fa0b8e70066f5727f" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_da625f694eb1e23e585f3010082" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_eef1c19a0cb5321223cfe3286c4" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_176f5ed3c4534f3110d423d5690" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_team"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo", "imageId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo", "imageId" FROM "temporary_organization_team"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_team"`);
        await queryRunner.query(`CREATE INDEX "IDX_e22ab0f1236b1a07785b641727" ON "organization_team" ("profile_link") `);
        await queryRunner.query(`CREATE INDEX "IDX_176f5ed3c4534f3110d423d569" ON "organization_team" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eef1c19a0cb5321223cfe3286c" ON "organization_team" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_103ae3eb65f4b091efc55cb532" ON "organization_team" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_da625f694eb1e23e585f301008" ON "organization_team" ("createdById") `);
        await queryRunner.query(`CREATE INDEX "IDX_51e91be110fa0b8e70066f5727" ON "organization_team" ("imageId") `);
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
exports.AlterOrganizationTeamTable1686195290990 = AlterOrganizationTeamTable1686195290990;
//# sourceMappingURL=1686195290990-AlterOrganizationTeamTable.js.map