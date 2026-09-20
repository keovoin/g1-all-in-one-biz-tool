"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContactSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const organization_contact_entity_1 = require("./organization-contact.entity");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const utils_1 = require("./../core/utils");
let OrganizationContactSubscriber = class OrganizationContactSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to OrganizationContact events.
     */
    listenTo() {
        return organization_contact_entity_1.OrganizationContact;
    }
    /**
     * Called after an OrganizationContact entity is loaded from the database. This method updates
     * the entity's image URL, setting it to the existing image's URL, or generating a dummy
     * image if no image URL is present.
     *
     * @param entity The OrganizationContact entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Set imageUrl from the image object's fullUrl, if available. Fall back to existing imageUrl if not.
            if (Object.prototype.hasOwnProperty.call(entity, 'image')) {
                await this.setImageUrl(entity);
            }
            else if (!entity.imageUrl && entity.name) {
                // Otherwise, generate a dummy image URL based on the first character of the name
                entity.imageUrl = (0, utils_1.getDummyImage)(330, 300, entity.name.charAt(0).toUpperCase());
            }
        }
        catch (error) {
            console.error('OrganizationContactSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
    /**
     * Called before an OrganizationContact entity is inserted or created in the database. This method sets a
     * default image URL based on the first character of the entity's name if an image URL is not already provided.
     *
     * @param entity The OrganizationContact entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            // Generate a dummy image URL based on the first character of the name, if imageUrl is not provided
            if (!entity.imageUrl && entity.name) {
                entity.imageUrl = (0, utils_1.getDummyImage)(330, 300, entity.name.charAt(0).toUpperCase());
            }
        }
        catch (error) {
            console.error('OrganizationContactSubscriber: An error occurred during the beforeEntityCreate process:', error);
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
                console.error('OrganizationContactSubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.OrganizationContactSubscriber = OrganizationContactSubscriber;
exports.OrganizationContactSubscriber = OrganizationContactSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], OrganizationContactSubscriber);
//# sourceMappingURL=organization-contact.subscriber.js.map