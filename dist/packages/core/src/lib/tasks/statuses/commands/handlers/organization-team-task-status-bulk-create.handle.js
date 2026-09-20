"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamTaskStatusBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_team_task_status_bulk_create_command_1 = require("./../organization-team-task-status-bulk-create.command");
const status_service_1 = require("./../../status.service");
let OrganizationTeamTaskStatusBulkCreateHandler = class OrganizationTeamTaskStatusBulkCreateHandler {
    constructor(taskStatusService) {
        this.taskStatusService = taskStatusService;
    }
    async execute(command) {
        const { input } = command;
        const { id: organizationTeamId, organizationId } = input;
        /**
         * Create bulk task statuses for specific organization team
         */
        return this.taskStatusService.createBulkStatusesByEntity({ organizationId, organizationTeamId });
    }
};
exports.OrganizationTeamTaskStatusBulkCreateHandler = OrganizationTeamTaskStatusBulkCreateHandler;
exports.OrganizationTeamTaskStatusBulkCreateHandler = OrganizationTeamTaskStatusBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_team_task_status_bulk_create_command_1.OrganizationTeamTaskStatusBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [status_service_1.TaskStatusService])
], OrganizationTeamTaskStatusBulkCreateHandler);
//# sourceMappingURL=organization-team-task-status-bulk-create.handle.js.map