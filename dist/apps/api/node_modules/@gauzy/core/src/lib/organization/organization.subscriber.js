"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const utils_1 = require("@gauzy/utils");
const organization_entity_1 = require("./organization.entity");
const utils_2 = require("../core/utils");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
let OrganizationSubscriber = class OrganizationSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Organization events.
     */
    listenTo() {
        return organization_entity_1.Organization;
    }
    /**
     * Called after an Organization entity is loaded from the database. This method updates
     * the entity's image URL based on the available data.
     *
     * @param entity The Organization entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Set imageUrl from the image object's fullUrl, if available. Fall back to existing imageUrl if not.
            if (Object.prototype.hasOwnProperty.call(entity, 'image')) {
                await this.setImageUrl(entity);
            }
            else if (!entity.imageUrl && (entity.name || entity.officialName)) {
                // If imageUrl is not set and there's a name or officialName, generate a dummy image URL
                entity.imageUrl = (0, utils_2.getOrganizationDummyImage)(entity.name || entity.officialName);
            }
        }
        catch (error) {
            console.error('OrganizationSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
    /**
     * Called before an Organization entity is inserted or created in the database.
     * This method sets default values for certain properties of the entity.
     *
     * @param entity The Organization entity about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            if (entity) {
                // Set a profile link based on the organization's name or official name
                if (entity.name || entity.officialName) {
                    entity.profile_link = (0, utils_1.sluggable)(`${entity.name || entity.officialName}`);
                }
                // Generate a dummy image URL if an image URL is not already provided
                if (!entity.imageUrl) {
                    entity.imageUrl = (0, utils_2.getOrganizationDummyImage)(entity.name || entity.officialName);
                }
                // Assign a random color for brandColor if it's not provided
                if (!entity.brandColor) {
                    entity.brandColor = faker_1.faker.color.rgb();
                }
            }
        }
        catch (error) {
            console.error('OrganizationSubscriber: An error occurred during the beforeEntityCreate process:', error);
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
                setTimeout(() => {
                    entity.imageUrl = entity.image?.fullUrl ?? entity.imageUrl;
                    resolve();
                });
            }
            catch (error) {
                console.error('OrganizationSubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.OrganizationSubscriber = OrganizationSubscriber;
exports.OrganizationSubscriber = OrganizationSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], OrganizationSubscriber);
//# sourceMappingURL=organization.subscriber.js.map