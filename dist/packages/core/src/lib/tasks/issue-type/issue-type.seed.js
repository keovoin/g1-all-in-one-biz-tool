"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultIssueTypes = void 0;
const path = require("path");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("./../../core/entities/internal");
const utils_1 = require("./../../core/seeds/utils");
const default_global_issue_types_1 = require("./default-global-issue-types");
const issue_type_entity_1 = require("./issue-type.entity");
// Get the application configuration
const config = (0, config_1.getConfig)();
/**
 * Creates default issue types for the system.
 *
 * This function is responsible for:
 * - Cleaning existing assets related to issue types.
 * - Copying default issue type icons to the appropriate asset directories.
 * - Calculating dimensions and size of the icons.
 * - Saving the issue types along with their associated icons in the database.
 *
 * @param dataSource The database connection/data source.
 * @returns A promise resolving to an array of saved issue types.
 *
 * @throws Logs errors related to asset copying, icon saving, or issue type saving.
 */
const createDefaultIssueTypes = async (dataSource) => {
    // Check if running in Electron
    const isElectron = config_1.environment.isElectron;
    // Determine if running from dist or source
    const isDist = __dirname.includes('dist');
    // Default public directory for assets
    const publicDir = isDist
        ? path.resolve(process.cwd(), 'apps/api/public') // Adjusted for dist structure
        : path.resolve(__dirname, '../../../apps/api/public');
    // Determine the base directory for assets
    const assetPublicPath = isElectron
        ? path.resolve(config_1.environment.gauzyUserPath, 'public')
        : config.assetOptions?.assetPublicPath || publicDir; // Custom public directory path from configuration.
    try {
        // Clean up old issue type assets
        await (0, utils_1.cleanAssets)(config, path.join('ever-icons', 'task-issue-types'));
        let issueTypes = [];
        // Iterate through default global issue types and process each.
        for await (const issueType of default_global_issue_types_1.DEFAULT_GLOBAL_ISSUE_TYPES) {
            try {
                // Copy issue type icon and get its path.
                const iconPath = (0, utils_1.copyAssets)(issueType.icon, config, 'ever-icons');
                // Calculate dimensions and size of the icon.
                const absoluteFilePath = path.join(assetPublicPath, iconPath);
                // Get image dimensions.
                const { height, width, size } = await (0, utils_1.getImageDimensions)(absoluteFilePath);
                // Create a new image asset for the icon.
                const icon = new internal_1.ImageAsset();
                icon.name = issueType.name;
                icon.url = iconPath;
                icon.storageProvider = contracts_1.FileStorageProviderEnum.LOCAL;
                icon.height = height;
                icon.width = width;
                icon.size = size;
                // Save the image asset in the database.
                const image = await dataSource.getRepository(internal_1.ImageAsset).save(icon);
                // Create and save the issue type with the associated icon.
                issueTypes.push(new issue_type_entity_1.IssueType({ ...issueType, icon: iconPath, image }));
            }
            catch (error) {
                console.error('Error while saving issue type icon:', error?.message);
                // Fallback to creating the issue type without an associated icon.
                issueTypes.push(new issue_type_entity_1.IssueType({ ...issueType, icon: undefined }));
            }
        }
        // Save all issue types in the database.
        return await dataSource.manager.save(issueTypes);
    }
    catch (error) {
        console.log('Error while moving task issue type icons', error);
    }
};
exports.createDefaultIssueTypes = createDefaultIssueTypes;
//# sourceMappingURL=issue-type.seed.js.map