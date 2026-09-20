"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationVersionBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_version_bulk_create_command_1 = require("../organization-version-bulk-create.command");
const version_service_1 = require("../../version.service");
let OrganizationVersionBulkCreateHandler = class OrganizationVersionBulkCreateHandler {
    constructor(taskVersionService) {
        this.taskVersionService = taskVersionService;
    }
    async execute(command) {
        const { input } = command;
        return await this.taskVersionService.bulkCreateOrganizationVersions(input);
    }
};
exports.OrganizationVersionBulkCreateHandler = OrganizationVersionBulkCreateHandler;
exports.OrganizationVersionBulkCreateHandler = OrganizationVersionBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_version_bulk_create_command_1.OrganizationVersionBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [version_service_1.TaskVersionService])
], OrganizationVersionBulkCreateHandler);
//# sourceMappingURL=organization-version-bulk-create.handler.js.map