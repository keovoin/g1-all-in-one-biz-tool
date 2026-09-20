"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsUtils = void 0;
const uuid_1 = require("uuid");
const config_1 = require("@gauzy/config");
const database_helper_1 = require("./../database/database.helper");
const utils_1 = require("./../core/seeds/utils");
const default_integration_type_1 = require("./default-integration-type");
// Get the application configuration
const config = (0, config_1.getConfig)();
class IntegrationsUtils {
    /**
     *
     * @param queryRunner
     */
    static async upsertIntegrationsAndIntegrationTypes(queryRunner, integrations) {
        for await (const { name, imgSrc, isComingSoon, order, redirectUrl, provider, integrationTypesMap } of integrations) {
            try {
                const filePath = (0, utils_1.copyAssets)(imgSrc, config, 'integrations');
                const sqliteUpsertQuery = `
					INSERT INTO integration (
						"name", "imgSrc", "isComingSoon", "order", "redirectUrl", "provider", "id"
					)
					VALUES (
						?, ?, ?, ?, ?, ?, ?
					)
					ON CONFLICT("name")
					DO UPDATE SET "imgSrc" = EXCLUDED."imgSrc",
									"isComingSoon" = EXCLUDED."isComingSoon",
									"order" = EXCLUDED."order",
									"redirectUrl" = EXCLUDED."redirectUrl",
									"provider" = EXCLUDED."provider"
					RETURNING id;
				`;
                const postgresUpsertQuery = `
					INSERT INTO "integration" (
						"name", "imgSrc", "isComingSoon", "order", "redirectUrl", "provider"
					)
					VALUES (
						$1, $2, $3, $4, $5, $6
					)
					ON CONFLICT(name) DO UPDATE
					SET
						"imgSrc" = $2,
						"isComingSoon" = $3,
						"order" = $4,
						"redirectUrl" = $5,
						"provider" = $6
					RETURNING id;
				`;
                const mysqlUpsertQuery = (0, database_helper_1.prepareSQLQuery)(`
					INSERT INTO "integration" (
						"name", "imgSrc", "isComingSoon", "order", "redirectUrl", "provider"
					) VALUES (
						?, ?, ?, ?, ?, ?
					) ON DUPLICATE KEY UPDATE
					"imgSrc" = VALUES("imgSrc"),
					"isComingSoon" = VALUES("isComingSoon"),
					"order" = VALUES("order"),
					"redirectUrl" = VALUES("redirectUrl"),
					"provider" = VALUES("provider");
				`);
                let upsertQuery = ``;
                let payload;
                switch (queryRunner.dataSource.options.type) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        payload = [name, filePath, isComingSoon ? 1 : 0, order, redirectUrl, provider];
                        // For SQLite, manually generate a UUID using uuidv4()
                        const generatedId = (0, uuid_1.v4)();
                        payload.push(generatedId);
                        upsertQuery = sqliteUpsertQuery;
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        payload = [name, filePath, isComingSoon, order, redirectUrl, provider];
                        upsertQuery = postgresUpsertQuery;
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        payload = [name, filePath, isComingSoon, order, redirectUrl, provider];
                        upsertQuery = mysqlUpsertQuery;
                        break;
                    default:
                        throw Error(`cannot upsert integration and integration types due to unsupported database type: ${queryRunner.dataSource.options.type}`);
                }
                const [integration] = await queryRunner.query(upsertQuery, payload);
                // Step 3: Insert entry in join table to associate Integration with IntegrationType
                await IntegrationsUtils.syncIntegrationType(queryRunner, integration, await this.getIntegrationTypeByName(queryRunner, integrationTypesMap));
            }
            catch (error) {
                // since we have errors let's rollback changes we made
                console.log(`Error while updating integration: (${name}) in production server`, error);
            }
        }
    }
    /**
     *
     * @param queryRunner
     * @param integrationTypesMap
     * @returns
     */
    static async getIntegrationTypeByName(queryRunner, integrationTypeNames) {
        try {
            return await queryRunner.query((0, database_helper_1.prepareSQLQuery)(`SELECT * FROM "integration_type" WHERE "integration_type"."name" IN ('${integrationTypeNames.join("','")}')`));
        }
        catch (error) {
            console.log('Error while querying integration types:', error);
            return [];
        }
    }
    /**
     *
     * @param queryRunner
     * @param integrationTypeName
     */
    static async upsertIntegrationTypes(queryRunner, integrationTypeNames) {
        for await (const integrationTypeName of integrationTypeNames) {
            const { name, description, icon, groupName, order } = default_integration_type_1.DEFAULT_INTEGRATION_TYPES.find((type) => type.name === integrationTypeName);
            const payload = [name, description, icon, groupName, order];
            const sqliteUpsertQuery = `
				INSERT INTO "integration_type" (
					"name", "description", "icon", "groupName", "order", "id"
				)
				VALUES (
					?, ?, ?, ?, ?, ?
				)
				ON CONFLICT("name")
				DO UPDATE SET "description" = EXCLUDED."description",
								"icon" = EXCLUDED."icon",
								"groupName" = EXCLUDED."groupName",
								"order" = EXCLUDED."order"
				RETURNING id;
			`;
            const postgresUpsertQuery = `
				INSERT INTO "integration_type" (
					"name", "description", "icon", "groupName", "order"
				)
				VALUES (
					$1, $2, $3, $4, $5
				)
				ON CONFLICT(name) DO UPDATE
				SET
					"description" = $2,
					"icon" = $3,
					"groupName" = $4,
					"order" = $5
				RETURNING id;
			`;
            const mysqlUpsertQuery = (0, database_helper_1.prepareSQLQuery)(`
				INSERT INTO "integration_type" (
					"name", "description", "icon", "groupName", "order"
				) VALUES (
					?, ?, ?, ?, ?
				) ON DUPLICATE KEY UPDATE
					"description" = VALUES("description"),
					"icon" = VALUES("icon"),
					"groupName" = VALUES("groupName"),
					"order" = VALUES("order")
				RETURNING id;
			`);
            let upsertQuery = ``;
            switch (queryRunner.dataSource.options.type) {
                case config_1.DatabaseTypeEnum.sqlite:
                case config_1.DatabaseTypeEnum.betterSqlite3:
                    // For SQLite, manually generate a UUID using uuidv4()
                    const generatedId = (0, uuid_1.v4)();
                    payload.push(generatedId);
                    upsertQuery = sqliteUpsertQuery;
                    break;
                case config_1.DatabaseTypeEnum.postgres:
                    upsertQuery = postgresUpsertQuery;
                    break;
                case config_1.DatabaseTypeEnum.mysql:
                    upsertQuery = mysqlUpsertQuery;
                    break;
                default:
                    throw Error(`cannot upsert integration types due to unsupported database type: ${queryRunner.dataSource.options.type}`);
            }
            await queryRunner.query(upsertQuery, payload);
        }
    }
    /**
     *
     *
     * @param queryRunner
     * @param integration
     * @param integrationTypes
     */
    static async syncIntegrationType(queryRunner, integration, integrationTypes) {
        if (integration) {
            const integrationId = integration.id;
            for await (const integrationType of integrationTypes) {
                let insertPivotQuery = ``;
                const sqliteUpsertQuery = `
					INSERT OR IGNORE INTO integration_integration_type (integrationId, integrationTypeId) VALUES (?, ?);
				`;
                const postgresUpsertQuery = `
					INSERT INTO "integration_integration_type" (
                        "integrationId",
                        "integrationTypeId"
                    )
                    SELECT
                        $1, $2
                    WHERE NOT EXISTS (
                        SELECT 1
                            FROM "integration_integration_type"
                        WHERE
                            "integrationId" = $1 AND
                            "integrationTypeId" = $2
                    )
				`;
                const mysqlUpsertQuery = (0, database_helper_1.prepareSQLQuery)(`
					INSERT INTO integration_integration_type (integrationId, integrationTypeId)
					SELECT
						?, ?
					FROM
						DUAL
					WHERE NOT EXISTS (
						SELECT 1
						FROM integration_integration_type
						WHERE
							integrationId = ? AND
							integrationTypeId = ?
					);
				`);
                switch (queryRunner.dataSource.options.type) {
                    case config_1.DatabaseTypeEnum.sqlite:
                    case config_1.DatabaseTypeEnum.betterSqlite3:
                        insertPivotQuery = sqliteUpsertQuery;
                        break;
                    case config_1.DatabaseTypeEnum.postgres:
                        insertPivotQuery = postgresUpsertQuery;
                        break;
                    case config_1.DatabaseTypeEnum.mysql:
                        insertPivotQuery = mysqlUpsertQuery;
                        break;
                    default:
                        throw Error(`cannot sync integration types due to unsupported database type: ${queryRunner.dataSource.options.type}`);
                }
                await queryRunner.query(insertPivotQuery, [integrationId, integrationType.id]);
            }
        }
    }
}
exports.IntegrationsUtils = IntegrationsUtils;
//# sourceMappingURL=utils.js.map