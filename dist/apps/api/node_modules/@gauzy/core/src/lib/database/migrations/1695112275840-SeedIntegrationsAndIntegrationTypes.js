"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedIntegrationsAndIntegrationTypes1695112275840 = void 0;
const chalk = require("chalk");
const contracts_1 = require("@gauzy/contracts");
const default_integration_1 = require("../../integration/default-integration");
const utils_1 = require("../../integration/utils");
const config_1 = require("@gauzy/config");
class SeedIntegrationsAndIntegrationTypes1695112275840 {
    constructor() {
        this.name = 'SeedIntegrationsAndIntegrationTypes1695112275840';
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
                await this.sqlitePostgresUpsert(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlUpsert(queryRunner);
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
    async sqlitePostgresUpsert(queryRunner) {
        console.log(chalk.yellow(this.name + ' start running!'));
        await utils_1.IntegrationsUtils.upsertIntegrationTypes(queryRunner, [contracts_1.IntegrationTypeEnum.PROJECT_MANAGEMENT]);
        await utils_1.IntegrationsUtils.upsertIntegrationsAndIntegrationTypes(queryRunner, default_integration_1.PROJECT_MANAGE_DEFAULT_INTEGRATIONS);
        await utils_1.IntegrationsUtils.upsertIntegrationsAndIntegrationTypes(queryRunner, default_integration_1.DEFAULT_INTEGRATIONS);
    }
    /**
    * MySQL Up Migration
    *
    * @param queryRunner
    */
    async mysqlUpsert(queryRunner) { }
}
exports.SeedIntegrationsAndIntegrationTypes1695112275840 = SeedIntegrationsAndIntegrationTypes1695112275840;
//# sourceMappingURL=1695112275840-SeedIntegrationsAndIntegrationTypes.js.map