"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSettingCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const employee_setting_create_command_1 = require("../employee-setting.create.command");
const employee_setting_service_1 = require("../../employee-setting.service");
let EmployeeSettingCreateHandler = class EmployeeSettingCreateHandler {
    constructor(employeeSettingService) {
        this.employeeSettingService = employeeSettingService;
    }
    async execute(command) {
        const { input } = command;
        return await this.employeeSettingService.create(input);
    }
};
exports.EmployeeSettingCreateHandler = EmployeeSettingCreateHandler;
exports.EmployeeSettingCreateHandler = EmployeeSettingCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_setting_create_command_1.EmployeeSettingCreateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_setting_service_1.EmployeeSettingService])
], EmployeeSettingCreateHandler);
//# sourceMappingURL=employee-setting.create.handler.js.map