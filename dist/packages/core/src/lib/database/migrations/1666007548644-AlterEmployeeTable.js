"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterEmployeeTable1666007548644 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterEmployeeTable1666007548644 {
    constructor() {
        this.name = 'AlterEmployeeTable1666007548644';
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
        await queryRunner.query(`ALTER TABLE "organization_department_employee" DROP CONSTRAINT "FK_0d4f83695591ae3c98a0544ac8d"`);
        await queryRunner.query(`ALTER TABLE "organization_department_employee" ADD CONSTRAINT "FK_0d4f83695591ae3c98a0544ac8d" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "organization_department_employee" DROP CONSTRAINT "FK_0d4f83695591ae3c98a0544ac8d"`);
        await queryRunner.query(`ALTER TABLE "organization_department_employee" ADD CONSTRAINT  "FK_0d4f83695591ae3c98a0544ac8d" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_0d4f83695591ae3c98a0544ac8"`);
        await queryRunner.query(`DROP INDEX "IDX_c34e79a3aa682bbd3f0e8cf4c4"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_department_employee" ("organizationDepartmentId" varchar NOT NULL, "employeeId" varchar NOT NULL, CONSTRAINT "FK_c34e79a3aa682bbd3f0e8cf4c46" FOREIGN KEY ("organizationDepartmentId") REFERENCES "organization_department" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("organizationDepartmentId", "employeeId"))`);
        await queryRunner.query(`INSERT INTO "temporary_organization_department_employee"("organizationDepartmentId", "employeeId") SELECT "organizationDepartmentId", "employeeId" FROM "organization_department_employee"`);
        await queryRunner.query(`DROP TABLE "organization_department_employee"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_department_employee" RENAME TO "organization_department_employee"`);
        await queryRunner.query(`CREATE INDEX "IDX_0d4f83695591ae3c98a0544ac8" ON "organization_department_employee" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c34e79a3aa682bbd3f0e8cf4c4" ON "organization_department_employee" ("organizationDepartmentId") `);
        await queryRunner.query(`DROP INDEX "IDX_0d4f83695591ae3c98a0544ac8"`);
        await queryRunner.query(`DROP INDEX "IDX_c34e79a3aa682bbd3f0e8cf4c4"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_department_employee" ("organizationDepartmentId" varchar NOT NULL, "employeeId" varchar NOT NULL, CONSTRAINT "FK_c34e79a3aa682bbd3f0e8cf4c46" FOREIGN KEY ("organizationDepartmentId") REFERENCES "organization_department" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_0d4f83695591ae3c98a0544ac8d" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("organizationDepartmentId", "employeeId"))`);
        await queryRunner.query(`INSERT INTO "temporary_organization_department_employee"("organizationDepartmentId", "employeeId") SELECT "organizationDepartmentId", "employeeId" FROM "organization_department_employee"`);
        await queryRunner.query(`DROP TABLE "organization_department_employee"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_department_employee" RENAME TO "organization_department_employee"`);
        await queryRunner.query(`CREATE INDEX "IDX_0d4f83695591ae3c98a0544ac8" ON "organization_department_employee" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c34e79a3aa682bbd3f0e8cf4c4" ON "organization_department_employee" ("organizationDepartmentId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_c34e79a3aa682bbd3f0e8cf4c4"`);
        await queryRunner.query(`DROP INDEX "IDX_0d4f83695591ae3c98a0544ac8"`);
        await queryRunner.query(`ALTER TABLE "organization_department_employee" RENAME TO "temporary_organization_department_employee"`);
        await queryRunner.query(`CREATE TABLE "organization_department_employee" ("organizationDepartmentId" varchar NOT NULL, "employeeId" varchar NOT NULL, CONSTRAINT "FK_c34e79a3aa682bbd3f0e8cf4c46" FOREIGN KEY ("organizationDepartmentId") REFERENCES "organization_department" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("organizationDepartmentId", "employeeId"))`);
        await queryRunner.query(`INSERT INTO "organization_department_employee"("organizationDepartmentId", "employeeId") SELECT "organizationDepartmentId", "employeeId" FROM "temporary_organization_department_employee"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_department_employee"`);
        await queryRunner.query(`CREATE INDEX "IDX_c34e79a3aa682bbd3f0e8cf4c4" ON "organization_department_employee" ("organizationDepartmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d4f83695591ae3c98a0544ac8" ON "organization_department_employee" ("employeeId") `);
        await queryRunner.query(`DROP INDEX "IDX_c34e79a3aa682bbd3f0e8cf4c4"`);
        await queryRunner.query(`DROP INDEX "IDX_0d4f83695591ae3c98a0544ac8"`);
        await queryRunner.query(`ALTER TABLE "organization_department_employee" RENAME TO "temporary_organization_department_employee"`);
        await queryRunner.query(`CREATE TABLE "organization_department_employee" ("organizationDepartmentId" varchar NOT NULL, "employeeId" varchar NOT NULL, CONSTRAINT "FK_0d4f83695591ae3c98a0544ac8d" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c34e79a3aa682bbd3f0e8cf4c46" FOREIGN KEY ("organizationDepartmentId") REFERENCES "organization_department" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("organizationDepartmentId", "employeeId"))`);
        await queryRunner.query(`INSERT INTO "organization_department_employee"("organizationDepartmentId", "employeeId") SELECT "organizationDepartmentId", "employeeId" FROM "temporary_organization_department_employee"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_department_employee"`);
        await queryRunner.query(`CREATE INDEX "IDX_c34e79a3aa682bbd3f0e8cf4c4" ON "organization_department_employee" ("organizationDepartmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d4f83695591ae3c98a0544ac8" ON "organization_department_employee" ("employeeId") `);
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
exports.AlterEmployeeTable1666007548644 = AlterEmployeeTable1666007548644;
//# sourceMappingURL=1666007548644-AlterEmployeeTable.js.map