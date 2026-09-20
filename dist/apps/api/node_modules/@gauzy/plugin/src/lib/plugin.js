"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GauzyCorePlugin = GauzyCorePlugin;
const common_1 = require("@nestjs/common");
const constants_1 = require("@nestjs/common/constants");
const underscore_1 = require("underscore");
const plugin_metadata_1 = require("./plugin-metadata");
/**
 * Decorator function for extending NestJS features with additional metadata.
 *
 * @param pluginMetadata Metadata to be applied to the target class.
 * @returns Class decorator function.
 */
function GauzyCorePlugin(pluginMetadata) {
    return (targetClass) => {
        // Iterate over properties in PLUGIN_METADATA
        for (const metadataProperty of Object.values(plugin_metadata_1.PLUGIN_METADATA)) {
            const property = metadataProperty;
            // Check if the property exists in pluginMetadata and is not undefined
            if (property in pluginMetadata && pluginMetadata[property] !== undefined) {
                // Set metadata on the target class using Reflect
                Reflect.defineMetadata(property, pluginMetadata[property] || [], targetClass);
            }
        }
        // Pick relevant metadata from pluginMetadata based on MODULE_METADATA values
        const metadata = (0, underscore_1.pick)(pluginMetadata, Object.values(constants_1.MODULE_METADATA));
        // Apply the Module decorator with the picked metadata
        (0, common_1.Module)(metadata)(targetClass);
    };
}
//# sourceMappingURL=plugin.js.map