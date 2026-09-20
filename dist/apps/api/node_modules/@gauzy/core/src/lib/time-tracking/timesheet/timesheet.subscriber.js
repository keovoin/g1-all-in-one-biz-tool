"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
const timesheet_entity_1 = require("./timesheet.entity");
let TimesheetSubscriber = class TimesheetSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Timesheet events.
     */
    listenTo() {
        return timesheet_entity_1.Timesheet;
    }
    /**
     * Called after an Timesheet entity is loaded from the database.
     *
     * @param entity - The loaded Timesheet entity.
     * @param event - The LoadEvent associated with the entity loading.
     */
    async afterEntityLoad(entity) {
        /**
         * Sets the 'isEdited' property based on the presence of 'editedAt'.
         * If 'editedAt' is defined, 'isEdited' is set to true; otherwise, it is set to false.
         */
        if (Object.prototype.hasOwnProperty.call(entity, 'editedAt')) {
            entity.isEdited = !!entity.editedAt;
        }
    }
};
exports.TimesheetSubscriber = TimesheetSubscriber;
exports.TimesheetSubscriber = TimesheetSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TimesheetSubscriber);
//# sourceMappingURL=timesheet.subscriber.js.map