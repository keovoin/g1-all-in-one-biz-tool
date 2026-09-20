"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultVersions = void 0;
const default_global_versions_1 = require("./default-global-versions");
const version_entity_1 = require("./version.entity");
/**
 * Default global system version
 *
 * @param dataSource
 * @returns
 */
const createDefaultVersions = async (dataSource) => {
    let versions = [];
    for await (const version of default_global_versions_1.DEFAULT_GLOBAL_VERSIONS) {
        versions.push(new version_entity_1.TaskVersion(version));
    }
    return await dataSource.manager.save(versions);
};
exports.createDefaultVersions = createDefaultVersions;
//# sourceMappingURL=version.seed.js.map