"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTimeTrackingColumnToOrganizationTeamEmployeeTable1676477607906 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddTimeTrackingColumnToOrganizationTeamEmployeeTable1676477607906 {
    constructor() {
        this.name = 'AddTimeTrackingColumnToOrganizationTeamEmployeeTable1676477607906';
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
        await queryRunner.query(`ALTER TABLE "organization_team_employee" ADD "isTrackingEnabled" boolean DEFAULT true`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "organization_team_employee" DROP COLUMN "isTrackingEnabled"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_ce83034f38496f5fe3f1979697"`);
        await queryRunner.query(`DROP INDEX "IDX_a2a5601d799fbfc29c17b99243"`);
        await queryRunner.query(`DROP INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0"`);
        await queryRunner.query(`DROP INDEX "IDX_d8eba1c0e500c60be1b69c1e77"`);
        await queryRunner.query(`DROP INDEX "IDX_fe12e1b76bbb76209134d9bdc2"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_team_employee" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "organizationTeamId" varchar NOT NULL, "employeeId" varchar NOT NULL, "roleId" varchar, "isTrackingEnabled" boolean DEFAULT (1), CONSTRAINT "FK_ce83034f38496f5fe3f19796977" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2a5601d799fbfc29c17b99243f" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_8dc83cdd7c519d73afc0d8bdf09" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d8eba1c0e500c60be1b69c1e777" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_fe12e1b76bbb76209134d9bdc2e" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_team_employee"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId" FROM "organization_team_employee"`);
        await queryRunner.query(`DROP TABLE "organization_team_employee"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_team_employee" RENAME TO "organization_team_employee"`);
        await queryRunner.query(`CREATE INDEX "IDX_ce83034f38496f5fe3f1979697" ON "organization_team_employee" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2a5601d799fbfc29c17b99243" ON "organization_team_employee" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0" ON "organization_team_employee" ("organizationTeamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d8eba1c0e500c60be1b69c1e77" ON "organization_team_employee" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fe12e1b76bbb76209134d9bdc2" ON "organization_team_employee" ("tenantId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_fe12e1b76bbb76209134d9bdc2"`);
        await queryRunner.query(`DROP INDEX "IDX_d8eba1c0e500c60be1b69c1e77"`);
        await queryRunner.query(`DROP INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0"`);
        await queryRunner.query(`DROP INDEX "IDX_a2a5601d799fbfc29c17b99243"`);
        await queryRunner.query(`DROP INDEX "IDX_ce83034f38496f5fe3f1979697"`);
        await queryRunner.query(`ALTER TABLE "organization_team_employee" RENAME TO "temporary_organization_team_employee"`);
        await queryRunner.query(`CREATE TABLE "organization_team_employee" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "organizationTeamId" varchar NOT NULL, "employeeId" varchar NOT NULL, "roleId" varchar, CONSTRAINT "FK_ce83034f38496f5fe3f19796977" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2a5601d799fbfc29c17b99243f" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_8dc83cdd7c519d73afc0d8bdf09" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d8eba1c0e500c60be1b69c1e777" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_fe12e1b76bbb76209134d9bdc2e" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_team_employee"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId" FROM "temporary_organization_team_employee"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_team_employee"`);
        await queryRunner.query(`CREATE INDEX "IDX_fe12e1b76bbb76209134d9bdc2" ON "organization_team_employee" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d8eba1c0e500c60be1b69c1e77" ON "organization_team_employee" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0" ON "organization_team_employee" ("organizationTeamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2a5601d799fbfc29c17b99243" ON "organization_team_employee" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce83034f38496f5fe3f1979697" ON "organization_team_employee" ("roleId") `);
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
exports.AddTimeTrackingColumnToOrganizationTeamEmployeeTable1676477607906 = AddTimeTrackingColumnToOrganizationTeamEmployeeTable1676477607906;
//# sourceMappingURL=1676477607906-AddTimeTrackingColumnToOrganizationTeamEmployeeTable.js.map