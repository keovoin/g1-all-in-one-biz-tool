"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStatusBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_status_bulk_create_command_1 = require("./../organization-status-bulk-create.command");
const status_service_1 = require("./../../status.service");
let OrganizationStatusBulkCreateHandler = class OrganizationStatusBulkCreateHandler {
    constructor(taskStatusService) {
        this.taskStatusService = taskStatusService;
    }
    async execute(command) {
        const { input } = command;
        return await this.taskStatusService.bulkCreateOrganizationStatus(input);
    }
};
exports.OrganizationStatusBulkCreateHandler = OrganizationStatusBulkCreateHandler;
exports.OrganizationStatusBulkCreateHandler = OrganizationStatusBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_status_bulk_create_command_1.OrganizationStatusBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [status_service_1.TaskStatusService])
], OrganizationStatusBulkCreateHandler);
//# sourceMappingURL=organization-status-bulk-create.handler.js.map