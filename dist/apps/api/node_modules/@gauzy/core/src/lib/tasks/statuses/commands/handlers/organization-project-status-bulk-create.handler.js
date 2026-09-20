"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectStatusBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_status_bulk_create_command_1 = require("./../organization-project-status-bulk-create.command");
const status_service_1 = require("./../../status.service");
let OrganizationProjectStatusBulkCreateHandler = class OrganizationProjectStatusBulkCreateHandler {
    constructor(taskStatusService) {
        this.taskStatusService = taskStatusService;
    }
    async execute(command) {
        const { input } = command;
        const { id: projectId, organizationId } = input;
        /**
         * Create bulk task statuses for specific organization project
         */
        return await this.taskStatusService.createBulkStatusesByEntity({ organizationId, projectId });
    }
};
exports.OrganizationProjectStatusBulkCreateHandler = OrganizationProjectStatusBulkCreateHandler;
exports.OrganizationProjectStatusBulkCreateHandler = OrganizationProjectStatusBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_status_bulk_create_command_1.OrganizationProjectStatusBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [status_service_1.TaskStatusService])
], OrganizationProjectStatusBulkCreateHandler);
//# sourceMappingURL=organization-project-status-bulk-create.handler.js.map