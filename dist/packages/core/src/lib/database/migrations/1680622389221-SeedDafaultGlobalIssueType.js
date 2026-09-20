"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedDafaultGlobalIssueType1680622389221 = void 0;
const chalk = require("chalk");
const uuid_1 = require("uuid");
const path = require("path");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("./../../core/seeds/utils");
const default_global_issue_types_1 = require("./../../tasks/issue-type/default-global-issue-types");
const core_1 = require("../../core");
// Get the application configuration
const config = (0, config_1.getConfig)();
class SeedDafaultGlobalIssueType1680622389221 {
    constructor() {
        this.name = 'SeedDafaultGlobalIssueType1680622389221';
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
                await this.sqliteSeedDefaultIssueTypes(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                await this.postgresSeedDefaultIssueTypes(queryRunner);
                break;
            case config_1.DatabaseTypeEnum.mysql:
                await this.mysqlSeedDefaultIssueTypes(queryRunner);
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
     * Sqlite default global issue types
     *
     * @param queryRunner
     */
    async sqliteSeedDefaultIssueTypes(queryRunner) {
        try {
            // Default public directory for assets
            const publicDir = (0, core_1.getApiPublicPath)();
            // Determine the base directory for assets
            const assetPublicPath = config_1.environment.isElectron
                ? path.resolve(process.env.GAUZY_USER_PATH || '', 'public') // Electron-specific path
                : config.assetOptions?.assetPublicPath || publicDir; // Custom public directory path from configuration.
            for await (const issueType of default_global_issue_types_1.DEFAULT_GLOBAL_ISSUE_TYPES) {
                // Copy issue type icon and get its path
                const filePath = (0, utils_1.copyAssets)(issueType.icon, config, 'ever-icons');
                // Calculate dimensions and size of the icon
                const absoluteFilePath = path.join(assetPublicPath, filePath);
                // Get image dimensions
                const { height, width, size } = await (0, utils_1.getImageDimensions)(absoluteFilePath);
                const { name, value, description, color, isSystem } = issueType;
                const payload = [name, value, description, filePath, color, isSystem ? 1 : 0];
                const imageAsset = [name, filePath, contracts_1.FileStorageProviderEnum.LOCAL, height, width, size];
                const imageAssetId = (0, uuid_1.v4)();
                imageAsset.push(imageAssetId);
                const insertQuery = `
					INSERT INTO image_asset (
						"name", "url", "storageProvider", "height", "width", "size", "id"
					)
					VALUES (
						?, ?, ?, ?, ?, ?, ?
					);
				`;
                await queryRunner.dataSource.manager.query(insertQuery, imageAsset);
                payload.push((0, uuid_1.v4)(), imageAssetId);
                await queryRunner.dataSource.manager.query(`
					INSERT INTO "issue_type" (
						"name", "value", "description", "icon", "color", "isSystem", "id", "imageId"
					) VALUES (
						?, ?, ?, ?, ?, ?, ?, ?);
					`, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert default global issue types in production server', error);
        }
    }
    /**
     * Postgres default global issue types
     *
     * @param queryRunner
     */
    async postgresSeedDefaultIssueTypes(queryRunner) {
        try {
            // Default public directory for assets
            const publicDir = (0, core_1.getApiPublicPath)();
            // Determine the base directory for assets
            const assetPublicPath = config_1.environment.isElectron
                ? path.resolve(process.env.GAUZY_USER_PATH || '', 'public') // Electron-specific path
                : config.assetOptions?.assetPublicPath || publicDir; // Custom public directory path from configuration.
            for await (const issueType of default_global_issue_types_1.DEFAULT_GLOBAL_ISSUE_TYPES) {
                const { name, value, description, color, isSystem } = issueType;
                // Copy issue type icon and get its path
                const filePath = (0, utils_1.copyAssets)(issueType.icon, config, 'ever-icons');
                // Calculate dimensions and size of the icon
                const absoluteFilePath = path.join(assetPublicPath, filePath);
                // Get image dimensions
                const { height, width, size } = await (0, utils_1.getImageDimensions)(absoluteFilePath);
                const payload = [name, value, description, filePath, color, isSystem];
                const insertQuery = `
					INSERT INTO "image_asset" (
						"name", "url", "storageProvider", "height", "width", "size"
					) VALUES (
						$1, $2, $3, $4, $5, $6
					)
					RETURNING id;
				`;
                const imageAsset = [name, filePath, contracts_1.FileStorageProviderEnum.LOCAL, height, width, size];
                const image_asset = await queryRunner.dataSource.manager.query(insertQuery, imageAsset);
                const imageAssetId = image_asset[0]['id'];
                payload.push(imageAssetId);
                await queryRunner.dataSource.manager.query(`
					INSERT INTO "issue_type" (
						"name", "value", "description", "icon", "color", "isSystem", "imageId"
					) VALUES (
						$1, $2, $3, $4, $5, $6, $7
					);
				`, payload);
            }
        }
        catch (error) {
            // since we have errors let's rollback changes we made
            console.log('Error while insert default global issue types in production server', error);
        }
    }
    /**
     * MySQL default global issue types
     *
     * @param queryRunner
     */
    async mysqlSeedDefaultIssueTypes(queryRunner) { }
}
exports.SeedDafaultGlobalIssueType1680622389221 = SeedDafaultGlobalIssueType1680622389221;
//# sourceMappingURL=1680622389221-SeedDafaultGlobalIssueType.js.map