"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectTaskPriorityBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_task_priority_bulk_create_command_1 = require("../organization-project-task-priority-bulk-create.command");
const priority_service_1 = require("../../priority.service");
let OrganizationProjectTaskPriorityBulkCreateHandler = class OrganizationProjectTaskPriorityBulkCreateHandler {
    constructor(taskPriorityService) {
        this.taskPriorityService = taskPriorityService;
    }
    async execute(command) {
        const { input } = command;
        const { id: projectId, organizationId } = input;
        // Create task priorities of the organization project.
        return await this.taskPriorityService.createBulkPrioritiesByEntity({ organizationId, projectId });
    }
};
exports.OrganizationProjectTaskPriorityBulkCreateHandler = OrganizationProjectTaskPriorityBulkCreateHandler;
exports.OrganizationProjectTaskPriorityBulkCreateHandler = OrganizationProjectTaskPriorityBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_task_priority_bulk_create_command_1.OrganizationProjectTaskPriorityBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [priority_service_1.TaskPriorityService])
], OrganizationProjectTaskPriorityBulkCreateHandler);
//# sourceMappingURL=organization-project-task-priority-bulk-create.handler.js.map