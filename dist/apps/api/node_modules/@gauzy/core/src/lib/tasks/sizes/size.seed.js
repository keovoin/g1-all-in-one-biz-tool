"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultSizes = void 0;
const config_1 = require("@gauzy/config");
const utils_1 = require("./../../core/seeds/utils");
const default_global_sizes_1 = require("./default-global-sizes");
const size_entity_1 = require("./size.entity");
// Get the application configuration
const config = (0, config_1.getConfig)();
/**
 * Default global system sizes.
 *
 * Creates and saves default task sizes in the database, ensuring associated icons
 * are copied to the correct asset location. Cleans up existing assets before processing.
 *
 * @param dataSource - The data source for database operations.
 * @returns A promise resolving to the created `ITaskSize[]`.
 */
const createDefaultSizes = async (dataSource) => {
    try {
        // Clean up old task size assets
        await (0, utils_1.cleanAssets)(config, 'ever-icons/task-sizes');
        // Map default sizes to TaskSize entities with updated icons
        const sizes = default_global_sizes_1.DEFAULT_GLOBAL_SIZES.map((size) => new size_entity_1.TaskSize({
            ...size,
            icon: (0, utils_1.copyAssets)(size.icon, config, 'ever-icons')
        }));
        // Save all task sizes to the database
        return dataSource.manager.save(sizes);
    }
    catch (error) {
        console.log('Error while saving task sizes', error);
    }
};
exports.createDefaultSizes = createDefaultSizes;
//# sourceMappingURL=size.seed.js.map