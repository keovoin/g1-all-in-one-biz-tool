"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndexesColumnsToTheTimeSlotTable1680108987586 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddIndexesColumnsToTheTimeSlotTable1680108987586 {
    constructor() {
        this.name = 'AddIndexesColumnsToTheTimeSlotTable1680108987586';
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
        await queryRunner.query(`CREATE INDEX "IDX_0c707825a7c2ecc4e186b07ebf" ON "time_slot" ("duration") `);
        await queryRunner.query(`CREATE INDEX "IDX_f44e721669d5c6bed32cd6a3bf" ON "time_slot" ("overall") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6e7d1075bfd97eea6643b1479" ON "time_slot" ("startedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_7913305b850c7afc89b6ed96a3" ON "time_slot" ("employeeId") `);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_7913305b850c7afc89b6ed96a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6e7d1075bfd97eea6643b1479"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f44e721669d5c6bed32cd6a3bf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c707825a7c2ecc4e186b07ebf"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE INDEX "IDX_0c707825a7c2ecc4e186b07ebf" ON "time_slot" ("duration") `);
        await queryRunner.query(`CREATE INDEX "IDX_f44e721669d5c6bed32cd6a3bf" ON "time_slot" ("overall") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6e7d1075bfd97eea6643b1479" ON "time_slot" ("startedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_7913305b850c7afc89b6ed96a3" ON "time_slot" ("employeeId") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_7913305b850c7afc89b6ed96a3"`);
        await queryRunner.query(`DROP INDEX "IDX_c6e7d1075bfd97eea6643b1479"`);
        await queryRunner.query(`DROP INDEX "IDX_f44e721669d5c6bed32cd6a3bf"`);
        await queryRunner.query(`DROP INDEX "IDX_0c707825a7c2ecc4e186b07ebf"`);
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
exports.AddIndexesColumnsToTheTimeSlotTable1680108987586 = AddIndexesColumnsToTheTimeSlotTable1680108987586;
//# sourceMappingURL=1680108987586-AddIndexesColumnsToTheTimeSlotTable.js.map