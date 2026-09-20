"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAppointmentCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const employee_appointment_service_1 = require("../../employee-appointment.service");
const employee_appointment_create_command_1 = require("../employee-appointment.create.command");
const employee_appointment_entity_1 = require("../../employee-appointment.entity");
const email_service_1 = require("./../../../email-send/email.service");
const employee_service_1 = require("../../../employee/employee.service");
const organization_service_1 = require("../../../organization/organization.service");
const context_1 = require("../../../core/context");
let EmployeeAppointmentCreateHandler = class EmployeeAppointmentCreateHandler {
    constructor(employeeAppointmentService, emailService, employeeService, organizationService) {
        this.employeeAppointmentService = employeeAppointmentService;
        this.emailService = emailService;
        this.employeeService = employeeService;
        this.organizationService = organizationService;
    }
    async execute(command) {
        const { employeeAppointmentInput, languageCode } = command;
        const appointment = new employee_appointment_entity_1.EmployeeAppointment();
        const employee = employeeAppointmentInput.employeeId
            ? await this.employeeService.findOneByIdString(employeeAppointmentInput.employeeId)
            : null;
        const organization = await this.organizationService.findOneByIdString(employeeAppointmentInput.organizationId);
        appointment.employee = employee;
        appointment.organization = organization;
        appointment.agenda = employeeAppointmentInput.agenda;
        appointment.description = employeeAppointmentInput.description;
        appointment.bufferTimeEnd = employeeAppointmentInput.bufferTimeEnd;
        appointment.bufferTimeInMins = +employeeAppointmentInput.bufferTimeInMins;
        appointment.breakStartTime = employeeAppointmentInput.breakStartTime;
        appointment.breakTimeInMins = +employeeAppointmentInput.breakTimeInMins;
        appointment.bufferTimeStart = employeeAppointmentInput.bufferTimeStart;
        appointment.emails = employeeAppointmentInput.emails;
        appointment.startDateTime = employeeAppointmentInput.startDateTime;
        appointment.endDateTime = employeeAppointmentInput.endDateTime;
        appointment.location = employeeAppointmentInput.location;
        appointment.tenantId = context_1.RequestContext.currentTenantId();
        const createdAppointment = await this.employeeAppointmentService.create(appointment);
        if (appointment.emails) {
            this._sendAppointmentEmail(appointment, languageCode);
        }
        return createdAppointment;
    }
    _sendAppointmentEmail(appointment, languageCode) {
        appointment.emails
            .split(', ')
            .forEach((email) => this.emailService.sendAppointmentMail(email, languageCode));
    }
};
exports.EmployeeAppointmentCreateHandler = EmployeeAppointmentCreateHandler;
exports.EmployeeAppointmentCreateHandler = EmployeeAppointmentCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_appointment_create_command_1.EmployeeAppointmentCreateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_appointment_service_1.EmployeeAppointmentService,
        email_service_1.EmailService,
        employee_service_1.EmployeeService,
        organization_service_1.OrganizationService])
], EmployeeAppointmentCreateHandler);
//# sourceMappingURL=employee-appointment.create.handler.js.map