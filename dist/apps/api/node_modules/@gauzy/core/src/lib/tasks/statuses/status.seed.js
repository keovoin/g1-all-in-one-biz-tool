"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultStatuses = void 0;
const config_1 = require("@gauzy/config");
const utils_1 = require("./../../core/seeds/utils");
const default_global_statuses_1 = require("./default-global-statuses");
const status_entity_1 = require("./status.entity");
// Get the application configuration
const config = (0, config_1.getConfig)();
/**
 * Creates default global system task statuses.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @returns A promise that resolves to an array of saved task statuses.
 */
const createDefaultStatuses = async (dataSource) => {
    try {
        // Clean task status assets directory
        await (0, utils_1.cleanAssets)(config, 'ever-icons/task-statuses');
        // Map default statuses to TaskStatus entities with updated icons
        const statuses = default_global_statuses_1.DEFAULT_GLOBAL_STATUSES.map((status) => new status_entity_1.TaskStatus({
            ...status,
            icon: (0, utils_1.copyAssets)(status.icon, config, 'ever-icons')
        }));
        // Save all statuses in the database and return them
        return dataSource.manager.save(statuses);
    }
    catch (error) {
        console.log('Error while moving task status icons', error);
    }
};
exports.createDefaultStatuses = createDefaultStatuses;
//# sourceMappingURL=status.seed.js.map