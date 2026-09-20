"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTaskSettingCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const organization_task_setting_service_1 = require("../../organization-task-setting.service");
const organization_task_setting_create_command_1 = require("../organization-task-setting.create.command");
let OrganizationTaskSettingCreateHandler = class OrganizationTaskSettingCreateHandler {
    constructor(_organizationTaskSettingService) {
        this._organizationTaskSettingService = _organizationTaskSettingService;
    }
    /**
     * The execution of a command to create organization task settings.
     * This method tries to create a new organization task setting using the provided command and inputs.
     *
     * @param command An instance of OrganizationTaskSettingCreateCommand containing the necessary information to create an organization task setting.
     * @returns A promise that resolves to an instance of IOrganizationTaskSetting, representing the newly created organization task setting.
     */
    async execute(command) {
        try {
            const { input } = command;
            return await this._organizationTaskSettingService.create(input);
        }
        catch (error) {
            console.log('Error while creating organization task setting', error);
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.OrganizationTaskSettingCreateHandler = OrganizationTaskSettingCreateHandler;
exports.OrganizationTaskSettingCreateHandler = OrganizationTaskSettingCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_task_setting_create_command_1.OrganizationTaskSettingCreateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_task_setting_service_1.OrganizationTaskSettingService])
], OrganizationTaskSettingCreateHandler);
//# sourceMappingURL=organization-task-setting.create.handler.js.map