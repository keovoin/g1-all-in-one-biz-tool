"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTypesMapRequestApprovalEnum = exports.StatusTypesEnum = exports.LeaveTypeEnum = exports.LeaveAccrualFrequencyEnum = void 0;
/**
 * How often leave is accrued under a Time Off policy.
 */
var LeaveAccrualFrequencyEnum;
(function (LeaveAccrualFrequencyEnum) {
    LeaveAccrualFrequencyEnum["DAILY"] = "DAILY";
    LeaveAccrualFrequencyEnum["WEEKLY"] = "WEEKLY";
    LeaveAccrualFrequencyEnum["BIWEEKLY"] = "BIWEEKLY";
    LeaveAccrualFrequencyEnum["MONTHLY"] = "MONTHLY";
    LeaveAccrualFrequencyEnum["ANNUALLY"] = "ANNUALLY";
})(LeaveAccrualFrequencyEnum || (exports.LeaveAccrualFrequencyEnum = LeaveAccrualFrequencyEnum = {}));
/**
 * Category of leave a Time Off policy grants, used for grouping and reporting.
 */
var LeaveTypeEnum;
(function (LeaveTypeEnum) {
    LeaveTypeEnum["ANNUAL"] = "ANNUAL";
    LeaveTypeEnum["SICK"] = "SICK";
    LeaveTypeEnum["MATERNITY"] = "MATERNITY";
    LeaveTypeEnum["PATERNITY"] = "PATERNITY";
    LeaveTypeEnum["UNPAID"] = "UNPAID";
    LeaveTypeEnum["COMPENSATORY"] = "COMPENSATORY";
    LeaveTypeEnum["BEREAVEMENT"] = "BEREAVEMENT";
    LeaveTypeEnum["STUDY"] = "STUDY";
    LeaveTypeEnum["OTHER"] = "OTHER";
})(LeaveTypeEnum || (exports.LeaveTypeEnum = LeaveTypeEnum = {}));
var StatusTypesEnum;
(function (StatusTypesEnum) {
    StatusTypesEnum["REQUESTED"] = "REQUESTED";
    StatusTypesEnum["APPROVED"] = "APPROVED";
    StatusTypesEnum["DENIED"] = "DENIED";
    StatusTypesEnum["ALL"] = "ALL";
})(StatusTypesEnum || (exports.StatusTypesEnum = StatusTypesEnum = {}));
var StatusTypesMapRequestApprovalEnum;
(function (StatusTypesMapRequestApprovalEnum) {
    StatusTypesMapRequestApprovalEnum[StatusTypesMapRequestApprovalEnum["REQUESTED"] = 1] = "REQUESTED";
    StatusTypesMapRequestApprovalEnum[StatusTypesMapRequestApprovalEnum["APPROVED"] = 2] = "APPROVED";
    StatusTypesMapRequestApprovalEnum[StatusTypesMapRequestApprovalEnum["DENIED"] = 3] = "DENIED";
})(StatusTypesMapRequestApprovalEnum || (exports.StatusTypesMapRequestApprovalEnum = StatusTypesMapRequestApprovalEnum = {}));
//# sourceMappingURL=time-off.model.js.map