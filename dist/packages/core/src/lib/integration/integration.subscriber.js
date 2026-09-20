"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const file_storage_1 = require("./../core/file-storage");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const integration_entity_1 = require("./integration.entity");
let IntegrationSubscriber = class IntegrationSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Integration events.
     */
    listenTo() {
        return integration_entity_1.Integration;
    }
    /**
     * Called after an Integration entity is loaded from the database. This method updates
     * the entity by setting the full image URL using a specified file storage provider.
     *
     * @param entity The Integration entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Check if imgSrc is present and non-empty
            if (Object.prototype.hasOwnProperty.call(entity, 'imgSrc')) {
                // Instantiate FileStorage with the desired provider
                const provider = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                // Retrieve and set the full image URL
                entity.fullImgUrl = await provider.getProviderInstance().url(entity.imgSrc);
            }
        }
        catch (error) {
            console.error('IntegrationSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
};
exports.IntegrationSubscriber = IntegrationSubscriber;
exports.IntegrationSubscriber = IntegrationSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], IntegrationSubscriber);
//# sourceMappingURL=integration.subscriber.js.map