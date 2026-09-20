"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRelatedIssueTypeSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const file_storage_1 = require("../../core/file-storage");
const related_issue_type_entity_1 = require("./related-issue-type.entity");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
let TaskRelatedIssueTypeSubscriber = class TaskRelatedIssueTypeSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to TaskRelatedIssueType events.
     */
    listenTo() {
        return related_issue_type_entity_1.TaskRelatedIssueType;
    }
    /**
     * Called after a TaskRelatedIssueType entity is loaded from the database. This method updates
     * the entity by setting the full icon URL if an icon is associated with the issue type.
     *
     * @param entity The TaskRelatedIssueType entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Update the fullIconUrl if an icon is present
            if ('icon' in entity) {
                console.log('TaskRelatedIssueType: Setting fullIconUrl for task related issue type ID ' + entity.id);
                await this.setFullIconUrl(entity);
            }
        }
        catch (error) {
            console.error(`TaskRelatedIssueTypeSubscriber: An error occurred during the afterEntityLoad process for entity ID ${entity.id}:`, error);
        }
    }
    /**
     * Called before a TaskRelatedIssueType entity is inserted into the database. This method ensures
     * that default values for color and value properties are set.
     *
     * @param entity The TaskRelatedIssueType entity about to be created.
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
            console.error('TaskRelatedIssueTypeSubscriber: An error occurred during the beforeEntityCreate process:', error);
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
                console.error('TaskRelatedIssueTypeSubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.TaskRelatedIssueTypeSubscriber = TaskRelatedIssueTypeSubscriber;
exports.TaskRelatedIssueTypeSubscriber = TaskRelatedIssueTypeSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TaskRelatedIssueTypeSubscriber);
//# sourceMappingURL=related-issue-type.subscriber.js.map