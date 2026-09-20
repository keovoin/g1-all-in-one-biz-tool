"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprintCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_sprint_create_command_1 = require("../organization-sprint.create.command");
const organization_sprint_service_1 = require("../../organization-sprint.service");
let OrganizationSprintCreateHandler = class OrganizationSprintCreateHandler {
    constructor(_organizationSprintService) {
        this._organizationSprintService = _organizationSprintService;
    }
    /**
     *  Executes the creation of an organization sprint
     * @param {OrganizationSprintCreateCommand} command The command containing the input data for creating the organization sprint.
     * @returns {Promise<IOrganizationSprint>} - Returns a promise that resolves with the created organization sprint.
     * @throws {BadRequestException} - Throws a BadRequestException if an error occurs during the creation process.
     * @memberof OrganizationSprintCreateHandler
     */
    async execute(command) {
        // Destructure the input data from command
        const { input } = command;
        // Create and return organization sprint
        return await this._organizationSprintService.create(input);
    }
};
exports.OrganizationSprintCreateHandler = OrganizationSprintCreateHandler;
exports.OrganizationSprintCreateHandler = OrganizationSprintCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_sprint_create_command_1.OrganizationSprintCreateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_sprint_service_1.OrganizationSprintService])
], OrganizationSprintCreateHandler);
//# sourceMappingURL=organization-sprint.create.handler.js.map