"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTaskPriorityBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_task_priority_bulk_create_command_1 = require("../organization-task-priority-bulk-create.command");
const priority_service_1 = require("./../../priority.service");
let OrganizationTaskPriorityBulkCreateHandler = class OrganizationTaskPriorityBulkCreateHandler {
    constructor(taskPriorityService) {
        this.taskPriorityService = taskPriorityService;
    }
    async execute(command) {
        const { input } = command;
        // Create task priorities of the organization.
        return await this.taskPriorityService.bulkCreateOrganizationTaskPriorities(input);
    }
};
exports.OrganizationTaskPriorityBulkCreateHandler = OrganizationTaskPriorityBulkCreateHandler;
exports.OrganizationTaskPriorityBulkCreateHandler = OrganizationTaskPriorityBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_task_priority_bulk_create_command_1.OrganizationTaskPriorityBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [priority_service_1.TaskPriorityService])
], OrganizationTaskPriorityBulkCreateHandler);
//# sourceMappingURL=organization-task-priority-bulk-create.handler.js.map