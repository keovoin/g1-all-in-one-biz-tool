"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalPolicyGetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const approval_policy_service_1 = require("../../approval-policy.service");
const request_approval_policy_get_command_1 = require("../request-approval-policy.get.command");
let RequestApprovalPolicyGetHandler = class RequestApprovalPolicyGetHandler {
    constructor(approvalPolicyService) {
        this.approvalPolicyService = approvalPolicyService;
    }
    async execute(command) {
        const { input } = command;
        return this.approvalPolicyService.findApprovalPoliciesForRequestApproval(input);
    }
};
exports.RequestApprovalPolicyGetHandler = RequestApprovalPolicyGetHandler;
exports.RequestApprovalPolicyGetHandler = RequestApprovalPolicyGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(request_approval_policy_get_command_1.RequestApprovalPolicyGetCommand),
    tslib_1.__metadata("design:paramtypes", [approval_policy_service_1.ApprovalPolicyService])
], RequestApprovalPolicyGetHandler);
//# sourceMappingURL=request-approval-policy.get.handler.js.map