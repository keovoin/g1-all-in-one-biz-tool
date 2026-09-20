"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingEmployeeGetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const employee_service_1 = require("../../employee.service");
const working_employee_get_command_1 = require("../working-employee.get.command");
let WorkingEmployeeGetHandler = class WorkingEmployeeGetHandler {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    /**
     *
     */
    async execute(command) {
        const { input } = command;
        const { organizationId = null, forRange, withUser } = input;
        return await this.employeeService.findWorkingEmployees(organizationId, forRange, withUser);
    }
};
exports.WorkingEmployeeGetHandler = WorkingEmployeeGetHandler;
exports.WorkingEmployeeGetHandler = WorkingEmployeeGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(working_employee_get_command_1.WorkingEmployeeGetCommand),
    tslib_1.__metadata("design:paramtypes", [employee_service_1.EmployeeService])
], WorkingEmployeeGetHandler);
//# sourceMappingURL=working-employee.get.handler.js.map