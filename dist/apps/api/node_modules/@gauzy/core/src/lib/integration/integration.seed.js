"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultIntegrations = void 0;
const config_1 = require("@gauzy/config");
const utils_1 = require("./../core/seeds/utils");
const integration_entity_1 = require("./integration.entity");
const default_integration_1 = require("./default-integration");
// Get the application configuration
const config = (0, config_1.getConfig)();
/**
 * Creates default integrations by mapping predefined integrations to their respective types,
 * copying assets, and saving them to the database.
 *
 * If no `integrationTypes` are provided, the function logs a warning and exits without creating integrations.
 *
 * @param dataSource - The data source for database operations.
 * @param integrationTypes - An array of available integration types or void if none are provided.
 * @returns A promise resolving to the created `IIntegration[]` or void if no integrations are created.
 */
const createDefaultIntegrations = async (dataSource, integrationTypes) => {
    // Ensure integrationTypes are provided
    if (!integrationTypes) {
        console.warn('Warning: integrationTypes not found, DefaultIntegrations will not be created');
        return;
    }
    // Clean up old assets in the integrations directory
    await (0, utils_1.cleanAssets)(config, 'integrations');
    // Map and create new integration entities
    const integrations = await Promise.all(default_integration_1.DEFAULT_INTEGRATIONS.map(async (integration) => {
        const { name, imgSrc, isComingSoon, integrationTypesMap, order, provider, redirectUrl } = integration;
        // Create a new Integration entity
        const entity = new integration_entity_1.Integration();
        entity.name = name;
        entity.imgSrc = (0, utils_1.copyAssets)(imgSrc, config, 'integrations');
        entity.isComingSoon = isComingSoon;
        entity.order = order;
        entity.redirectUrl = redirectUrl;
        entity.provider = provider;
        // Associate integration types by filtering the provided types
        entity.integrationTypes = integrationTypes.filter((type) => integrationTypesMap.includes(type.name));
        return entity;
    }));
    // Save the created integrations to the database
    return insertIntegrations(dataSource, integrations);
};
exports.createDefaultIntegrations = createDefaultIntegrations;
/**
 * Inserts integrations into the database.
 *
 * @param dataSource - The data source for database operations.
 * @param integrations - An array of integrations to be inserted.
 * @returns A promise resolving to the saved integrations.
 */
const insertIntegrations = (dataSource, integrations) => {
    return dataSource.manager.save(integrations);
};
//# sourceMappingURL=integration.seed.js.map