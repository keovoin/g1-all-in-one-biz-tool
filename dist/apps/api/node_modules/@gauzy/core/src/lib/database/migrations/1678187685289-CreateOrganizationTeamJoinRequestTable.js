"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrganizationTeamJoinRequestTable1678187685289 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class CreateOrganizationTeamJoinRequestTable1678187685289 {
    constructor() {
        this.name = 'CreateOrganizationTeamJoinRequestTable1678187685289';
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
        await queryRunner.query(`CREATE TABLE "organization_team_join_request" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid, "organizationId" uuid, "email" character varying NOT NULL, "fullName" character varying, "linkAddress" character varying, "position" character varying, "status" character varying NOT NULL DEFAULT 'REQUESTED', "code" integer, "token" character varying, "expiredAt" TIMESTAMP, "userId" uuid, "organizationTeamId" uuid, CONSTRAINT "PK_131578c98f3a9e8a72b9a8a1374" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d9529008c733cb90044b8c2ad6" ON "organization_team_join_request" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c15823bf3f63b1fe331d9de662" ON "organization_team_join_request" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e73656ce0355347477c42ae19" ON "organization_team_join_request" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_171b852be7c1f387eca93775aa" ON "organization_team_join_request" ("organizationTeamId") `);
        await queryRunner.query(`ALTER TABLE "organization_team_join_request" ADD CONSTRAINT "FK_d9529008c733cb90044b8c2ad6b" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_team_join_request" ADD CONSTRAINT "FK_c15823bf3f63b1fe331d9de6625" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "organization_team_join_request" ADD CONSTRAINT "FK_5e73656ce0355347477c42ae19b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_team_join_request" ADD CONSTRAINT "FK_171b852be7c1f387eca93775aad" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "organization_team_join_request" DROP CONSTRAINT "FK_171b852be7c1f387eca93775aad"`);
        await queryRunner.query(`ALTER TABLE "organization_team_join_request" DROP CONSTRAINT "FK_5e73656ce0355347477c42ae19b"`);
        await queryRunner.query(`ALTER TABLE "organization_team_join_request" DROP CONSTRAINT "FK_c15823bf3f63b1fe331d9de6625"`);
        await queryRunner.query(`ALTER TABLE "organization_team_join_request" DROP CONSTRAINT "FK_d9529008c733cb90044b8c2ad6b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_171b852be7c1f387eca93775aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e73656ce0355347477c42ae19"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c15823bf3f63b1fe331d9de662"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9529008c733cb90044b8c2ad6"`);
        await queryRunner.query(`DROP TABLE "organization_team_join_request"`);
    }
    /**
     * SqliteDB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE TABLE "organization_team_join_request" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "email" varchar NOT NULL, "fullName" varchar, "linkAddress" varchar, "position" varchar, "status" varchar NOT NULL DEFAULT ('REQUESTED'), "code" integer, "token" varchar, "expiredAt" datetime, "userId" varchar, "organizationTeamId" varchar)`);
        await queryRunner.query(`CREATE INDEX "IDX_d9529008c733cb90044b8c2ad6" ON "organization_team_join_request" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c15823bf3f63b1fe331d9de662" ON "organization_team_join_request" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e73656ce0355347477c42ae19" ON "organization_team_join_request" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_171b852be7c1f387eca93775aa" ON "organization_team_join_request" ("organizationTeamId") `);
        await queryRunner.query(`DROP INDEX "IDX_d9529008c733cb90044b8c2ad6"`);
        await queryRunner.query(`DROP INDEX "IDX_c15823bf3f63b1fe331d9de662"`);
        await queryRunner.query(`DROP INDEX "IDX_5e73656ce0355347477c42ae19"`);
        await queryRunner.query(`DROP INDEX "IDX_171b852be7c1f387eca93775aa"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_team_join_request" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "email" varchar NOT NULL, "fullName" varchar, "linkAddress" varchar, "position" varchar, "status" varchar NOT NULL DEFAULT ('REQUESTED'), "code" integer, "token" varchar, "expiredAt" datetime, "userId" varchar, "organizationTeamId" varchar, CONSTRAINT "FK_d9529008c733cb90044b8c2ad6b" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c15823bf3f63b1fe331d9de6625" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_5e73656ce0355347477c42ae19b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_171b852be7c1f387eca93775aad" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_team_join_request"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "email", "fullName", "linkAddress", "position", "status", "code", "token", "expiredAt", "userId", "organizationTeamId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "email", "fullName", "linkAddress", "position", "status", "code", "token", "expiredAt", "userId", "organizationTeamId" FROM "organization_team_join_request"`);
        await queryRunner.query(`DROP TABLE "organization_team_join_request"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_team_join_request" RENAME TO "organization_team_join_request"`);
        await queryRunner.query(`CREATE INDEX "IDX_d9529008c733cb90044b8c2ad6" ON "organization_team_join_request" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c15823bf3f63b1fe331d9de662" ON "organization_team_join_request" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e73656ce0355347477c42ae19" ON "organization_team_join_request" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_171b852be7c1f387eca93775aa" ON "organization_team_join_request" ("organizationTeamId") `);
    }
    /**
     * SqliteDB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_171b852be7c1f387eca93775aa"`);
        await queryRunner.query(`DROP INDEX "IDX_5e73656ce0355347477c42ae19"`);
        await queryRunner.query(`DROP INDEX "IDX_c15823bf3f63b1fe331d9de662"`);
        await queryRunner.query(`DROP INDEX "IDX_d9529008c733cb90044b8c2ad6"`);
        await queryRunner.query(`ALTER TABLE "organization_team_join_request" RENAME TO "temporary_organization_team_join_request"`);
        await queryRunner.query(`CREATE TABLE "organization_team_join_request" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "email" varchar NOT NULL, "fullName" varchar, "linkAddress" varchar, "position" varchar, "status" varchar NOT NULL DEFAULT ('REQUESTED'), "code" integer, "token" varchar, "expiredAt" datetime, "userId" varchar, "organizationTeamId" varchar)`);
        await queryRunner.query(`INSERT INTO "organization_team_join_request"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "email", "fullName", "linkAddress", "position", "status", "code", "token", "expiredAt", "userId", "organizationTeamId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "email", "fullName", "linkAddress", "position", "status", "code", "token", "expiredAt", "userId", "organizationTeamId" FROM "temporary_organization_team_join_request"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_team_join_request"`);
        await queryRunner.query(`CREATE INDEX "IDX_171b852be7c1f387eca93775aa" ON "organization_team_join_request" ("organizationTeamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e73656ce0355347477c42ae19" ON "organization_team_join_request" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c15823bf3f63b1fe331d9de662" ON "organization_team_join_request" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9529008c733cb90044b8c2ad6" ON "organization_team_join_request" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_171b852be7c1f387eca93775aa"`);
        await queryRunner.query(`DROP INDEX "IDX_5e73656ce0355347477c42ae19"`);
        await queryRunner.query(`DROP INDEX "IDX_c15823bf3f63b1fe331d9de662"`);
        await queryRunner.query(`DROP INDEX "IDX_d9529008c733cb90044b8c2ad6"`);
        await queryRunner.query(`DROP TABLE "organization_team_join_request"`);
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
exports.CreateOrganizationTeamJoinRequestTable1678187685289 = CreateOrganizationTeamJoinRequestTable1678187685289;
//# sourceMappingURL=1678187685289-CreateOrganizationTeamJoinRequestTable.js.map