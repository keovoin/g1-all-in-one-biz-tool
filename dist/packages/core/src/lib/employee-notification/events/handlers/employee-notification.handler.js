"use strict";
var EmployeeCreateNotificationEventHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeCreateNotificationEventHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const employee_notification_event_1 = require("../employee-notification.event");
const employee_notification_service_1 = require("../../employee-notification.service");
let EmployeeCreateNotificationEventHandler = EmployeeCreateNotificationEventHandler_1 = class EmployeeCreateNotificationEventHandler {
    constructor(employeeNotificationService) {
        this.employeeNotificationService = employeeNotificationService;
        this.logger = new common_1.Logger(EmployeeCreateNotificationEventHandler_1.name);
    }
    /**
     * Handles the employee notification event by creating a new employee notification entry using the provided input data.
     *
     * @param event - The employee notification event containing the input data required to create the notification entry.
     * @returns A promise that resolves with the created employee notification entry.
     *
     */
    async handle(event) {
        try {
            this.logger.debug(`Creating notification for employee: ${event.input.receiverEmployeeId}`);
            // One row per event, as on develop: the in-process EventBus never redelivers, so a content match here
            // could only merge two real events (e.g. unassign + re-assign within the window). Pass
            // `{ absorbRedelivery: true }` only once these events arrive over an at-least-once transport.
            return await this.employeeNotificationService.create(event.input);
        }
        catch (error) {
            this.logger.error(`Failed to create notification: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to create employee notification: ${error.message}`, error);
        }
    }
};
exports.EmployeeCreateNotificationEventHandler = EmployeeCreateNotificationEventHandler;
exports.EmployeeCreateNotificationEventHandler = EmployeeCreateNotificationEventHandler = EmployeeCreateNotificationEventHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.EventsHandler)(employee_notification_event_1.EmployeeCreateNotificationEvent),
    tslib_1.__metadata("design:paramtypes", [employee_notification_service_1.EmployeeNotificationService])
], EmployeeCreateNotificationEventHandler);
//# sourceMappingURL=employee-notification.handler.js.map