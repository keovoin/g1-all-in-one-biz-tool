"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueTypeSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const file_storage_1 = require("./../../core/file-storage");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
const issue_type_entity_1 = require("./issue-type.entity");
let IssueTypeSubscriber = class IssueTypeSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to IssueType events.
     */
    listenTo() {
        return issue_type_entity_1.IssueType;
    }
    /**
     * Called after an IssueType entity is loaded from the database. This method updates
     * the entity by setting the full icon URL using the FileStorage provider.
     *
     * @param entity The IssueType entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Update the fullIconUrl if an icon is present
            if (Object.prototype.hasOwnProperty.call(entity, 'image')) {
                // Use the fullUrl from the image property if available
                await this.setImageUrl(entity);
            }
            else if (Object.prototype.hasOwnProperty.call(entity, 'icon')) {
                // Otherwise, generate the full URL for the icon
                await this.setFullIconUrl(entity);
            }
        }
        catch (error) {
            console.error('IssueTypeSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
    /**
     * Called before an IssueType entity is inserted into the database. This method sets default
     * values and prepares the entity for creation.
     *
     * @param entity The IssueType entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            // Set a default color using faker if not provided
            entity.color ??= faker_1.faker.color.rgb();
            // Generate a slug from the name, if the name property exists
            if (typeof entity.name === 'string') {
                entity.value = (0, utils_1.sluggable)(entity.name);
            }
        }
        catch (error) {
            console.error('IssueTypeSubscriber: An error occurred during the beforeEntityCreate process:', error);
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
                    // Otherwise, generate the full URL for the icon
                    const store = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                    entity.fullIconUrl = await store.getProviderInstance().url(entity.icon);
                    resolve();
                });
            }
            catch (error) {
                console.error('TaskPrioritySubscriber: Error during the setFullIconUrl process:', error);
                reject(null);
            }
        });
    }
    /**
     * Simulate an asynchronous operation to set the image URL.
     *
     * @param entity
     * @returns
     */
    setImageUrl(entity) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate async operation, e.g., fetching fullUrl from a service
                setTimeout(() => {
                    entity.fullIconUrl = entity.image?.fullUrl ?? entity.fullIconUrl;
                    resolve();
                });
            }
            catch (error) {
                console.error('TaskPrioritySubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.IssueTypeSubscriber = IssueTypeSubscriber;
exports.IssueTypeSubscriber = IssueTypeSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], IssueTypeSubscriber);
//# sourceMappingURL=issue-type.subscriber.js.map