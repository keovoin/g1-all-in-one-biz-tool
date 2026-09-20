"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAppointmentUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const employee_appointment_service_1 = require("../../employee-appointment.service");
const employee_appointment_update_command_1 = require("../employee-appointment.update.command");
const employee_service_1 = require("../../../employee/employee.service");
const organization_service_1 = require("../../../organization/organization.service");
const utils_1 = require("@gauzy/utils");
let EmployeeAppointmentUpdateHandler = class EmployeeAppointmentUpdateHandler {
    constructor(employeeAppointmentService, employeeService, organizationService) {
        this.employeeAppointmentService = employeeAppointmentService;
        this.employeeService = employeeService;
        this.organizationService = organizationService;
    }
    async execute(command) {
        const { id, employeeAppointmentUpdateRequest: data } = command;
        const employee = data.employeeId ? await this.employeeService.findOneByIdString(data.employeeId) : null;
        const organization = data.organizationId
            ? await this.organizationService.findOneByIdString(data.organizationId)
            : null;
        const tenantId = organization?.tenantId ? organization.tenantId : null;
        const newAppointment = {
            ...((0, utils_1.isNotEmpty)(employee) ? { employeeId: employee.id } : {}),
            ...((0, utils_1.isNotEmpty)(organization) ? { organizationId: organization.id } : {}),
            ...((0, utils_1.isNotEmpty)(tenantId) ? { tenantId: organization.tenantId } : {}),
            ...((0, utils_1.isNotEmpty)(data.agenda) ? { agenda: data.agenda } : {}),
            ...((0, utils_1.isNotEmpty)(data['emails']) ? { emails: data['emails'] } : {}),
            ...((0, utils_1.isNotEmpty)(data['status']) ? { status: data['status'] } : {}),
            ...((0, utils_1.isNotEmpty)(data.description) ? { description: data.description } : {}),
            ...((0, utils_1.isNotEmpty)(data.location) ? { location: data.location } : {}),
            ...((0, utils_1.isNotEmpty)(data.breakStartTime) ? { breakStartTime: data.breakStartTime } : {}),
            ...((0, utils_1.isNotEmpty)(data.breakTimeInMins) ? { breakTimeInMins: +data.breakTimeInMins } : {}),
            ...((0, utils_1.isNotEmpty)(data.bufferTimeStart) ? { bufferTimeStart: data.bufferTimeStart } : {}),
            ...((0, utils_1.isNotEmpty)(data.bufferTimeEnd) ? { bufferTimeEnd: data.bufferTimeEnd } : {}),
            ...((0, utils_1.isNotEmpty)(data.bufferTimeInMins) ? { bufferTimeInMins: +data.bufferTimeInMins } : {}),
            ...((0, utils_1.isNotEmpty)(data.startDateTime) ? { startDateTime: data.startDateTime } : {}),
            ...((0, utils_1.isNotEmpty)(data.endDateTime) ? { endDateTime: data.endDateTime } : {})
        };
        const updatedAppointment = await this.employeeAppointmentService.update(id, newAppointment);
        return updatedAppointment;
    }
};
exports.EmployeeAppointmentUpdateHandler = EmployeeAppointmentUpdateHandler;
exports.EmployeeAppointmentUpdateHandler = EmployeeAppointmentUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_appointment_update_command_1.EmployeeAppointmentUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_appointment_service_1.EmployeeAppointmentService,
        employee_service_1.EmployeeService,
        organization_service_1.OrganizationService])
], EmployeeAppointmentUpdateHandler);
//# sourceMappingURL=employee-appointment.update.handler.js.map