"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationIssueTypeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_issue_type_bulk_create_command_1 = require("../organization-issue-type-bulk-create.command");
const issue_type_service_1 = require("./../../issue-type.service");
let OrganizationIssueTypeBulkCreateHandler = class OrganizationIssueTypeBulkCreateHandler {
    constructor(issueTypeService) {
        this.issueTypeService = issueTypeService;
    }
    async execute(command) {
        const { input } = command;
        // Create issue types of the organization.
        return await this.issueTypeService.bulkCreateOrganizationIssueType(input);
    }
};
exports.OrganizationIssueTypeBulkCreateHandler = OrganizationIssueTypeBulkCreateHandler;
exports.OrganizationIssueTypeBulkCreateHandler = OrganizationIssueTypeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_issue_type_bulk_create_command_1.OrganizationIssueTypeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [issue_type_service_1.IssueTypeService])
], OrganizationIssueTypeBulkCreateHandler);
//# sourceMappingURL=organization-issue-type-bulk-create.handler.js.map