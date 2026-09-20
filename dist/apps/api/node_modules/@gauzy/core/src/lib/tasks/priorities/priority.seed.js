"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultPriorities = void 0;
const config_1 = require("@gauzy/config");
const utils_1 = require("./../../core/seeds/utils");
const default_global_priorities_1 = require("./default-global-priorities");
const priority_entity_1 = require("./priority.entity");
// Get the application configuration
const config = (0, config_1.getConfig)();
/**
 * Default global system priorities.
 *
 * Creates and saves default task priorities in the database, ensuring associated icons
 * are copied to the correct asset location. Cleans up existing assets before processing.
 *
 * @param dataSource - The data source for database operations.
 * @returns A promise resolving to the created `ITaskPriority[]`.
 */
const createDefaultPriorities = async (dataSource) => {
    try {
        // Clean up old task priority assets
        await (0, utils_1.cleanAssets)(config, 'ever-icons/task-priorities');
        // Map default priorities to TaskPriority entities with updated icons
        const priorities = default_global_priorities_1.DEFAULT_GLOBAL_PRIORITIES.map((priority) => new priority_entity_1.TaskPriority({
            ...priority,
            icon: (0, utils_1.copyAssets)(priority.icon, config, 'ever-icons')
        }));
        // Save all task priorities to the database
        return dataSource.manager.save(priorities);
    }
    catch (error) {
        console.log('Error while saving task priorities', error);
    }
};
exports.createDefaultPriorities = createDefaultPriorities;
//# sourceMappingURL=priority.seed.js.map