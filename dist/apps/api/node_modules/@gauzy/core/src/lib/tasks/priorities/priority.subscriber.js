"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPrioritySubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const file_storage_1 = require("../../core/file-storage");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
const priority_entity_1 = require("./priority.entity");
let TaskPrioritySubscriber = class TaskPrioritySubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to TaskPriority events.
     */
    listenTo() {
        return priority_entity_1.TaskPriority;
    }
    /**
     * Called after a TaskPriority entity is loaded from the database. This method updates
     * the entity by setting the full icon URL if an icon is associated with the priority level.
     *
     * @param entity The TaskPriority entity that has been loaded.
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
            console.error(`TaskPrioritySubscriber: An error occurred during the afterEntityLoad process for entity ID ${entity.id}:`, error);
        }
    }
    /**
     * Called before a TaskPriority entity is inserted into the database. This method ensures
     * that default values for color and value properties are set if they're not provided.
     *
     * @param entity The TaskPriority entity about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            // Set a default color using faker if not provided
            entity.color ??= faker_1.faker.color.rgb();
            // Set a sluggable value based on the name, if provided
            if (Object.prototype.hasOwnProperty.call(entity, 'name')) {
                entity.value = (0, utils_1.sluggable)(entity.name);
            }
        }
        catch (error) {
            console.error('TaskPrioritySubscriber: An error occurred during the beforeEntityCreate process:', error);
        }
    }
    /**
     * Sets the full icon URL for a `TaskPriority` entity using a file storage provider.
     *
     * @param entity - The `TaskPriority` entity whose `fullIconUrl` needs to be set.
     * @returns A promise that resolves once the `fullIconUrl` is successfully set.
     */
    async setFullIconUrl(entity) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate async operation, e.g., fetching fullUrl from a service
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
                console.error('TaskPrioritySubscriber: Error during the setFullIconUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.TaskPrioritySubscriber = TaskPrioritySubscriber;
exports.TaskPrioritySubscriber = TaskPrioritySubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TaskPrioritySubscriber);
//# sourceMappingURL=priority.subscriber.js.map