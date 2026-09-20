"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ENTITY_SETTINGS = void 0;
const contracts_1 = require("@gauzy/contracts");
/**
 * Default settings for entities to be synchronized.
 */
exports.DEFAULT_ENTITY_SETTINGS = [
    {
        entity: contracts_1.IntegrationEntity.ORGANIZATION,
        sync: true
    },
    {
        entity: contracts_1.IntegrationEntity.PROJECT,
        sync: true
    },
    {
        entity: contracts_1.IntegrationEntity.CLIENT,
        sync: true
    }
];
//# sourceMappingURL=integration-entity-settings.js.map