"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantTaskPriorityBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const tenant_task_priority_bulk_create_command_1 = require("../tenant-task-priority-bulk-create.command");
const priority_service_1 = require("../../priority.service");
let TenantTaskPriorityBulkCreateHandler = class TenantTaskPriorityBulkCreateHandler {
    constructor(taskPriorityService) {
        this.taskPriorityService = taskPriorityService;
    }
    async execute(command) {
        const { tenants } = command;
        // Create task priorities of the tenant.
        return await this.taskPriorityService.bulkCreateTenantsTaskPriorities(tenants);
    }
};
exports.TenantTaskPriorityBulkCreateHandler = TenantTaskPriorityBulkCreateHandler;
exports.TenantTaskPriorityBulkCreateHandler = TenantTaskPriorityBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tenant_task_priority_bulk_create_command_1.TenantTaskPriorityBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [priority_service_1.TaskPriorityService])
], TenantTaskPriorityBulkCreateHandler);
//# sourceMappingURL=tenant-task-priority-bulk-create.handler.js.map