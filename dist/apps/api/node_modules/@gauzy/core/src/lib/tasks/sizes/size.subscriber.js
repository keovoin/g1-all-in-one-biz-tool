"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSizeSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const file_storage_1 = require("./../../core/file-storage");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
const size_entity_1 = require("./size.entity");
let TaskSizeSubscriber = class TaskSizeSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to TaskSize events.
     */
    listenTo() {
        return size_entity_1.TaskSize;
    }
    /**
     * Called after a TaskSize entity is loaded from the database. This method updates
     * the entity by setting the full icon URL using the FileStorage provider.
     *
     * @param entity The TaskSize entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Update the fullIconUrl if an icon property is present
            if (Object.prototype.hasOwnProperty.call(entity, 'icon')) {
                await this.setFullIconUrl(entity);
            }
        }
        catch (error) {
            console.error(`TaskSizeSubscriber: An error occurred during the afterEntityLoad process for entity ID ${entity.id}:`, error);
        }
    }
    /**
     * Called before a TaskSize entity is inserted into the database. This method sets default
     * values for certain properties of the entity.
     *
     * @param entity The TaskSize entity about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            // Set a default color using faker if not provided
            entity.color ??= faker_1.faker.color.rgb();
            // Set a sluggable value based on the name, if provided
            if ('name' in entity) {
                entity.value = (0, utils_1.sluggable)(entity.name);
            }
        }
        catch (error) {
            console.error('TaskSizeSubscriber: An error occurred during the beforeEntityCreate process:', error);
        }
    }
    /**
     * Sets the full icon URL for a `TaskSize` entity using a file storage provider.
     *
     * @param entity - The `TaskSize` entity whose `fullIconUrl` needs to be set.
     * @returns A promise that resolves when the `fullIconUrl` is successfully set.
     */
    async setFullIconUrl(entity) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate async operation with a delay
                setTimeout(async () => {
                    // Initialize the file storage provider
                    const provider = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                    // Fetch and set the full URL for the icon
                    entity.fullIconUrl = await provider.getProviderInstance().url(entity.icon);
                    // Resolve the promise once the URL is set
                    resolve();
                });
            }
            catch (error) {
                console.error('TaskSizeSubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.TaskSizeSubscriber = TaskSizeSubscriber;
exports.TaskSizeSubscriber = TaskSizeSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TaskSizeSubscriber);
//# sourceMappingURL=size.subscriber.js.map