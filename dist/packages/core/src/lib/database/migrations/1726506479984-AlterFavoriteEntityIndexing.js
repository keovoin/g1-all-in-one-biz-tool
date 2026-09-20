"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterFavoriteEntityIndexing1726506479984 = void 0;
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
class AlterFavoriteEntityIndexing1726506479984 {
    constructor() {
        this.name = 'AlterFavoriteEntityIndexing1726506479984';
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
                await this.sqliteUpQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresUpQueryRunner(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlUpQueryRunner(queryRunner);
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
    async down(queryRunner) {
        switch (queryRunner.connection.options.type) {
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
                throw Error(`Unsupported database: ${queryRunner.connection.options.type}`);
        }
    }
    /**
     * PostgresDB Up Migration
     *
     * @param queryRunner
     */
    async postgresUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_a8d924902879f0a3349678c86f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4734abeedbb9c724c980f7f54"`);
        await queryRunner.query(`CREATE INDEX "IDX_837468421e96f22a2e12022ef0" ON "favorite" ("entity") `);
        await queryRunner.query(`CREATE INDEX "IDX_e88acab853ab012582c6d0f3f6" ON "favorite" ("entityId") `);
    }
    /**
     * PostgresDB Down Migration
     *
     * @param queryRunner
     */
    async postgresDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_e88acab853ab012582c6d0f3f6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_837468421e96f22a2e12022ef0"`);
        await queryRunner.query(`CREATE INDEX "IDX_b4734abeedbb9c724c980f7f54" ON "favorite" ("entityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8d924902879f0a3349678c86f" ON "favorite" ("entity") `);
    }
    /**
     * SqliteDB and BetterSQlite3DB Up Migration
     *
     * @param queryRunner
     */
    async sqliteUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_b4734abeedbb9c724c980f7f54"`);
        await queryRunner.query(`DROP INDEX "IDX_a8d924902879f0a3349678c86f"`);
        await queryRunner.query(`CREATE INDEX "IDX_837468421e96f22a2e12022ef0" ON "favorite" ("entity") `);
        await queryRunner.query(`CREATE INDEX "IDX_e88acab853ab012582c6d0f3f6" ON "favorite" ("entityId") `);
    }
    /**
     * SqliteDB and BetterSQlite3DB Down Migration
     *
     * @param queryRunner
     */
    async sqliteDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_e88acab853ab012582c6d0f3f6"`);
        await queryRunner.query(`DROP INDEX "IDX_837468421e96f22a2e12022ef0"`);
        await queryRunner.query(`CREATE INDEX "IDX_a8d924902879f0a3349678c86f" ON "favorite" ("entity") `);
        await queryRunner.query(`CREATE INDEX "IDX_b4734abeedbb9c724c980f7f54" ON "favorite" ("entityId") `);
    }
    /**
     * MySQL Up Migration
     *
     * @param queryRunner
     */
    async mysqlUpQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_a8d924902879f0a3349678c86f\` ON \`favorite\``);
        await queryRunner.query(`DROP INDEX \`IDX_b4734abeedbb9c724c980f7f54\` ON \`favorite\``);
        await queryRunner.query(`CREATE INDEX \`IDX_837468421e96f22a2e12022ef0\` ON \`favorite\` (\`entity\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_e88acab853ab012582c6d0f3f6\` ON \`favorite\` (\`entityId\`)`);
    }
    /**
     * MySQL Down Migration
     *
     * @param queryRunner
     */
    async mysqlDownQueryRunner(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_e88acab853ab012582c6d0f3f6\` ON \`favorite\``);
        await queryRunner.query(`DROP INDEX \`IDX_837468421e96f22a2e12022ef0\` ON \`favorite\``);
        await queryRunner.query(`CREATE INDEX \`IDX_b4734abeedbb9c724c980f7f54\` ON \`favorite\` (\`entityId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_a8d924902879f0a3349678c86f\` ON \`favorite\` (\`entity\`)`);
    }
}
exports.AlterFavoriteEntityIndexing1726506479984 = AlterFavoriteEntityIndexing1726506479984;
//# sourceMappingURL=1726506479984-AlterFavoriteEntityIndexing.js.map