"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogEventHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const activity_log_event_1 = require("../activity-log.event");
const activity_log_service_1 = require("../../activity-log.service");
let ActivityLogEventHandler = class ActivityLogEventHandler {
    constructor(activityLogService) {
        this.activityLogService = activityLogService;
    }
    /**
     * Handles the activity log event by creating a new activity log entry using the provided input data.
     *
     * @param event - The activity log event containing the input data required to create the log entry.
     * @returns A promise that resolves with the created activity log entry.
     *
     */
    async handle(event) {
        // Extract the input from the event and create a new activity log entry
        return await this.activityLogService.create(event.input);
    }
};
exports.ActivityLogEventHandler = ActivityLogEventHandler;
exports.ActivityLogEventHandler = ActivityLogEventHandler = tslib_1.__decorate([
    (0, cqrs_1.EventsHandler)(activity_log_event_1.ActivityLogEvent),
    tslib_1.__metadata("design:paramtypes", [activity_log_service_1.ActivityLogService])
], ActivityLogEventHandler);
//# sourceMappingURL=activity-log.handler.js.map