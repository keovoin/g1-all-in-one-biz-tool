"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentEmployeesController = void 0;
const tslib_1 = require("tslib");
const crud_1 = require("./../core/crud");
const appointment_employees_entity_1 = require("./appointment-employees.entity");
const appointment_employees_service_1 = require("./appointment-employees.service");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
let AppointmentEmployeesController = class AppointmentEmployeesController extends crud_1.CrudController {
    constructor(appointmentEmployeesService) {
        super(appointmentEmployeesService);
        this.appointmentEmployeesService = appointmentEmployeesService;
    }
    async findByAppointmentId(appointmentId) {
        return (await this.appointmentEmployeesService.findAll({
            where: {
                appointmentId
            }
        })).items;
    }
    async findEmployeeAppointments(employeeId) {
        return (await this.appointmentEmployeesService.findAll({
            where: {
                employeeId: employeeId
            },
            relations: ['employeeAppointment']
        })).items;
    }
};
exports.AppointmentEmployeesController = AppointmentEmployeesController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find appointment employees by appointment id.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record',
        type: appointment_employees_entity_1.AppointmentEmployee
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('appointment/:appointmentId'),
    tslib_1.__param(0, (0, common_1.Param)('appointmentId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AppointmentEmployeesController.prototype, "findByAppointmentId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find appointments based on employee id.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found records',
        type: appointment_employees_entity_1.AppointmentEmployee
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, common_1.Get)('employee-appointments/:employeeId'),
    tslib_1.__param(0, (0, common_1.Param)('employeeId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AppointmentEmployeesController.prototype, "findEmployeeAppointments", null);
exports.AppointmentEmployeesController = AppointmentEmployeesController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('AppointmentEmployee'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/appointment-employees'),
    tslib_1.__metadata("design:paramtypes", [appointment_employees_service_1.AppointmentEmployeesService])
], AppointmentEmployeesController);
//# sourceMappingURL=appointment-employees.controller.js.map