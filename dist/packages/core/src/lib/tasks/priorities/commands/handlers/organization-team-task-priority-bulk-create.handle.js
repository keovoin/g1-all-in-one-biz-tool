"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamTaskPriorityBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_team_task_priority_bulk_create_command_1 = require("../organization-team-task-priority-bulk-create.command");
const priority_service_1 = require("./../../priority.service");
let OrganizationTeamTaskPriorityBulkCreateHandler = class OrganizationTeamTaskPriorityBulkCreateHandler {
    constructor(taskPriorityService) {
        this.taskPriorityService = taskPriorityService;
    }
    async execute(command) {
        const { input } = command;
        const { id: organizationTeamId, organizationId } = input;
        /**
         * Create bulk task priority for specific organization team
         */
        return await this.taskPriorityService.createBulkPrioritiesByEntity({ organizationId, organizationTeamId });
    }
};
exports.OrganizationTeamTaskPriorityBulkCreateHandler = OrganizationTeamTaskPriorityBulkCreateHandler;
exports.OrganizationTeamTaskPriorityBulkCreateHandler = OrganizationTeamTaskPriorityBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_team_task_priority_bulk_create_command_1.OrganizationTeamTaskPriorityBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [priority_service_1.TaskPriorityService])
], OrganizationTeamTaskPriorityBulkCreateHandler);
//# sourceMappingURL=organization-team-task-priority-bulk-create.handle.js.map