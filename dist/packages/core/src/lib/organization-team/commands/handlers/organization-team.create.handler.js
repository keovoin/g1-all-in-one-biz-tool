"use strict";
var OrganizationTeamCreateHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const organization_team_create_command_1 = require("../organization-team.create.command");
const organization_team_service_1 = require("./../../organization-team.service");
const commands_1 = require("./../../../tasks/priorities/commands");
const commands_2 = require("./../../../tasks/sizes/commands");
const commands_3 = require("./../../../tasks/statuses/commands");
const commands_4 = require("./../../../tasks/issue-type/commands");
let OrganizationTeamCreateHandler = OrganizationTeamCreateHandler_1 = class OrganizationTeamCreateHandler {
    constructor(_commandBus, _organizationTeamService) {
        this._commandBus = _commandBus;
        this._organizationTeamService = _organizationTeamService;
        this.logger = new common_1.Logger(OrganizationTeamCreateHandler_1.name);
    }
    /**
     * Handles the creation of an organization team and initiates related background tasks.
     *
     * @param command - The command containing the input data for creating the team.
     * @returns The created organization team.
     */
    async execute(command) {
        try {
            const { input } = command;
            const team = await this._organizationTeamService.create(input);
            // Execute related commands in the background
            this.executeBackgroundTasks(team);
            return team;
        }
        catch (error) {
            this.logger.error('Error while creating organization team', error.stack);
            throw new common_1.BadRequestException(`Error while creating organization team: ${error.message}`);
        }
    }
    /**
     * Executes related commands concurrently in the background.
     *
     * @param team - The organization team for which to execute the commands.
     */
    async executeBackgroundTasks(team) {
        try {
            const commands = [
                new commands_3.OrganizationTeamTaskStatusBulkCreateCommand(team),
                new commands_1.OrganizationTeamTaskPriorityBulkCreateCommand(team),
                new commands_2.OrganizationTeamTaskSizeBulkCreateCommand(team),
                new commands_4.OrganizationTeamIssueTypeBulkCreateCommand(team)
            ];
            await Promise.all(commands.map((command) => this._commandBus.execute(command)));
        }
        catch (error) {
            console.log('Error while executing background tasks:', error);
        }
    }
};
exports.OrganizationTeamCreateHandler = OrganizationTeamCreateHandler;
exports.OrganizationTeamCreateHandler = OrganizationTeamCreateHandler = OrganizationTeamCreateHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_team_create_command_1.OrganizationTeamCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        organization_team_service_1.OrganizationTeamService])
], OrganizationTeamCreateHandler);
//# sourceMappingURL=organization-team.create.handler.js.map