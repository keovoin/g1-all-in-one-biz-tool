"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalPolicyGetHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const approval_policy_service_1 = require("../../approval-policy.service");
const approval_policy_get_command_1 = require("../approval-policy.get.command");
let ApprovalPolicyGetHandler = class ApprovalPolicyGetHandler {
    constructor(approvalPolicyService) {
        this.approvalPolicyService = approvalPolicyService;
    }
    async execute(command) {
        try {
            const { input } = command;
            return await this.approvalPolicyService.findAllApprovalPolicies(input);
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
};
exports.ApprovalPolicyGetHandler = ApprovalPolicyGetHandler;
exports.ApprovalPolicyGetHandler = ApprovalPolicyGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(approval_policy_get_command_1.ApprovalPolicyGetCommand),
    tslib_1.__metadata("design:paramtypes", [approval_policy_service_1.ApprovalPolicyService])
], ApprovalPolicyGetHandler);
//# sourceMappingURL=approval-policy.get.handler.js.map