"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantStatusBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const tenant_status_bulk_create_command_1 = require("./../tenant-status-bulk-create.command");
const status_service_1 = require("./../../status.service");
let TenantStatusBulkCreateHandler = class TenantStatusBulkCreateHandler {
    constructor(taskStatusService) {
        this.taskStatusService = taskStatusService;
    }
    async execute(command) {
        const { tenants } = command;
        return await this.taskStatusService.bulkCreateTenantsStatus(tenants);
    }
};
exports.TenantStatusBulkCreateHandler = TenantStatusBulkCreateHandler;
exports.TenantStatusBulkCreateHandler = TenantStatusBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tenant_status_bulk_create_command_1.TenantStatusBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [status_service_1.TaskStatusService])
], TenantStatusBulkCreateHandler);
//# sourceMappingURL=tenant-status-bulk-create.handler.js.map