"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypeCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const event_type_create_command_1 = require("../event-type.create.command");
const event_type_entity_1 = require("../../event-type.entity");
const event_type_service_1 = require("../../event-type.service");
const employee_service_1 = require("../../../employee/employee.service");
const organization_service_1 = require("../../../organization/organization.service");
const context_1 = require("../../../core/context");
let EventTypeCreateHandler = class EventTypeCreateHandler {
    constructor(eventTypeService, employeeService, organizationService) {
        this.eventTypeService = eventTypeService;
        this.employeeService = employeeService;
        this.organizationService = organizationService;
    }
    async execute(command) {
        const { input } = command;
        const eventType = new event_type_entity_1.EventType();
        const employee = input.employeeId
            ? await this.employeeService.findOneByIdString(input.employeeId)
            : null;
        const organization = await this.organizationService.findOneByIdString(input.organizationId);
        eventType.employee = employee;
        eventType.organization = organization;
        eventType.isActive = input.isActive || false;
        eventType.description = input.description;
        eventType.title = input.title;
        eventType.durationUnit = input.durationUnit;
        eventType.duration = input.duration;
        eventType.tags = input.tags;
        eventType.tenantId = context_1.RequestContext.currentTenantId();
        return await this.eventTypeService.create(eventType);
    }
};
exports.EventTypeCreateHandler = EventTypeCreateHandler;
exports.EventTypeCreateHandler = EventTypeCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(event_type_create_command_1.EventTypeCreateCommand),
    tslib_1.__metadata("design:paramtypes", [event_type_service_1.EventTypeService,
        employee_service_1.EmployeeService,
        organization_service_1.OrganizationService])
], EventTypeCreateHandler);
//# sourceMappingURL=event-type.create.handler.js.map