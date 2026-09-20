"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeGetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const employee_service_1 = require("../../employee.service");
const employee_get_command_1 = require("../employee.get.command");
let EmployeeGetHandler = class EmployeeGetHandler {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    /**
     * Executes the given command to retrieve an employee based on provided input.
     *
     * @param command The command containing the input to fetch an employee.
     * @returns A promise resolving to an IEmployee instance.
     */
    async execute(command) {
        const { input } = command;
        return await this.employeeService.findOneByOptions(input);
    }
};
exports.EmployeeGetHandler = EmployeeGetHandler;
exports.EmployeeGetHandler = EmployeeGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_get_command_1.EmployeeGetCommand),
    tslib_1.__metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeGetHandler);
//# sourceMappingURL=employee.get.handler.js.map