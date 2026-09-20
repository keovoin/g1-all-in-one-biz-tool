"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalStatusHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const request_approval_status_command_1 = require("../request-approval.status.command");
const request_approval_service_1 = require("../../request-approval.service");
const equipment_sharing_1 = require("../../../equipment-sharing");
const contracts_1 = require("@gauzy/contracts");
const time_off_request_service_1 = require("../../../time-off-request/time-off-request.service");
let RequestApprovalStatusHandler = class RequestApprovalStatusHandler {
    constructor(requestApprovalService, equipmentSharingService, timeOffRequestService) {
        this.requestApprovalService = requestApprovalService;
        this.equipmentSharingService = equipmentSharingService;
        this.timeOffRequestService = timeOffRequestService;
    }
    async execute(command) {
        const { requestApprovalId, status } = command;
        const requestApproval = await this.requestApprovalService.updateStatusRequestApprovalByAdmin(requestApprovalId, status);
        if (requestApproval.requestType === contracts_1.ApprovalPolicyTypesStringEnum.TIME_OFF) {
            const timeOffStatus = contracts_1.StatusTypesMapRequestApprovalEnum[status];
            await this.timeOffRequestService.updateStatusTimeOffByAdmin(requestApproval.requestId, timeOffStatus);
        }
        else if (requestApproval.requestType === contracts_1.ApprovalPolicyTypesStringEnum.EQUIPMENT_SHARING) {
            await this.equipmentSharingService.updateStatusEquipmentSharingByAdmin(requestApproval.requestId, status);
        }
        return requestApproval;
    }
};
exports.RequestApprovalStatusHandler = RequestApprovalStatusHandler;
exports.RequestApprovalStatusHandler = RequestApprovalStatusHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(request_approval_status_command_1.RequestApprovalStatusCommand),
    tslib_1.__metadata("design:paramtypes", [request_approval_service_1.RequestApprovalService,
        equipment_sharing_1.EquipmentSharingService,
        time_off_request_service_1.TimeOffRequestService])
], RequestApprovalStatusHandler);
//# sourceMappingURL=request-approval.status.handler.js.map