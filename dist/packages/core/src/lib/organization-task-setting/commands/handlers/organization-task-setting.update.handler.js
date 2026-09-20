"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTaskSettingUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_task_setting_service_1 = require("../../organization-task-setting.service");
const organization_task_setting_update_command_1 = require("../organization-task-setting.update.command");
let OrganizationTaskSettingUpdateHandler = class OrganizationTaskSettingUpdateHandler {
    constructor(_organizationTaskSettingService) {
        this._organizationTaskSettingService = _organizationTaskSettingService;
    }
    /**
     * Executes the update operation for organization task settings.
     *
     * @param command - The command containing the identifier and updated settings.
     * @returns A Promise resolving to the updated organization task settings.
     * @throws Throws an error if the update operation fails.
     */
    async execute(command) {
        try {
            // Destructure the command to obtain the identifier and updated settings.
            const { id, input } = command;
            // Update the organization task settings using the provided service.
            await this._organizationTaskSettingService.update(id, input);
            // Retrieve and return the updated organization task settings.
            return await this._organizationTaskSettingService.findOneByIdString(id);
        }
        catch (error) {
            // Handle errors during the update operation.
            console.error('Error during organization task settings update:', error);
        }
    }
};
exports.OrganizationTaskSettingUpdateHandler = OrganizationTaskSettingUpdateHandler;
exports.OrganizationTaskSettingUpdateHandler = OrganizationTaskSettingUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_task_setting_update_command_1.OrganizationTaskSettingUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_task_setting_service_1.OrganizationTaskSettingService])
], OrganizationTaskSettingUpdateHandler);
//# sourceMappingURL=organization-task-setting.update.handler.js.map