"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const contracts_1 = require("@gauzy/contracts");
const file_storage_1 = require("./../core/file-storage");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const tag_entity_1 = require("./tag.entity");
let TagSubscriber = class TagSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Tag events.
     */
    listenTo() {
        return tag_entity_1.Tag;
    }
    /**
     * Called after a Tag entity is loaded from the database. This method updates
     * the entity by setting the full icon URL using the FileStorage provider.
     *
     * @param entity The Tag entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Update the fullIconUrl if an icon is present
            if (Object.prototype.hasOwnProperty.call(entity, 'icon')) {
                await this.setFullIconUrl(entity);
            }
        }
        catch (error) {
            console.error(`TagSubscriber: An error occurred during the afterEntityLoad process for entity ID ${entity.id}:`, error);
        }
    }
    /**
     * Called before a Tag entity is inserted into the database. This method sets a default color
     * for the tag if one isn't provided.
     *
     * @param entity The Tag entity about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-insertion processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            // Set a default color using faker if not provided
            entity.color ??= faker_1.faker.color.rgb();
        }
        catch (error) {
            console.error('TagSubscriber: An error occurred during the beforeEntityCreate process:', error);
        }
    }
    /**
     * Simulate an asynchronous operation to set the full icon URL.
     *
     * @param entity
     * @returns
     */
    async setFullIconUrl(entity) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate async operation, e.g., fetching fullUrl from a service
                setTimeout(async () => {
                    const provider = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                    entity.fullIconUrl = await provider.getProviderInstance().url(entity.icon);
                    resolve();
                });
            }
            catch (error) {
                console.error('TagSubscriber: Error during the setFullIconUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.TagSubscriber = TagSubscriber;
exports.TagSubscriber = TagSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TagSubscriber);
//# sourceMappingURL=tag.subscriber.js.map