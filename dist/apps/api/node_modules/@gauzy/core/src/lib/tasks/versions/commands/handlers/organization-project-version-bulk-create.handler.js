"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectVersionBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_version_bulk_create_command_1 = require("../organization-project-version-bulk-create.command");
const version_service_1 = require("../../version.service");
let OrganizationProjectVersionBulkCreateHandler = class OrganizationProjectVersionBulkCreateHandler {
    constructor(taskVersionService) {
        this.taskVersionService = taskVersionService;
    }
    async execute(command) {
        const { input } = command;
        const { id: projectId, organizationId } = input;
        /**
         * Create bulk task versions for specific organization project
         */
        return await this.taskVersionService.createBulkVersionsByEntity({
            organizationId,
            projectId
        });
    }
};
exports.OrganizationProjectVersionBulkCreateHandler = OrganizationProjectVersionBulkCreateHandler;
exports.OrganizationProjectVersionBulkCreateHandler = OrganizationProjectVersionBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_version_bulk_create_command_1.OrganizationProjectVersionBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [version_service_1.TaskVersionService])
], OrganizationProjectVersionBulkCreateHandler);
//# sourceMappingURL=organization-project-version-bulk-create.handler.js.map