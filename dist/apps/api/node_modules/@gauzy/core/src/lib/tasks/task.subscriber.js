"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const base_entity_event_subscriber_1 = require("../core/entities/subscribers/base-entity-event.subscriber");
const task_entity_1 = require("./task.entity");
let TaskSubscriber = class TaskSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Task events.
     */
    listenTo() {
        return task_entity_1.Task;
    }
    /**
     * Called after a Task entity is loaded from the database. This method constructs a formatted
     * task number based on the prefix and the task's number.
     *
     * @param entity The Task entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the task number generation is complete.
     */
    async afterEntityLoad(entity) {
        try {
            if (entity) {
                // Determine the prefix
                let prefix = entity.prefix?.toUpperCase() || entity.project?.name?.substring(0, 3).toUpperCase() || '';
                // Construct the task number parts
                const list = [prefix, entity.number || 0];
                // Set the taskNumber property if 'number' exists in the entity
                if ('number' in entity) {
                    entity.taskNumber = list.filter(Boolean).join('-');
                }
            }
        }
        catch (error) {
            console.error('TaskSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
};
exports.TaskSubscriber = TaskSubscriber;
exports.TaskSubscriber = TaskSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TaskSubscriber);
//# sourceMappingURL=task.subscriber.js.map