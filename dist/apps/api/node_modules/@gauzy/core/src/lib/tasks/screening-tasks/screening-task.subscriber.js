"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningTaskSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const screening_task_entity_1 = require("./screening-task.entity");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
let ScreeningTaskSubscriber = class ScreeningTaskSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to Task events.
     */
    listenTo() {
        return screening_task_entity_1.ScreeningTask;
    }
};
exports.ScreeningTaskSubscriber = ScreeningTaskSubscriber;
exports.ScreeningTaskSubscriber = ScreeningTaskSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], ScreeningTaskSubscriber);
//# sourceMappingURL=screening-task.subscriber.js.map