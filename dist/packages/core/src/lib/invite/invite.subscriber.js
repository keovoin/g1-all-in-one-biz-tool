"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const invite_entity_1 = require("./invite.entity");
let InviteSubscriber = class InviteSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Invite events.
     */
    listenTo() {
        return invite_entity_1.Invite;
    }
    /**
     * Called after an Invite entity is loaded from the database. This method updates the
     * entity's status based on its expiration date.
     *
     * @param entity The Invite entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the post-load processing is complete.
     */
    async afterEntityLoad(entity) {
        try {
            if (Object.prototype.hasOwnProperty.call(entity, 'expireDate')) {
                // Determine if the invite is expired
                entity.isExpired = entity.expireDate ? moment(entity.expireDate).isBefore(moment()) : false;
            }
            // Update the status based on the expiration
            entity.status = entity.isExpired ? contracts_1.InviteStatusEnum.EXPIRED : entity.status;
        }
        catch (error) {
            console.error('InviteSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
};
exports.InviteSubscriber = InviteSubscriber;
exports.InviteSubscriber = InviteSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], InviteSubscriber);
//# sourceMappingURL=invite.subscriber.js.map