"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const file_storage_1 = require("./../core/file-storage");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const feature_entity_1 = require("./feature.entity");
let FeatureSubscriber = class FeatureSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Feature events.
     */
    listenTo() {
        return feature_entity_1.Feature;
    }
    /**
     * Called after an entity is loaded from the database.
     *
     * @param entity - The loaded Feature entity.
     */
    async afterEntityLoad(entity) {
        try {
            // Set a default status if not present
            entity.status = entity.status ?? (0, underscore_1.shuffle)(Object.values(contracts_1.FeatureStatusEnum))[0];
            // Check and set isEnabled based on gauzyToggleFeatures
            entity.isEnabled = config_1.gauzyToggleFeatures[entity.code] ?? true;
            // Set imageUrl based on the entity's image property
            if (Object.prototype.hasOwnProperty.call(entity, 'image')) {
                await this.setImageUrl(entity);
            }
        }
        catch (error) {
            console.error('FeatureSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
    /**
     * Simulate an asynchronous operation to set the imageUrl.
     *
     * @param entity
     * @returns
     */
    setImageUrl(entity) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate async operation, e.g., fetching fullUrl from a service
                setTimeout(async () => {
                    const store = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                    entity.imageUrl = await store.getProviderInstance().url(entity.image);
                    resolve();
                });
            }
            catch (error) {
                console.error('FeatureSubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.FeatureSubscriber = FeatureSubscriber;
exports.FeatureSubscriber = FeatureSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], FeatureSubscriber);
//# sourceMappingURL=feature.subscriber.js.map