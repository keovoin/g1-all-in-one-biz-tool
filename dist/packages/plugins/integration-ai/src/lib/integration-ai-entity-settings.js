"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ENTITY_SETTINGS = void 0;
const contracts_1 = require("@gauzy/contracts");
/**
 * Default entity settings for AI integrations.
 *
 * Each entity setting consists of an entity type and a sync flag.
 * The sync flag determines whether the entity type should be synced with the AI integration.
 */
exports.DEFAULT_ENTITY_SETTINGS = [
    {
        entity: contracts_1.IntegrationEntity.JOB_MATCHING,
        sync: true
    },
    {
        entity: contracts_1.IntegrationEntity.EMPLOYEE_PERFORMANCE,
        sync: true
    }
];
//# sourceMappingURL=integration-ai-entity-settings.js.map