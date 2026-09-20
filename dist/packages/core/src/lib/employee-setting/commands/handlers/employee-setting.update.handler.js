"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSettingUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const employee_setting_update_command_1 = require("../employee-setting.update.command");
const employee_setting_service_1 = require("../../employee-setting.service");
let EmployeeSettingUpdateHandler = class EmployeeSettingUpdateHandler {
    constructor(employeeSettingService) {
        this.employeeSettingService = employeeSettingService;
    }
    async execute(command) {
        const { id, input } = command;
        return await this.employeeSettingService.update(id, input);
    }
};
exports.EmployeeSettingUpdateHandler = EmployeeSettingUpdateHandler;
exports.EmployeeSettingUpdateHandler = EmployeeSettingUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_setting_update_command_1.EmployeeSettingUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_setting_service_1.EmployeeSettingService])
], EmployeeSettingUpdateHandler);
//# sourceMappingURL=employee-setting.update.handler.js.map