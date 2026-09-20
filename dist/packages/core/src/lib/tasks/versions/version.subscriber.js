"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskVersionSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const file_storage_1 = require("../../core/file-storage");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
const version_entity_1 = require("./version.entity");
let TaskVersionSubscriber = class TaskVersionSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to TaskVersion events.
     */
    listenTo() {
        return version_entity_1.TaskVersion;
    }
    /**
     * Called after a TaskVersion entity is loaded from the database. This method updates
     * the entity by setting the full icon URL using a specified file storage provider.
     *
     * @param entity The TaskVersion entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Generate and set the full icon URL if an icon property exists
            if (Object.prototype.hasOwnProperty.call(entity, 'icon')) {
                await this.setFullIconUrl(entity);
            }
        }
        catch (error) {
            console.error('TaskVersionSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
    /**
     * Called before a TaskVersion entity is inserted or created in the database. This method ensures
     * default values for color and value properties are set.
     *
     * @param entity The TaskVersion entity about to be created.
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
            console.error('TaskVersionSubscriber: An error occurred during the beforeEntityCreate process:', error);
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
                    const store = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                    entity.fullIconUrl = await store.getProviderInstance().url(entity.icon);
                    resolve();
                });
            }
            catch (error) {
                console.error('TaskStatusSubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.TaskVersionSubscriber = TaskVersionSubscriber;
exports.TaskVersionSubscriber = TaskVersionSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TaskVersionSubscriber);
//# sourceMappingURL=version.subscriber.js.map