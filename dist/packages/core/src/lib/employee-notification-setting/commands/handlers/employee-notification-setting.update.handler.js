"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeNotificationSettingUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const employee_notification_setting_service_1 = require("../../employee-notification-setting.service");
const employee_notification_setting_update_command_1 = require("../employee-notification-setting.update.command");
let EmployeeNotificationSettingUpdateHandler = class EmployeeNotificationSettingUpdateHandler {
    constructor(employeeNotificationSettingService) {
        this.employeeNotificationSettingService = employeeNotificationSettingService;
    }
    /**
     * Handles the EmployeeNotificationSettingUpdateCommand to Update an employee notification setting.
     *
     * @param command - The command containing the input data for employee notification setting update.
     * @returns A promise that resolves to the updated employee notification setting.
     */
    async execute(command) {
        const { id, input } = command;
        if (!id || !input) {
            throw new Error('Both id and input are required for updating notification setting');
        }
        try {
            // Update the employee notification setting
            const employeeNotificationSetting = await this.employeeNotificationSettingService.update(id, input);
            // Check if the result is an instance of UpdateResult
            if (employeeNotificationSetting instanceof typeorm_1.UpdateResult) {
                // Fetch and return the updated entity
                return this.employeeNotificationSettingService.findOneByIdString(id);
            }
            return employeeNotificationSetting;
        }
        catch (error) {
            // Log error details
            throw new Error(`Failed to update notification setting: ${error.message}`);
        }
    }
};
exports.EmployeeNotificationSettingUpdateHandler = EmployeeNotificationSettingUpdateHandler;
exports.EmployeeNotificationSettingUpdateHandler = EmployeeNotificationSettingUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_notification_setting_update_command_1.EmployeeNotificationSettingUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_notification_setting_service_1.EmployeeNotificationSettingService])
], EmployeeNotificationSettingUpdateHandler);
//# sourceMappingURL=employee-notification-setting.update.handler.js.map