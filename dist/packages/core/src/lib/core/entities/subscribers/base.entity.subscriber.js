"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntitySubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const base_entity_event_subscriber_1 = require("./base-entity-event.subscriber");
const request_context_1 = require("../../context/request-context");
let BaseEntitySubscriber = class BaseEntitySubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * A hook executed before creating an entity. This function can be used to perform
     * custom operations or transformations on the entity prior to its persistence.
     *
     * @param entity - The entity object that is about to be created.
     * @param em - Optional MultiOrmEntityManager for performing additional operations.
     * @returns A promise that resolves when all pre-create operations are complete.
     */
    async beforeEntityCreate(entity, em) {
        // Further pre-creation logic can be inserted here as needed.
        if (entity) {
            entity.createdByUserId = request_context_1.RequestContext.currentUserId(); // Assign the current user's ID to the createdByUserId property
        }
    }
    /**
     * A hook executed before updating an entity. This function can be used to perform
     * custom operations or transformations on the entity prior to its persistence update.
     *
     * @param entity - The entity object that is about to be updated.
     * @param em - Optional MultiOrmEntityManager for additional operations or validations.
     * @returns A promise that resolves when all pre-update operations are complete.
     */
    async beforeEntityUpdate(entity, em) {
        // Additional pre-update logic can be added here as needed.
        if (entity) {
            entity.updatedByUserId = request_context_1.RequestContext.currentUserId(); // Assign the current user's ID to the updatedByUserId property
        }
    }
    /**
     * Hook executed after an entity is soft removed (i.e., marked as deleted without being physically removed).
     *
     * @param entity - The entity that was soft removed.
     * @param em - Optional MultiOrmEntityManager for executing additional operations.
     * @returns A promise that resolves when post-soft removal tasks are complete.
     */
    async afterEntitySoftRemove(entity, em) {
        // Additional post-soft removal logic can be added here.
        if (entity) {
            entity.deletedByUserId = request_context_1.RequestContext.currentUserId(); // Assign the current user's ID to the deletedByUserId property
        }
    }
};
exports.BaseEntitySubscriber = BaseEntitySubscriber;
exports.BaseEntitySubscriber = BaseEntitySubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], BaseEntitySubscriber);
//# sourceMappingURL=base.entity.subscriber.js.map