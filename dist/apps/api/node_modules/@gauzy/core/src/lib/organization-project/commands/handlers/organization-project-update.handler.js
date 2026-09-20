"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_update_command_1 = require("../organization-project-update.command");
const organization_project_service_1 = require("../../organization-project.service");
let OrganizationProjectUpdateHandler = class OrganizationProjectUpdateHandler {
    constructor(_organizationProjectService) {
        this._organizationProjectService = _organizationProjectService;
    }
    /**
     * Executes the update of an organization project using the provided command data.
     *
     * @param {OrganizationProjectUpdateCommand} command - The command containing the input data for updating the organization project.
     * @returns {Promise<IOrganizationProject>} - Returns a promise that resolves with the updated organization project.
     *
     * @throws {BadRequestException} - Throws a BadRequestException if an error occurs during the update process.
     */
    async execute(command) {
        const { id, input } = command;
        // Update the organization project using the provided input
        await this._organizationProjectService.update(id, input);
        // Find the updated organization project by ID
        return await this._organizationProjectService.findOneByIdString(id);
    }
};
exports.OrganizationProjectUpdateHandler = OrganizationProjectUpdateHandler;
exports.OrganizationProjectUpdateHandler = OrganizationProjectUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_update_command_1.OrganizationProjectUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_project_service_1.OrganizationProjectService])
], OrganizationProjectUpdateHandler);
//# sourceMappingURL=organization-project-update.handler.js.map