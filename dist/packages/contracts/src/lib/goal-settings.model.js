"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalOwnershipEnum = exports.KpiOperatorEnum = exports.GoalTemplateCategoriesEnum = exports.KpiMetricEnum = exports.TimeFrameStatusEnum = void 0;
var TimeFrameStatusEnum;
(function (TimeFrameStatusEnum) {
    TimeFrameStatusEnum["ACTIVE"] = "Active";
    TimeFrameStatusEnum["INACTIVE"] = "Inactive";
})(TimeFrameStatusEnum || (exports.TimeFrameStatusEnum = TimeFrameStatusEnum = {}));
var KpiMetricEnum;
(function (KpiMetricEnum) {
    KpiMetricEnum["NUMERICAL"] = "Numerical";
    KpiMetricEnum["PERCENTAGE"] = "Percentage";
    KpiMetricEnum["CURRENCY"] = "Currency";
})(KpiMetricEnum || (exports.KpiMetricEnum = KpiMetricEnum = {}));
var GoalTemplateCategoriesEnum;
(function (GoalTemplateCategoriesEnum) {
    GoalTemplateCategoriesEnum["PRODUCT_MANAGEMENT"] = "Product Management";
    GoalTemplateCategoriesEnum["SALES"] = "Sales";
    GoalTemplateCategoriesEnum["HR"] = "HR";
    GoalTemplateCategoriesEnum["MARKETING"] = "Marketing";
})(GoalTemplateCategoriesEnum || (exports.GoalTemplateCategoriesEnum = GoalTemplateCategoriesEnum = {}));
var KpiOperatorEnum;
(function (KpiOperatorEnum) {
    KpiOperatorEnum["GREATER_THAN_EQUAL_TO"] = ">=";
    KpiOperatorEnum["LESSER_THAN_EQUAL_TO"] = "<=";
})(KpiOperatorEnum || (exports.KpiOperatorEnum = KpiOperatorEnum = {}));
var GoalOwnershipEnum;
(function (GoalOwnershipEnum) {
    GoalOwnershipEnum["EMPLOYEES"] = "Employees";
    GoalOwnershipEnum["TEAMS"] = "Teams";
    GoalOwnershipEnum["EMPLOYEES_AND_TEAMS"] = "Employees and Teams";
})(GoalOwnershipEnum || (exports.GoalOwnershipEnum = GoalOwnershipEnum = {}));
//# sourceMappingURL=goal-settings.model.js.map