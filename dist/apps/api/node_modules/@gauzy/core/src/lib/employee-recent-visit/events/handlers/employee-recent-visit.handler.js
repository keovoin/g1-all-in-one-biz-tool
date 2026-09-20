"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecentVisitEventHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const employee_recent_visit_event_1 = require("../employee-recent-visit.event");
const employee_recent_visit_service_1 = require("../../employee-recent-visit.service");
let EmployeeRecentVisitEventHandler = class EmployeeRecentVisitEventHandler {
    constructor(employeeRecentVisitService) {
        this.employeeRecentVisitService = employeeRecentVisitService;
    }
    /**
     * Handles the employee recent visit event by creating a new employee recent visit entry using the provided input data.
     *
     * @param event - The employee recent visit event containing the input data required to create the visit entry.
     * @returns A promise that resolves with the created employee recent visit entry.
     *
     */
    async handle(event) {
        // Extract the input from the event and create a new employee recent visit entry
        const { input } = event;
        return await this.employeeRecentVisitService.create({ ...input, visitedAt: new Date() });
    }
};
exports.EmployeeRecentVisitEventHandler = EmployeeRecentVisitEventHandler;
exports.EmployeeRecentVisitEventHandler = EmployeeRecentVisitEventHandler = tslib_1.__decorate([
    (0, cqrs_1.EventsHandler)(employee_recent_visit_event_1.EmployeeRecentVisitEvent),
    tslib_1.__metadata("design:paramtypes", [employee_recent_visit_service_1.EmployeeRecentVisitService])
], EmployeeRecentVisitEventHandler);
//# sourceMappingURL=employee-recent-visit.handler.js.map