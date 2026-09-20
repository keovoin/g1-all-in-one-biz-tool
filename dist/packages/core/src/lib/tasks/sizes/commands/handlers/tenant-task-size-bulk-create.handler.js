"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantTaskSizeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const tenant_task_size_bulk_create_command_1 = require("../tenant-task-size-bulk-create.command");
const size_service_1 = require("../../size.service");
let TenantTaskSizeBulkCreateHandler = class TenantTaskSizeBulkCreateHandler {
    constructor(taskSizeService) {
        this.taskSizeService = taskSizeService;
    }
    async execute(command) {
        const { tenants } = command;
        //1. Create task sizes of the tenant.
        return await this.taskSizeService.bulkCreateTenantsTaskSizes(tenants);
    }
};
exports.TenantTaskSizeBulkCreateHandler = TenantTaskSizeBulkCreateHandler;
exports.TenantTaskSizeBulkCreateHandler = TenantTaskSizeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tenant_task_size_bulk_create_command_1.TenantTaskSizeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [size_service_1.TaskSizeService])
], TenantTaskSizeBulkCreateHandler);
//# sourceMappingURL=tenant-task-size-bulk-create.handler.js.map