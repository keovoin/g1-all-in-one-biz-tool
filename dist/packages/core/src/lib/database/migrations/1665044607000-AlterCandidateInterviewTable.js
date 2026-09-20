"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterCandidateInterviewTable1665044607000 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterCandidateInterviewTable1665044607000 {
    constructor() {
        this.name = 'AlterCandidateInterviewTable1665044607000';
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
        await queryRunner.query(`ALTER TABLE "candidate_interview" ALTER COLUMN "note" DROP NOT NULL`);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`ALTER TABLE "candidate_interview" ALTER COLUMN "note" SET NOT NULL`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_91996439c4baafee8395d3df15"`);
        await queryRunner.query(`DROP INDEX "IDX_03be41e88b1fecfe4e24d6b04b"`);
        await queryRunner.query(`DROP INDEX "IDX_59b765e6d13d83dba4852a43eb"`);
        await queryRunner.query(`CREATE TABLE "temporary_candidate_interview" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "title" varchar NOT NULL, "startTime" datetime, "endTime" datetime, "location" varchar, "note" varchar NOT NULL, "isArchived" boolean DEFAULT (0), "rating" numeric, "candidateId" varchar, CONSTRAINT "FK_91996439c4baafee8395d3df153" FOREIGN KEY ("candidateId") REFERENCES "candidate" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_03be41e88b1fecfe4e24d6b04b2" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_59b765e6d13d83dba4852a43eb5" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_candidate_interview"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "title", "startTime", "endTime", "location", "note", "isArchived", "rating", "candidateId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "title", "startTime", "endTime", "location", "note", "isArchived", "rating", "candidateId" FROM "candidate_interview"`);
        await queryRunner.query(`DROP TABLE "candidate_interview"`);
        await queryRunner.query(`ALTER TABLE "temporary_candidate_interview" RENAME TO "candidate_interview"`);
        await queryRunner.query(`CREATE INDEX "IDX_91996439c4baafee8395d3df15" ON "candidate_interview" ("candidateId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03be41e88b1fecfe4e24d6b04b" ON "candidate_interview" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_59b765e6d13d83dba4852a43eb" ON "candidate_interview" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_91996439c4baafee8395d3df15"`);
        await queryRunner.query(`DROP INDEX "IDX_03be41e88b1fecfe4e24d6b04b"`);
        await queryRunner.query(`DROP INDEX "IDX_59b765e6d13d83dba4852a43eb"`);
        await queryRunner.query(`CREATE TABLE "temporary_candidate_interview" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "title" varchar NOT NULL, "startTime" datetime, "endTime" datetime, "location" varchar, "note" varchar, "isArchived" boolean DEFAULT (0), "rating" numeric, "candidateId" varchar, CONSTRAINT "FK_91996439c4baafee8395d3df153" FOREIGN KEY ("candidateId") REFERENCES "candidate" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_03be41e88b1fecfe4e24d6b04b2" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_59b765e6d13d83dba4852a43eb5" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_candidate_interview"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "title", "startTime", "endTime", "location", "note", "isArchived", "rating", "candidateId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "title", "startTime", "endTime", "location", "note", "isArchived", "rating", "candidateId" FROM "candidate_interview"`);
        await queryRunner.query(`DROP TABLE "candidate_interview"`);
        await queryRunner.query(`ALTER TABLE "temporary_candidate_interview" RENAME TO "candidate_interview"`);
        await queryRunner.query(`CREATE INDEX "IDX_91996439c4baafee8395d3df15" ON "candidate_interview" ("candidateId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03be41e88b1fecfe4e24d6b04b" ON "candidate_interview" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_59b765e6d13d83dba4852a43eb" ON "candidate_interview" ("tenantId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_59b765e6d13d83dba4852a43eb"`);
        await queryRunner.query(`DROP INDEX "IDX_03be41e88b1fecfe4e24d6b04b"`);
        await queryRunner.query(`DROP INDEX "IDX_91996439c4baafee8395d3df15"`);
        await queryRunner.query(`ALTER TABLE "candidate_interview" RENAME TO "temporary_candidate_interview"`);
        await queryRunner.query(`CREATE TABLE "candidate_interview" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "title" varchar NOT NULL, "startTime" datetime, "endTime" datetime, "location" varchar, "note" varchar NOT NULL, "isArchived" boolean DEFAULT (0), "rating" numeric, "candidateId" varchar, CONSTRAINT "FK_91996439c4baafee8395d3df153" FOREIGN KEY ("candidateId") REFERENCES "candidate" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_03be41e88b1fecfe4e24d6b04b2" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_59b765e6d13d83dba4852a43eb5" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "candidate_interview"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "title", "startTime", "endTime", "location", "note", "isArchived", "rating", "candidateId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "title", "startTime", "endTime", "location", "note", "isArchived", "rating", "candidateId" FROM "temporary_candidate_interview"`);
        await queryRunner.query(`DROP TABLE "temporary_candidate_interview"`);
        await queryRunner.query(`CREATE INDEX "IDX_59b765e6d13d83dba4852a43eb" ON "candidate_interview" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03be41e88b1fecfe4e24d6b04b" ON "candidate_interview" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_91996439c4baafee8395d3df15" ON "candidate_interview" ("candidateId") `);
        await queryRunner.query(`DROP INDEX "IDX_59b765e6d13d83dba4852a43eb"`);
        await queryRunner.query(`DROP INDEX "IDX_03be41e88b1fecfe4e24d6b04b"`);
        await queryRunner.query(`DROP INDEX "IDX_91996439c4baafee8395d3df15"`);
        await queryRunner.query(`ALTER TABLE "candidate_interview" RENAME TO "temporary_candidate_interview"`);
        await queryRunner.query(`CREATE TABLE "candidate_interview" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "title" varchar NOT NULL, "startTime" datetime, "endTime" datetime, "location" varchar, "note" varchar NOT NULL, "isArchived" boolean DEFAULT (0), "rating" numeric, "candidateId" varchar, CONSTRAINT "FK_91996439c4baafee8395d3df153" FOREIGN KEY ("candidateId") REFERENCES "candidate" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_03be41e88b1fecfe4e24d6b04b2" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_59b765e6d13d83dba4852a43eb5" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "candidate_interview"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "title", "startTime", "endTime", "location", "note", "isArchived", "rating", "candidateId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "title", "startTime", "endTime", "location", "note", "isArchived", "rating", "candidateId" FROM "temporary_candidate_interview"`);
        await queryRunner.query(`DROP TABLE "temporary_candidate_interview"`);
        await queryRunner.query(`CREATE INDEX "IDX_59b765e6d13d83dba4852a43eb" ON "candidate_interview" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03be41e88b1fecfe4e24d6b04b" ON "candidate_interview" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_91996439c4baafee8395d3df15" ON "candidate_interview" ("candidateId") `);
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
exports.AlterCandidateInterviewTable1665044607000 = AlterCandidateInterviewTable1665044607000;
//# sourceMappingURL=1665044607000-AlterCandidateInterviewTable.js.map