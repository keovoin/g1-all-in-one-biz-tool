"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndexesColumnsToTheScreenshotTable1680110810109 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddIndexesColumnsToTheScreenshotTable1680110810109 {
    constructor() {
        this.name = 'AddIndexesColumnsToTheScreenshotTable1680110810109';
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
        await queryRunner.query(`CREATE INDEX "IDX_3d7feb5fe793e4811cdb79f983" ON "screenshot" ("recordedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_785958f324b568a307c9496909" ON "screenshot" ("deletedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b374e5cdee1145ebb2a832f20" ON "screenshot" ("storageProvider") `);
    }
    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_2b374e5cdee1145ebb2a832f20"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_785958f324b568a307c9496909"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d7feb5fe793e4811cdb79f983"`);
    }
    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`CREATE INDEX "IDX_3d7feb5fe793e4811cdb79f983" ON "screenshot" ("recordedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_785958f324b568a307c9496909" ON "screenshot" ("deletedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b374e5cdee1145ebb2a832f20" ON "screenshot" ("storageProvider") `);
    }
    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_2b374e5cdee1145ebb2a832f20"`);
        await queryRunner.query(`DROP INDEX "IDX_785958f324b568a307c9496909"`);
        await queryRunner.query(`DROP INDEX "IDX_3d7feb5fe793e4811cdb79f983"`);
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
exports.AddIndexesColumnsToTheScreenshotTable1680110810109 = AddIndexesColumnsToTheScreenshotTable1680110810109;
//# sourceMappingURL=1680110810109-AddIndexesColumnsToTheScreenshotTable.js.map