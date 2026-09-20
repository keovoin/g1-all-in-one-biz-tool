"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_create_command_1 = require("../organization-project-create.command");
const organization_project_service_1 = require("../../organization-project.service");
const commands_1 = require("../../../tasks/statuses/commands");
const commands_2 = require("../../../tasks/priorities/commands");
const commands_3 = require("../../../tasks/sizes/commands");
const commands_4 = require("../../../tasks/issue-type/commands");
let OrganizationProjectCreateHandler = class OrganizationProjectCreateHandler {
    constructor(_commandBus, _organizationProjectService) {
        this._commandBus = _commandBus;
        this._organizationProjectService = _organizationProjectService;
    }
    /**
     * Executes the creation of an organization project along with its associated task statuses,
     * task priorities, task sizes, and issue types.
     *
     * @param {OrganizationProjectCreateCommand} command - The command containing the input data for creating the organization project.
     * @returns {Promise<IOrganizationProject>} - Returns a promise that resolves with the created organization project.
     *
     * @throws {BadRequestException} - Throws a BadRequestException if an error occurs during the process.
     */
    async execute(command) {
        // Destructure the input data from the command
        const { input } = command;
        // Create the organization project using the input data
        const project = await this._organizationProjectService.create(input);
        // Initialize associated entities for the created project
        this.createAssociatedEntitiesForProject(project);
        // Return the created organization project
        return project;
    }
    /**
     * Creates associated entities (task statuses, priorities, sizes, and issue types) for the organization project.
     *
     * @param {IOrganizationProject} project - The organization project for which associated entities will be created.
     * @returns {Promise<void>} - Returns a promise indicating the completion of the associated entities creation.
     *
     * @throws {HttpException} - Throws an HttpException if an error occurs during the process.
     */
    async createAssociatedEntitiesForProject(project) {
        try {
            console.log('Start: Creating associated entities for project with ID:', project.id);
            // Create task statuses for the newly created organization project
            await this._commandBus.execute(new commands_1.OrganizationProjectStatusBulkCreateCommand(project));
            console.log('Task statuses created successfully');
            // Create task priorities for the newly created organization project
            await this._commandBus.execute(new commands_2.OrganizationProjectTaskPriorityBulkCreateCommand(project));
            console.log('Task priorities created successfully');
            // Create task sizes for the newly created organization project
            await this._commandBus.execute(new commands_3.OrganizationProjectTaskSizeBulkCreateCommand(project));
            console.log('Task sizes created successfully');
            // Create issue types for the newly created organization project
            await this._commandBus.execute(new commands_4.OrganizationProjectIssueTypeBulkCreateCommand(project));
            console.log('Issue types created successfully');
            console.log('End: Associated entities creation completed for project with ID:', project.id);
        }
        catch (error) {
            // Handle errors specific to the associated entities creation process
            console.error('Error while creating associated entities for project:', error);
        }
    }
};
exports.OrganizationProjectCreateHandler = OrganizationProjectCreateHandler;
exports.OrganizationProjectCreateHandler = OrganizationProjectCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_create_command_1.OrganizationProjectCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        organization_project_service_1.OrganizationProjectService])
], OrganizationProjectCreateHandler);
//# sourceMappingURL=organization-project-create.handler.js.map