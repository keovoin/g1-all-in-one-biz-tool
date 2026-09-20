"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalPolicyCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const approval_policy_service_1 = require("../../approval-policy.service");
const approval_policy_create_command_1 = require("../approval-policy.create.command");
let ApprovalPolicyCreateHandler = class ApprovalPolicyCreateHandler {
    constructor(approvalPolicyService) {
        this.approvalPolicyService = approvalPolicyService;
    }
    async execute(command) {
        try {
            const { input } = command;
            return await this.approvalPolicyService.create(input);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ApprovalPolicyCreateHandler = ApprovalPolicyCreateHandler;
exports.ApprovalPolicyCreateHandler = ApprovalPolicyCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(approval_policy_create_command_1.ApprovalPolicyCreateCommand),
    tslib_1.__metadata("design:paramtypes", [approval_policy_service_1.ApprovalPolicyService])
], ApprovalPolicyCreateHandler);
//# sourceMappingURL=approval-policy.create.handler.js.map