"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalStatusCommand = void 0;
class RequestApprovalStatusCommand {
    constructor(requestApprovalId, status) {
        this.requestApprovalId = requestApprovalId;
        this.status = status;
    }
}
exports.RequestApprovalStatusCommand = RequestApprovalStatusCommand;
RequestApprovalStatusCommand.type = '[RequestApproval] Status';
//# sourceMappingURL=request-approval.status.command.js.map