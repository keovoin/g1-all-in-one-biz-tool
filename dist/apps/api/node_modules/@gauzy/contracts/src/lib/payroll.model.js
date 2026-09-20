"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollItemCategoryEnum = exports.PayrollItemTypeEnum = exports.PayrollFrequencyEnum = exports.PayrollRunStatusEnum = void 0;
/**
 * Lifecycle of a payroll run.
 *
 * `DRAFT -> PENDING_APPROVAL -> APPROVED -> PROCESSING -> PAID`, with `CANCELLED` reachable from
 * any state before `PAID`. `PAID` is terminal: money has left the building.
 */
var PayrollRunStatusEnum;
(function (PayrollRunStatusEnum) {
    PayrollRunStatusEnum["DRAFT"] = "DRAFT";
    PayrollRunStatusEnum["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    PayrollRunStatusEnum["APPROVED"] = "APPROVED";
    PayrollRunStatusEnum["PROCESSING"] = "PROCESSING";
    PayrollRunStatusEnum["PAID"] = "PAID";
    PayrollRunStatusEnum["CANCELLED"] = "CANCELLED";
})(PayrollRunStatusEnum || (exports.PayrollRunStatusEnum = PayrollRunStatusEnum = {}));
/**
 * How often a payroll run recurs.
 */
var PayrollFrequencyEnum;
(function (PayrollFrequencyEnum) {
    PayrollFrequencyEnum["WEEKLY"] = "WEEKLY";
    PayrollFrequencyEnum["BI_WEEKLY"] = "BI_WEEKLY";
    PayrollFrequencyEnum["SEMI_MONTHLY"] = "SEMI_MONTHLY";
    PayrollFrequencyEnum["MONTHLY"] = "MONTHLY";
    PayrollFrequencyEnum["QUARTERLY"] = "QUARTERLY";
    PayrollFrequencyEnum["ANNUALLY"] = "ANNUALLY";
})(PayrollFrequencyEnum || (exports.PayrollFrequencyEnum = PayrollFrequencyEnum = {}));
/**
 * What a payroll line item represents.
 */
var PayrollItemTypeEnum;
(function (PayrollItemTypeEnum) {
    PayrollItemTypeEnum["BASIC_SALARY"] = "BASIC_SALARY";
    PayrollItemTypeEnum["ALLOWANCE"] = "ALLOWANCE";
    PayrollItemTypeEnum["BONUS"] = "BONUS";
    PayrollItemTypeEnum["COMMISSION"] = "COMMISSION";
    PayrollItemTypeEnum["OVERTIME"] = "OVERTIME";
    PayrollItemTypeEnum["TAX_DEDUCTION"] = "TAX_DEDUCTION";
    PayrollItemTypeEnum["SOCIAL_SECURITY"] = "SOCIAL_SECURITY";
    PayrollItemTypeEnum["HEALTH_INSURANCE"] = "HEALTH_INSURANCE";
    PayrollItemTypeEnum["LOAN_DEDUCTION"] = "LOAN_DEDUCTION";
    PayrollItemTypeEnum["ADVANCE_DEDUCTION"] = "ADVANCE_DEDUCTION";
    PayrollItemTypeEnum["LEAVE_DEDUCTION"] = "LEAVE_DEDUCTION";
    PayrollItemTypeEnum["OTHER_ADDITION"] = "OTHER_ADDITION";
    PayrollItemTypeEnum["OTHER_DEDUCTION"] = "OTHER_DEDUCTION";
})(PayrollItemTypeEnum || (exports.PayrollItemTypeEnum = PayrollItemTypeEnum = {}));
/**
 * Whether a line item adds to or subtracts from net pay.
 */
var PayrollItemCategoryEnum;
(function (PayrollItemCategoryEnum) {
    PayrollItemCategoryEnum["EARNING"] = "EARNING";
    PayrollItemCategoryEnum["DEDUCTION"] = "DEDUCTION";
})(PayrollItemCategoryEnum || (exports.PayrollItemCategoryEnum = PayrollItemCategoryEnum = {}));
//# sourceMappingURL=payroll.model.js.map