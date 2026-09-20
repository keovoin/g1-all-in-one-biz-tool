"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamTaskVersionBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_team_task_version_bulk_create_command_1 = require("../organization-team-task-version-bulk-create.command");
const version_service_1 = require("../../version.service");
let OrganizationTeamTaskVersionBulkCreateHandler = class OrganizationTeamTaskVersionBulkCreateHandler {
    constructor(taskVersionService) {
        this.taskVersionService = taskVersionService;
    }
    async execute(command) {
        const { input } = command;
        const { id: organizationTeamId, organizationId } = input;
        /**
         * Create bulk task Versions for specific organization team
         */
        return this.taskVersionService.createBulkVersionsByEntity({
            organizationId,
            organizationTeamId
        });
    }
};
exports.OrganizationTeamTaskVersionBulkCreateHandler = OrganizationTeamTaskVersionBulkCreateHandler;
exports.OrganizationTeamTaskVersionBulkCreateHandler = OrganizationTeamTaskVersionBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_team_task_version_bulk_create_command_1.OrganizationTeamTaskVersionBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [version_service_1.TaskVersionService])
], OrganizationTeamTaskVersionBulkCreateHandler);
//# sourceMappingURL=organization-team-task-version-bulk-create.handle.js.map