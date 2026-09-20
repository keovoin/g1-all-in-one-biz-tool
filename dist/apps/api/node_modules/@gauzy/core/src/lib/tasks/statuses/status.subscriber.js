"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatusSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const file_storage_1 = require("../../core/file-storage");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
const status_entity_1 = require("./status.entity");
let TaskStatusSubscriber = class TaskStatusSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to TaskStatus events.
     */
    listenTo() {
        return status_entity_1.TaskStatus;
    }
    /**
     * Called after a TaskStatus entity is loaded from the database. This method updates
     * the entity by setting the full icon URL using the FileStorage provider.
     *
     * @param entity The TaskStatus entity that has been loaded.
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
            console.error('TaskStatusSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
    /**
     * Called before a TaskStatus entity is inserted into the database. This method ensures
     * default values for color and value properties are set.
     *
     * @param entity The TaskStatus entity about to be created.
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
            console.error('TaskStatusSubscriber: An error occurred during the beforeEntityCreate process:', error);
        }
    }
    /**
     * Sets the full icon URL for a `TaskStatus` entity using a file storage provider.
     *
     * @param entity - The `TaskStatus` entity whose `fullIconUrl` needs to be set.
     * @returns A promise that resolves when the `fullIconUrl` is successfully set.
     */
    async setFullIconUrl(entity) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate async operation with a delay
                setTimeout(async () => {
                    try {
                        // Initialize the file storage provider (e.g., LOCAL, S3, etc.)
                        const provider = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                        // Fetch and set the full URL for the icon
                        entity.fullIconUrl = await provider.getProviderInstance().url(entity.icon);
                        // Resolve the promise once the URL is set
                        resolve();
                    }
                    catch (innerError) {
                        console.error('Error fetching the icon URL:', innerError);
                        reject(innerError);
                    }
                }, 0); // Delay of 0ms to simulate async operation
            }
            catch (error) {
                console.error('TaskStatusSubscriber: Error during the setFullIconUrl process:', error);
                reject(error);
            }
        });
    }
};
exports.TaskStatusSubscriber = TaskStatusSubscriber;
exports.TaskStatusSubscriber = TaskStatusSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TaskStatusSubscriber);
//# sourceMappingURL=status.subscriber.js.map