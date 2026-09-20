"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDocumentSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const organization_document_entity_1 = require("./organization-document.entity");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
let OrganizationDocumentSubscriber = class OrganizationDocumentSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to OrganizationDocument events.
     */
    listenTo() {
        return organization_document_entity_1.OrganizationDocument;
    }
    /**
     * Called after an OrganizationDocument entity is loaded from the database. This method updates
     * the entity's document URL if an associated document with a full URL is present.
     *
     * @param entity The OrganizationDocument entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the URL updating process is complete.
     */
    async afterEntityLoad(entity) {
        try {
            if (entity.document && entity.document.fullUrl) {
                // Use the full URL from the document property if available
                entity.documentUrl = entity.document.fullUrl;
            }
        }
        catch (error) {
            console.error('OrganizationDocumentSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
};
exports.OrganizationDocumentSubscriber = OrganizationDocumentSubscriber;
exports.OrganizationDocumentSubscriber = OrganizationDocumentSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], OrganizationDocumentSubscriber);
//# sourceMappingURL=organization-document.subscriber.js.map