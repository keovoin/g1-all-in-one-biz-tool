"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectSettingUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_service_1 = require("../../organization-project.service");
const organization_project_setting_update_command_1 = require("../organization-project-setting.update.command");
let OrganizationProjectSettingUpdateHandler = class OrganizationProjectSettingUpdateHandler {
    constructor(_organizationProjectService) {
        this._organizationProjectService = _organizationProjectService;
        this.logger = new common_1.Logger('OrganizationProjectSettingUpdateHandler');
    }
    /**
     * Execute an organization project setting update command.
     *
     * @param command - An `OrganizationProjectSettingUpdateCommand` object containing the update details.
     * @returns A promise that resolves to an `IOrganizationProjectSetting` or an `UpdateResult` object representing the result of the update operation.
     */
    async execute(command) {
        try {
            // Extract the 'id' and 'input' properties from the command object.
            const { id, input } = command;
            // Update the organization project setting using the provided 'id' and 'input'.
            await this._organizationProjectService.update(id, input);
            // Retrieve and return the updated organization project setting.
            return await this._organizationProjectService.findOneByIdString(id);
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Failed to update project integration settings', error.message);
            throw new common_1.HttpException(`Failed to update project integration settings: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.OrganizationProjectSettingUpdateHandler = OrganizationProjectSettingUpdateHandler;
exports.OrganizationProjectSettingUpdateHandler = OrganizationProjectSettingUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_setting_update_command_1.OrganizationProjectSettingUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_project_service_1.OrganizationProjectService])
], OrganizationProjectSettingUpdateHandler);
//# sourceMappingURL=organization-project-setting.update.handler.js.map