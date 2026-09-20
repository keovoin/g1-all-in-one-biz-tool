"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROJECT_TIED_ENTITIES = void 0;
const contracts_1 = require("@gauzy/contracts");
/**
 * Project-tied entities that need to be synchronized.
 */
exports.PROJECT_TIED_ENTITIES = [
    {
        entity: contracts_1.IntegrationEntity.TASK,
        sync: true
    },
    {
        entity: contracts_1.IntegrationEntity.ACTIVITY,
        sync: true
    },
    {
        entity: contracts_1.IntegrationEntity.SCREENSHOT,
        sync: true
    }
];
//# sourceMappingURL=integration-entity-setting-tied.js.map