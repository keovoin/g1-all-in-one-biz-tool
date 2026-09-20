"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedIntegrationTable1691494801748 = void 0;
const uuid_1 = require("uuid");
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
const utils_1 = require("./../../core/seeds/utils");
const default_integration_1 = require("./../../integration/default-integration");
const utils_2 = require("./../../integration/utils");
// Get the application configuration
const config = (0, config_1.getConfig)();
class SeedIntegrationTable1691494801748 {
    constructor() {
        this.name = 'SeedIntegrationTable1691494801748';
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
                await this.sqliteUpsertIntegrationsAndIntegrationTypes(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresUpsertIntegrationsAndIntegrationTypes(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlUpsertIntegrationsAndIntegrationTypes(queryRunner);
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
    async down(queryRunner) { }
    /**
     * Sqlite Upsert integrations and integration types
     *
     * @param queryRunner
     */
    async sqliteUpsertIntegrationsAndIntegrationTypes(queryRunner) {
        for await (const { name, imgSrc, isComingSoon, order, integrationTypesMap } of default_integration_1.DEFAULT_SYSTEM_INTEGRATIONS) {
            try {
                const filePath = (0, utils_1.copyAssets)(imgSrc, config, 'integrations');
                const payload = [name, filePath, isComingSoon ? 1 : 0, order];
                // For SQLite, manually generate a UUID using uuidv4()
                const generatedId = (0, uuid_1.v4)();
                payload.push(generatedId);
                const upsertQuery = `
					INSERT INTO "integration" ("name", "imgSrc", "isComingSoon", "order", "id")
					VALUES (?, ?, ?, ?, ?)
					ON CONFLICT ("name")
					DO UPDATE SET "imgSrc" = EXCLUDED."imgSrc",
									"isComingSoon" = EXCLUDED."isComingSoon",
									"order" = EXCLUDED."order"
					RETURNING "id";
				`;
                const [integration] = await queryRunner.query(upsertQuery, payload);
                await utils_2.IntegrationsUtils.syncIntegrationType(queryRunner, integration, await utils_2.IntegrationsUtils.getIntegrationTypeByName(queryRunner, integrationTypesMap));
            }
            catch (error) {
                // since we have errors let's rollback changes we made
                console.log(`Error while updating integration: (${name}) in production server`, error);
            }
        }
    }
    /**
     * Postgres Upsert integrations and integration types
     *
     * @param queryRunner
     */
    async postgresUpsertIntegrationsAndIntegrationTypes(queryRunner) {
        for await (const { name, imgSrc, isComingSoon, order, integrationTypesMap } of default_integration_1.DEFAULT_SYSTEM_INTEGRATIONS) {
            try {
                const filePath = (0, utils_1.copyAssets)(imgSrc, config, 'integrations');
                const payload = [name, filePath, isComingSoon, order];
                const upsertQuery = `
					INSERT INTO "integration" (
						"name", "imgSrc", "isComingSoon", "order"
					)
					VALUES (
						$1, $2, $3, $4
					)
					ON CONFLICT(name) DO UPDATE
					SET
						"imgSrc" = $2,
						"isComingSoon" = $3,
						"order" = $4
					RETURNING id;
				`;
                const [integration] = await queryRunner.query(upsertQuery, payload);
                await utils_2.IntegrationsUtils.syncIntegrationType(queryRunner, integration, await utils_2.IntegrationsUtils.getIntegrationTypeByName(queryRunner, integrationTypesMap));
            }
            catch (error) {
                // since we have errors let's rollback changes we made
                console.log(`Error while updating integration: (${name}) in production server`, error);
            }
        }
    }
    /**
     * Postgres Upsert integrations and integration types
     *
     * @param queryRunner
     */
    async mysqlUpsertIntegrationsAndIntegrationTypes(queryRunner) { }
}
exports.SeedIntegrationTable1691494801748 = SeedIntegrationTable1691494801748;
//# sourceMappingURL=1691494801748-SeedIntegrationTable.js.map