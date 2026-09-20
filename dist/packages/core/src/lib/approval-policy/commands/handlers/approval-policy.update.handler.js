"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalPolicyUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const approval_policy_service_1 = require("../../approval-policy.service");
const approval_policy_update_command_1 = require("../approval-policy.update.command");
let ApprovalPolicyUpdateHandler = class ApprovalPolicyUpdateHandler {
    constructor(approvalPolicyService) {
        this.approvalPolicyService = approvalPolicyService;
    }
    async execute(command) {
        try {
            const { id, input } = command;
            return await this.approvalPolicyService.update(id, input);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ApprovalPolicyUpdateHandler = ApprovalPolicyUpdateHandler;
exports.ApprovalPolicyUpdateHandler = ApprovalPolicyUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(approval_policy_update_command_1.ApprovalPolicyUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [approval_policy_service_1.ApprovalPolicyService])
], ApprovalPolicyUpdateHandler);
//# sourceMappingURL=approval-policy.update.handler.js.map