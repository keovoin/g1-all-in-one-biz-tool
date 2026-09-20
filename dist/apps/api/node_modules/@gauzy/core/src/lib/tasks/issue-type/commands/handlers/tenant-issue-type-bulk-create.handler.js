"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantIssueTypeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const tenant_issue_type_bulk_create_command_1 = require("../tenant-issue-type-bulk-create.command");
const issue_type_service_1 = require("../../issue-type.service");
let TenantIssueTypeBulkCreateHandler = class TenantIssueTypeBulkCreateHandler {
    constructor(issueTypeService) {
        this.issueTypeService = issueTypeService;
    }
    /**
     * Executes the command to create default issue types for multiple tenants.
     *
     * This handler receives the `TenantIssueTypeBulkCreateCommand`
     * and delegates the creation of issue types to the IssueTypeService.
     *
     * @param command The command containing tenants for which issue types should be created
     * @returns Promise resolving to an array of created issue types
     */
    async execute(command) {
        return await this.issueTypeService.bulkCreateTenantsIssueTypes(command.tenants);
    }
};
exports.TenantIssueTypeBulkCreateHandler = TenantIssueTypeBulkCreateHandler;
exports.TenantIssueTypeBulkCreateHandler = TenantIssueTypeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tenant_issue_type_bulk_create_command_1.TenantIssueTypeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [issue_type_service_1.IssueTypeService])
], TenantIssueTypeBulkCreateHandler);
//# sourceMappingURL=tenant-issue-type-bulk-create.handler.js.map