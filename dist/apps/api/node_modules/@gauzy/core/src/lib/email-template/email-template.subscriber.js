"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const email_template_entity_1 = require("./email-template.entity");
let EmailTemplateSubscriber = class EmailTemplateSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to EmailTemplate events.
     */
    listenTo() {
        return email_template_entity_1.EmailTemplate;
    }
    /**
     * Called after entity is loaded from the database.
     *
     * @param entity
     */
    async afterEntityLoad(entity) {
        try {
            // Set title from the name property, if present
            if (Object.prototype.hasOwnProperty.call(entity, 'name')) {
                entity.title = entity.name?.split('/')[0].split('-').join(' ');
            }
        }
        catch (error) {
            console.error('EmailTemplateSubscriber: Error during the afterEntityLoad process:', error);
        }
    }
};
exports.EmailTemplateSubscriber = EmailTemplateSubscriber;
exports.EmailTemplateSubscriber = EmailTemplateSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], EmailTemplateSubscriber);
//# sourceMappingURL=email-template.subscriber.js.map