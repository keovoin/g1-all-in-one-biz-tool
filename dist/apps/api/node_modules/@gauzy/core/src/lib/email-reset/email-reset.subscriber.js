"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailResetSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const email_reset_entity_1 = require("./email-reset.entity");
let EmailResetSubscriber = class EmailResetSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to EmailReset events.
     */
    listenTo() {
        return email_reset_entity_1.EmailReset;
    }
    /**
     * Called after entity is loaded from the database.
     *
     * @param entity
     */
    async afterEntityLoad(entity) {
        try {
            if (Object.prototype.hasOwnProperty.call(entity, 'expiredAt')) {
                entity.isExpired = entity.expiredAt ? moment(entity.expiredAt).isBefore(moment()) : false;
            }
        }
        catch (error) {
            console.error('EmailResetSubscriber: Error during the afterEntityLoad process:', error);
        }
    }
    /**
     * Called before entity is inserted/created to the database.
     *
     * @param entity
     */
    async beforeEntityCreate(entity) {
        try {
            if (entity) {
                entity.expiredAt = moment(new Date()).add(config_1.environment.EMAIL_RESET_EXPIRATION_TIME, 'seconds').toDate();
            }
        }
        catch (error) {
            console.error('EmailResetSubscriber: Error during the beforeEntityCreate process:', error);
        }
    }
};
exports.EmailResetSubscriber = EmailResetSubscriber;
exports.EmailResetSubscriber = EmailResetSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], EmailResetSubscriber);
//# sourceMappingURL=email-reset.subscriber.js.map