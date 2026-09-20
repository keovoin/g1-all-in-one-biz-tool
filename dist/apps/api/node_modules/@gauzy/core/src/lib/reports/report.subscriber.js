"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const report_entity_1 = require("./report.entity");
const file_storage_1 = require("./../core/file-storage");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
let ReportSubscriber = class ReportSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Report events.
     */
    listenTo() {
        return report_entity_1.Report;
    }
    /**
     * Called after a Report entity is loaded from the database. This method updates
     * the entity by setting the image URL using the FileStorage provider.
     *
     * @param entity The Report entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Update the imageUrl if an image property is present
            if (Object.prototype.hasOwnProperty.call(entity, 'image')) {
                await this.setImageUrl(entity);
            }
        }
        catch (error) {
            console.error(`ReportSubscriber: An error occurred during the afterEntityLoad process for report ID ${entity.id}:`, error);
        }
    }
    /**
     * Simulate an asynchronous operation to set the image URL.
     *
     * @param entity
     * @returns
     */
    async setImageUrl(entity) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate async operation, e.g., fetching fullUrl from a service
                setTimeout(async () => {
                    const store = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                    entity.imageUrl = await store.getProviderInstance().url(entity.image);
                    resolve();
                });
            }
            catch (error) {
                console.error('ReportSubscriber: Error during the setImageUrl process:', error);
                reject(null);
            }
        });
    }
};
exports.ReportSubscriber = ReportSubscriber;
exports.ReportSubscriber = ReportSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], ReportSubscriber);
//# sourceMappingURL=report.subscriber.js.map