"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOrganizationProjectTeamRelation1692256031607 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddOrganizationProjectTeamRelation1692256031607 {
    constructor() {
        this.name = 'AddOrganizationProjectTeamRelation1692256031607';
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
        await queryRunner.query(`CREATE TABLE "organization_project_team" ("organizationProjectId" uuid NOT NULL, "organizationTeamId" uuid NOT NULL, CONSTRAINT "PK_a9a3f212a3e0e2f5e6dba06edd0" PRIMARY KEY ("organizationProjectId", "organizationTeamId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7c31431ff2173c2c939a0aa036" ON "organization_project_team" ("organizationProjectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_599a5f7f6c190822dcfdbbb6eb" ON "organization_project_team" ("organizationTeamId") `);
        await queryRunner.query(`ALTER TABLE "organization_project_team" ADD CONSTRAINT "FK_7c31431ff2173c2c939a0aa036c" FOREIGN KEY ("organizationProjectId") REFERENCES "organization_project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organization_project_team" ADD CONSTRAINT "FK_599a5f7f6c190822dcfdbbb6eb0" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "organization_project_team" DROP CONSTRAINT "FK_599a5f7f6c190822dcfdbbb6eb0"`);
        await queryRunner.query(`ALTER TABLE "organization_project_team" DROP CONSTRAINT "FK_7c31431ff2173c2c939a0aa036c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_599a5f7f6c190822dcfdbbb6eb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c31431ff2173c2c939a0aa036"`);
        await queryRunner.query(`DROP TABLE "organization_project_team"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "organization_project_team" ("organizationProjectId" varchar NOT NULL, "organizationTeamId" varchar NOT NULL, PRIMARY KEY ("organizationProjectId", "organizationTeamId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7c31431ff2173c2c939a0aa036" ON "organization_project_team" ("organizationProjectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_599a5f7f6c190822dcfdbbb6eb" ON "organization_project_team" ("organizationTeamId") `);
        await queryRunner.query(`DROP INDEX "IDX_7c31431ff2173c2c939a0aa036"`);
        await queryRunner.query(`DROP INDEX "IDX_599a5f7f6c190822dcfdbbb6eb"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_project_team" ("organizationProjectId" varchar NOT NULL, "organizationTeamId" varchar NOT NULL, CONSTRAINT "FK_7c31431ff2173c2c939a0aa036c" FOREIGN KEY ("organizationProjectId") REFERENCES "organization_project" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_599a5f7f6c190822dcfdbbb6eb0" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("organizationProjectId", "organizationTeamId"))`);
        await queryRunner.query(`INSERT INTO "temporary_organization_project_team"("organizationProjectId", "organizationTeamId") SELECT "organizationProjectId", "organizationTeamId" FROM "organization_project_team"`);
        await queryRunner.query(`DROP TABLE "organization_project_team"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_project_team" RENAME TO "organization_project_team"`);
        await queryRunner.query(`CREATE INDEX "IDX_7c31431ff2173c2c939a0aa036" ON "organization_project_team" ("organizationProjectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_599a5f7f6c190822dcfdbbb6eb" ON "organization_project_team" ("organizationTeamId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_599a5f7f6c190822dcfdbbb6eb"`);
        await queryRunner.query(`DROP INDEX "IDX_7c31431ff2173c2c939a0aa036"`);
        await queryRunner.query(`ALTER TABLE "organization_project_team" RENAME TO "temporary_organization_project_team"`);
        await queryRunner.query(`CREATE TABLE "organization_project_team" ("organizationProjectId" varchar NOT NULL, "organizationTeamId" varchar NOT NULL, PRIMARY KEY ("organizationProjectId", "organizationTeamId"))`);
        await queryRunner.query(`INSERT INTO "organization_project_team"("organizationProjectId", "organizationTeamId") SELECT "organizationProjectId", "organizationTeamId" FROM "temporary_organization_project_team"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_project_team"`);
        await queryRunner.query(`CREATE INDEX "IDX_599a5f7f6c190822dcfdbbb6eb" ON "organization_project_team" ("organizationTeamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7c31431ff2173c2c939a0aa036" ON "organization_project_team" ("organizationProjectId") `);
        await queryRunner.query(`DROP INDEX "IDX_599a5f7f6c190822dcfdbbb6eb"`);
        await queryRunner.query(`DROP INDEX "IDX_7c31431ff2173c2c939a0aa036"`);
        await queryRunner.query(`DROP TABLE "organization_project_team"`);
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
exports.AddOrganizationProjectTeamRelation1692256031607 = AddOrganizationProjectTeamRelation1692256031607;
//# sourceMappingURL=1692256031607-AddOrganizationProjectTeamRelation.js.map