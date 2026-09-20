"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageAssetSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const file_storage_1 = require("./../core/file-storage");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const image_asset_entity_1 = require("./image-asset.entity");
let ImageAssetSubscriber = class ImageAssetSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to ImageAsset events.
     */
    listenTo() {
        return image_asset_entity_1.ImageAsset;
    }
    /**
     * Called after an ImageAsset entity is loaded from the database.
     * This method updates the entity by setting the full and thumbnail URLs using the provided storage provider.
     *
     * @param entity The ImageAsset entity that has been loaded.
     * @returns A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            if (entity instanceof image_asset_entity_1.ImageAsset) {
                const { storageProvider, url, thumb } = entity;
                const store = new file_storage_1.FileStorage().setProvider(storageProvider).getProviderInstance();
                // Retrieve full and thumbnail URLs concurrently
                const [fullUrl, thumbUrl] = await Promise.all([store.url(url), store.url(thumb)]);
                entity.fullUrl = fullUrl;
                entity.thumbUrl = thumbUrl;
            }
        }
        catch (error) {
            console.error('ImageAssetSubscriber: Error during the afterEntityLoad process:', error);
        }
    }
};
exports.ImageAssetSubscriber = ImageAssetSubscriber;
exports.ImageAssetSubscriber = ImageAssetSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], ImageAssetSubscriber);
//# sourceMappingURL=image-asset.subscriber.js.map