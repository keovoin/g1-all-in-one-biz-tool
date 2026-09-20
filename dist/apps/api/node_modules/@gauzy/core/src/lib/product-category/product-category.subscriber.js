"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategorySubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const product_category_entity_1 = require("./product-category.entity");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
let ProductCategorySubscriber = class ProductCategorySubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to ProductCategory events.
     */
    listenTo() {
        return product_category_entity_1.ProductCategory;
    }
    /**
     * Called after a ProductCategory entity is loaded from the database. This method updates
     * the entity's imageUrl if an associated image with a full URL is present.
     *
     * @param entity The ProductCategory entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Set imageUrl from the image object's fullUrl, if available. Fall back to existing imageUrl if not.
            if (Object.prototype.hasOwnProperty.call(entity, 'image')) {
                await this.setImageUrl(entity);
            }
        }
        catch (error) {
            console.error(`ProductCategorySubscriber: An error occurred during the afterEntityLoad process for entity ID ${entity.id}:`, error);
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
                console.error('ProductCategorySubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.ProductCategorySubscriber = ProductCategorySubscriber;
exports.ProductCategorySubscriber = ProductCategorySubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], ProductCategorySubscriber);
//# sourceMappingURL=product-category.subscriber.js.map