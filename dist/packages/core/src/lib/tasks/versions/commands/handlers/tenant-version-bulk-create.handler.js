"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantVersionBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const tenant_version_bulk_create_command_1 = require("../tenant-version-bulk-create.command");
const version_service_1 = require("../../version.service");
let TenantVersionBulkCreateHandler = class TenantVersionBulkCreateHandler {
    constructor(taskVersionService) {
        this.taskVersionService = taskVersionService;
    }
    async execute(command) {
        const { tenants } = command;
        //1. Create Versions of the tenant.
        return await this.taskVersionService.bulkCreateTenantsVersions(tenants);
    }
};
exports.TenantVersionBulkCreateHandler = TenantVersionBulkCreateHandler;
exports.TenantVersionBulkCreateHandler = TenantVersionBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tenant_version_bulk_create_command_1.TenantVersionBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [version_service_1.TaskVersionService])
], TenantVersionBulkCreateHandler);
//# sourceMappingURL=tenant-version-bulk-create.handler.js.map