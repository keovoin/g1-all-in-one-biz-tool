"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLanguage1696704276300 = void 0;
const language_utils_1 = require("../../language/language-utils");
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AddLanguage1696704276300 {
    constructor() {
        this.name = 'AddLanguage1696704276300';
    }
    /**
     * Up Migration
     *
     * @param queryRunner
     */
    async up(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        switch (queryRunner.connection.options.type) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
            case config_1.DatabaseTypeEnum.postgres:
                await this.sqlitePostgresUpAddLanguage(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlUpAddLanguage(queryRunner);
                break;
            default:
                throw Error(`Unsupported database: ${queryRunner.connection.options.type}`);
        }
    }
    /**
     * Down Migration
     *
     * @param queryRunner
     */
    async down(queryRunner) { }
    /**
     * Sqlite | better-sqlite3 | Postgres Up Migration
     *
     * @param queryRunner
     */
    async sqlitePostgresUpAddLanguage(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        await language_utils_1.LanguageUtils.migrateLanguages(queryRunner);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpAddLanguage(queryRunner) { }
}
exports.AddLanguage1696704276300 = AddLanguage1696704276300;
//# sourceMappingURL=1696704276300-AddLanguage.js.map