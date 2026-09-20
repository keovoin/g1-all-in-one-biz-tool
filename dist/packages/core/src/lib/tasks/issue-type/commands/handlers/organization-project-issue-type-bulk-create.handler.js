"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectIssueTypeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_project_issue_type_bulk_create_command_1 = require("../organization-project-issue-type-bulk-create.command");
const issue_type_service_1 = require("../../issue-type.service");
let OrganizationProjectIssueTypeBulkCreateHandler = class OrganizationProjectIssueTypeBulkCreateHandler {
    constructor(issueTypeService) {
        this.issueTypeService = issueTypeService;
    }
    async execute(command) {
        const { input } = command;
        const { id: projectId, organizationId } = input;
        // Create issue types of the organization project.
        return await this.issueTypeService.createBulkIssueTypeByEntity({
            organizationId,
            projectId,
        });
    }
};
exports.OrganizationProjectIssueTypeBulkCreateHandler = OrganizationProjectIssueTypeBulkCreateHandler;
exports.OrganizationProjectIssueTypeBulkCreateHandler = OrganizationProjectIssueTypeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_project_issue_type_bulk_create_command_1.OrganizationProjectIssueTypeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [issue_type_service_1.IssueTypeService])
], OrganizationProjectIssueTypeBulkCreateHandler);
//# sourceMappingURL=organization-project-issue-type-bulk-create.handler.js.map