"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndexesColumnsToTheActivityTable1680154573492 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddIndexesColumnsToTheActivityTable1680154573492 {
    constructor() {
        this.name = 'AddIndexesColumnsToTheActivityTable1680154573492';
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
        await queryRunner.query(`CREATE INDEX "IDX_a28a1682ea80f10d1ecc7babaa" ON "activity" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_302b60a4970ffe94d5223f1c23" ON "activity" ("date") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5525385e85f7429e233d4a0fa" ON "activity" ("time") `);
        await queryRunner.query(`CREATE INDEX "IDX_f27285af15ef48363745ab2d79" ON "activity" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_0e36a2c95e2f1df7f1b3059d24" ON "activity" ("source") `);
        await queryRunner.query(`CREATE INDEX "IDX_ffd736f18ba71b3221e4f835a9" ON "activity" ("recordedAt") `);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_ffd736f18ba71b3221e4f835a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0e36a2c95e2f1df7f1b3059d24"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f27285af15ef48363745ab2d79"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5525385e85f7429e233d4a0fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_302b60a4970ffe94d5223f1c23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a28a1682ea80f10d1ecc7babaa"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE INDEX "IDX_a28a1682ea80f10d1ecc7babaa" ON "activity" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_302b60a4970ffe94d5223f1c23" ON "activity" ("date") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5525385e85f7429e233d4a0fa" ON "activity" ("time") `);
        await queryRunner.query(`CREATE INDEX "IDX_f27285af15ef48363745ab2d79" ON "activity" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_0e36a2c95e2f1df7f1b3059d24" ON "activity" ("source") `);
        await queryRunner.query(`CREATE INDEX "IDX_ffd736f18ba71b3221e4f835a9" ON "activity" ("recordedAt") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_ffd736f18ba71b3221e4f835a9"`);
        await queryRunner.query(`DROP INDEX "IDX_0e36a2c95e2f1df7f1b3059d24"`);
        await queryRunner.query(`DROP INDEX "IDX_f27285af15ef48363745ab2d79"`);
        await queryRunner.query(`DROP INDEX "IDX_b5525385e85f7429e233d4a0fa"`);
        await queryRunner.query(`DROP INDEX "IDX_302b60a4970ffe94d5223f1c23"`);
        await queryRunner.query(`DROP INDEX "IDX_a28a1682ea80f10d1ecc7babaa"`);
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
exports.AddIndexesColumnsToTheActivityTable1680154573492 = AddIndexesColumnsToTheActivityTable1680154573492;
//# sourceMappingURL=1680154573492-AddIndexesColumnsToTheActivityTable.js.map