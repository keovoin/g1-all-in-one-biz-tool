"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeNotificationSettingCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const employee_notification_setting_service_1 = require("../../employee-notification-setting.service");
const employee_notification_setting_create_command_1 = require("../employee-notification-setting.create.command");
let EmployeeNotificationSettingCreateHandler = class EmployeeNotificationSettingCreateHandler {
    constructor(employeeNotificationSettingService) {
        this.employeeNotificationSettingService = employeeNotificationSettingService;
    }
    /**
     * Handles the EmployeeNotificationSettingCreateCommand to create a new employee notification setting.
     *
     * @param command - The command containing the input data for employee notification setting creation.
     * @returns A promise that resolves to the created employee notification setting.
     */
    async execute(command) {
        const { input } = command;
        if (!input) {
            throw new Error('Input is required for creating notification setting');
        }
        try {
            return this.employeeNotificationSettingService.create(input);
        }
        catch (error) {
            // Log error details
            throw new Error(`Failed to create notification setting: ${error.message}`);
        }
    }
};
exports.EmployeeNotificationSettingCreateHandler = EmployeeNotificationSettingCreateHandler;
exports.EmployeeNotificationSettingCreateHandler = EmployeeNotificationSettingCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_notification_setting_create_command_1.EmployeeNotificationSettingCreateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_notification_setting_service_1.EmployeeNotificationSettingService])
], EmployeeNotificationSettingCreateHandler);
//# sourceMappingURL=employee-notification-setting.create.handler.js.map