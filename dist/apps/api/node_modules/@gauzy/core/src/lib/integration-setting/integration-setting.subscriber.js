"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSettingSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const integration_setting_entity_1 = require("./integration-setting.entity");
const integration_setting_utils_1 = require("./integration-setting.utils");
let IntegrationSettingSubscriber = class IntegrationSettingSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to IntegrationSetting events.
     */
    listenTo() {
        return integration_setting_entity_1.IntegrationSetting;
    }
    /**
     * Called after an IntegrationSetting entity is loaded from the database. This method handles
     * sensitive information by partially masking it before presenting to the user.
     *
     * @param entity The IntegrationSetting entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the post-load processing is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Extract sensitive information from the entity
            const { settingsName, settingsValue } = entity;
            // Specify the percentage of the string to be replaced with the character
            const percentage = 25;
            entity.wrapSecretKey = settingsName;
            entity.wrapSecretValue = settingsValue;
            // Default-deny: mask EVERY settings value unless its name is on the explicit non-secret
            // allowlist. This ensures OAuth access/refresh tokens, client secrets and similar
            // credentials are never returned in cleartext (GHSA-3rqg-gpm9-gx84).
            if (typeof settingsValue === 'string' && !integration_setting_utils_1.nonSecretSettingKeys.includes(settingsName)) {
                // Create an object containing the sensitive data
                const secrets = { [settingsName]: settingsValue };
                // Apply the wrapping function to this setting's value
                const wrapped = (0, integration_setting_utils_1.keysToWrapSecrets)([settingsName], secrets, percentage);
                entity.wrapSecretValue = wrapped[settingsName];
            }
        }
        catch (error) {
            console.error('IntegrationSettingSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
};
exports.IntegrationSettingSubscriber = IntegrationSettingSubscriber;
exports.IntegrationSettingSubscriber = IntegrationSettingSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], IntegrationSettingSubscriber);
//# sourceMappingURL=integration-setting.subscriber.js.map