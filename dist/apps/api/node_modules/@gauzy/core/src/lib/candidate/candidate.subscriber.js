"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const candidate_entity_1 = require("./candidate.entity");
let CandidateSubscriber = class CandidateSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Candidate events.
     */
    listenTo() {
        return candidate_entity_1.Candidate;
    }
    /**
     * Processes a Candidate entity after it's loaded.
     * This function calculates the average rating from the candidate's feedbacks if they are available.
     * It also sets the 'alreadyHired' property based on the candidate's status and the validity of the hiredDate.
     *
     * @param entity The Candidate entity that has been loaded.
     */
    async afterEntityLoad(entity) {
        try {
            // Calculate the average rating if feedbacks are available and in array format.
            if (Array.isArray(entity.feedbacks)) {
                // Assuming `average` is a function that calculates the average rating.
                // 'rating' is presumably a property within each feedback object.
                entity.ratings = (0, utils_1.average)(entity.feedbacks, 'rating');
            }
            // Set alreadyHired to true if the candidate's status is HIRED and the hiredDate is a valid date.
            entity.alreadyHired = entity.status === contracts_1.CandidateStatusEnum.HIRED && moment(entity.hiredDate).isValid();
        }
        catch (error) {
            console.error('CandidateSubscriber: Error during the afterEntityLoad process:', error);
        }
    }
    /**
     * Performs preprocessing on a Candidate entity before its creation.
     * This function checks if a rejectDate is present and valid for the candidate,
     * and if so, updates the candidate's status to REJECTED.
     *
     * @param entity The Candidate entity that is about to be created.
     */
    async beforeEntityCreate(entity) {
        try {
            if (entity) {
                // Check if rejectDate is present and is a valid date. If true, update the candidate's status to REJECTED.
                if ('rejectDate' in entity && moment(entity.rejectDate).isValid()) {
                    entity.status = contracts_1.CandidateStatusEnum.REJECTED;
                }
            }
        }
        catch (error) {
            console.error('CandidateSubscriber: Error during the beforeEntityCreate process:', error);
        }
    }
};
exports.CandidateSubscriber = CandidateSubscriber;
exports.CandidateSubscriber = CandidateSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], CandidateSubscriber);
//# sourceMappingURL=candidate.subscriber.js.map