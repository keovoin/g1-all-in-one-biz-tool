"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterCandidateTable1672211594766 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterCandidateTable1672211594766 {
    constructor() {
        this.name = 'AlterCandidateTable1672211594766';
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
        await queryRunner.query(`ALTER TABLE "candidate_department" DROP CONSTRAINT "FK_ef6e8d34b95dcb2b21d5de08a61"`);
        await queryRunner.query(`ALTER TABLE "candidate_department" ADD CONSTRAINT "FK_ef6e8d34b95dcb2b21d5de08a61" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "candidate_department" DROP CONSTRAINT "FK_ef6e8d34b95dcb2b21d5de08a61"`);
        await queryRunner.query(`ALTER TABLE "candidate_department" ADD CONSTRAINT "FK_ef6e8d34b95dcb2b21d5de08a61" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_ef6e8d34b95dcb2b21d5de08a6"`);
        await queryRunner.query(`DROP INDEX "IDX_c58533f9ba63f42fef682e1ee7"`);
        await queryRunner.query(`CREATE TABLE "temporary_candidate_department" ("organizationDepartmentId" varchar NOT NULL, "candidateId" varchar NOT NULL, CONSTRAINT "FK_c58533f9ba63f42fef682e1ee7c" FOREIGN KEY ("organizationDepartmentId") REFERENCES "organization_department" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("organizationDepartmentId", "candidateId"))`);
        await queryRunner.query(`INSERT INTO "temporary_candidate_department"("organizationDepartmentId", "candidateId") SELECT "organizationDepartmentId", "candidateId" FROM "candidate_department"`);
        await queryRunner.query(`DROP TABLE "candidate_department"`);
        await queryRunner.query(`ALTER TABLE "temporary_candidate_department" RENAME TO "candidate_department"`);
        await queryRunner.query(`CREATE INDEX "IDX_ef6e8d34b95dcb2b21d5de08a6" ON "candidate_department" ("candidateId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c58533f9ba63f42fef682e1ee7" ON "candidate_department" ("organizationDepartmentId") `);
        await queryRunner.query(`DROP INDEX "IDX_ef6e8d34b95dcb2b21d5de08a6"`);
        await queryRunner.query(`DROP INDEX "IDX_c58533f9ba63f42fef682e1ee7"`);
        await queryRunner.query(`CREATE TABLE "temporary_candidate_department" ("organizationDepartmentId" varchar NOT NULL, "candidateId" varchar NOT NULL, CONSTRAINT "FK_c58533f9ba63f42fef682e1ee7c" FOREIGN KEY ("organizationDepartmentId") REFERENCES "organization_department" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_ef6e8d34b95dcb2b21d5de08a61" FOREIGN KEY ("candidateId") REFERENCES "candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("organizationDepartmentId", "candidateId"))`);
        await queryRunner.query(`INSERT INTO "temporary_candidate_department"("organizationDepartmentId", "candidateId") SELECT "organizationDepartmentId", "candidateId" FROM "candidate_department"`);
        await queryRunner.query(`DROP TABLE "candidate_department"`);
        await queryRunner.query(`ALTER TABLE "temporary_candidate_department" RENAME TO "candidate_department"`);
        await queryRunner.query(`CREATE INDEX "IDX_ef6e8d34b95dcb2b21d5de08a6" ON "candidate_department" ("candidateId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c58533f9ba63f42fef682e1ee7" ON "candidate_department" ("organizationDepartmentId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_c58533f9ba63f42fef682e1ee7"`);
        await queryRunner.query(`DROP INDEX "IDX_ef6e8d34b95dcb2b21d5de08a6"`);
        await queryRunner.query(`ALTER TABLE "candidate_department" RENAME TO "temporary_candidate_department"`);
        await queryRunner.query(`CREATE TABLE "candidate_department" ("organizationDepartmentId" varchar NOT NULL, "candidateId" varchar NOT NULL, CONSTRAINT "FK_c58533f9ba63f42fef682e1ee7c" FOREIGN KEY ("organizationDepartmentId") REFERENCES "organization_department" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("organizationDepartmentId", "candidateId"))`);
        await queryRunner.query(`INSERT INTO "candidate_department"("organizationDepartmentId", "candidateId") SELECT "organizationDepartmentId", "candidateId" FROM "temporary_candidate_department"`);
        await queryRunner.query(`DROP TABLE "temporary_candidate_department"`);
        await queryRunner.query(`CREATE INDEX "IDX_c58533f9ba63f42fef682e1ee7" ON "candidate_department" ("organizationDepartmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef6e8d34b95dcb2b21d5de08a6" ON "candidate_department" ("candidateId") `);
        await queryRunner.query(`DROP INDEX "IDX_c58533f9ba63f42fef682e1ee7"`);
        await queryRunner.query(`DROP INDEX "IDX_ef6e8d34b95dcb2b21d5de08a6"`);
        await queryRunner.query(`ALTER TABLE "candidate_department" RENAME TO "temporary_candidate_department"`);
        await queryRunner.query(`CREATE TABLE "candidate_department" ("organizationDepartmentId" varchar NOT NULL, "candidateId" varchar NOT NULL, CONSTRAINT "FK_ef6e8d34b95dcb2b21d5de08a61" FOREIGN KEY ("candidateId") REFERENCES "candidate" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c58533f9ba63f42fef682e1ee7c" FOREIGN KEY ("organizationDepartmentId") REFERENCES "organization_department" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("organizationDepartmentId", "candidateId"))`);
        await queryRunner.query(`INSERT INTO "candidate_department"("organizationDepartmentId", "candidateId") SELECT "organizationDepartmentId", "candidateId" FROM "temporary_candidate_department"`);
        await queryRunner.query(`DROP TABLE "temporary_candidate_department"`);
        await queryRunner.query(`CREATE INDEX "IDX_c58533f9ba63f42fef682e1ee7" ON "candidate_department" ("organizationDepartmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef6e8d34b95dcb2b21d5de08a6" ON "candidate_department" ("candidateId") `);
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
exports.AlterCandidateTable1672211594766 = AlterCandidateTable1672211594766;
//# sourceMappingURL=1672211594766-AlterCandidateTable.js.map