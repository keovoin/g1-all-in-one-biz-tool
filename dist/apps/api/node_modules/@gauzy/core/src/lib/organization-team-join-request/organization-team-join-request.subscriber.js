"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamJoinRequestSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const organization_team_join_request_entity_1 = require("./organization-team-join-request.entity");
let OrganizationTeamJoinRequestSubscriber = class OrganizationTeamJoinRequestSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to OrganizationTeamJoinRequest events.
     */
    listenTo() {
        return organization_team_join_request_entity_1.OrganizationTeamJoinRequest;
    }
    /**
     * Called after an OrganizationTeamJoinRequest entity is loaded from the database. This method checks
     * if the join request is expired based on the 'expiredAt' property and sets the 'isExpired' flag accordingly.
     *
     * @param entity The OrganizationTeamJoinRequest entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the post-load processing is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Check if the entity has an 'expiredAt' date and set the 'isExpired' flag
            entity.isExpired = entity.expiredAt ? moment(entity.expiredAt).isBefore(moment()) : false;
        }
        catch (error) {
            console.error('OrganizationTeamJoinRequestSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
    /**
     * Called before an OrganizationTeamJoinRequest entity is inserted into the database. This method sets
     * the expiration date for the join request based on a predefined interval.
     *
     * @param entity The OrganizationTeamJoinRequest entity about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    async beforeEntityCreate(entity) {
        try {
            // Set the expiredAt date by adding the predefined expiration time to the current date
            entity.expiredAt = moment().add(config_1.environment.TEAM_JOIN_REQUEST_EXPIRATION_TIME, 'seconds').toDate();
        }
        catch (error) {
            console.error('OrganizationTeamJoinRequestSubscriber: An error occurred during the beforeEntityCreate process:', error);
        }
    }
};
exports.OrganizationTeamJoinRequestSubscriber = OrganizationTeamJoinRequestSubscriber;
exports.OrganizationTeamJoinRequestSubscriber = OrganizationTeamJoinRequestSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], OrganizationTeamJoinRequestSubscriber);
//# sourceMappingURL=organization-team-join-request.subscriber.js.map