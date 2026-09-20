"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSmtpSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const decorators_1 = require("./../core/decorators");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const custom_smtp_entity_1 = require("./custom-smtp.entity");
let CustomSmtpSubscriber = class CustomSmtpSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to CustomSmtp events.
     */
    listenTo() {
        return custom_smtp_entity_1.CustomSmtp;
    }
    /**
     * Processes a CustomSmtp entity after it's loaded.
     * This function sets the entity's secretKey and secretPassword based on its username and password, if they are present.
     *
     * @param entity The CustomSmtp entity that has been loaded.
     */
    async afterEntityLoad(entity) {
        try {
            if (Object.prototype.hasOwnProperty.call(entity, 'username')) {
                entity.secretKey = entity.username;
            }
            if (Object.prototype.hasOwnProperty.call(entity, 'password')) {
                entity.secretPassword = entity.password;
            }
            (0, decorators_1.WrapSecrets)(entity, entity); // Assuming wrapSecrets is a function to securely handle secrets.
        }
        catch (error) {
            console.error('CustomSmtpSubscriber: Error during the afterEntityLoad process:', error);
        }
    }
};
exports.CustomSmtpSubscriber = CustomSmtpSubscriber;
exports.CustomSmtpSubscriber = CustomSmtpSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], CustomSmtpSubscriber);
//# sourceMappingURL=custom-smtp.subscriber.js.map