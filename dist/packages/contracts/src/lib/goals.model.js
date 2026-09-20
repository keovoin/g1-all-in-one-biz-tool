"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultUpdateStatusEnum = exports.GoalLevelEnum = exports.KeyResultDeadlineEnum = exports.KeyResultTypeEnum = exports.KeyResultWeightEnum = exports.KeyResultNumberUnitsEnum = void 0;
var KeyResultNumberUnitsEnum;
(function (KeyResultNumberUnitsEnum) {
    KeyResultNumberUnitsEnum["SALES"] = "sales";
    KeyResultNumberUnitsEnum["VISITORS"] = "visitors";
    KeyResultNumberUnitsEnum["PEOPLE"] = "people";
    KeyResultNumberUnitsEnum["ITEMS"] = "items";
    KeyResultNumberUnitsEnum["CLIENTS"] = "clients";
})(KeyResultNumberUnitsEnum || (exports.KeyResultNumberUnitsEnum = KeyResultNumberUnitsEnum = {}));
var KeyResultWeightEnum;
(function (KeyResultWeightEnum) {
    KeyResultWeightEnum["DEFAULT"] = "1";
    KeyResultWeightEnum["INCREASE_BY_2X"] = "2";
    KeyResultWeightEnum["INCREASE_BY_4X"] = "4";
})(KeyResultWeightEnum || (exports.KeyResultWeightEnum = KeyResultWeightEnum = {}));
var KeyResultTypeEnum;
(function (KeyResultTypeEnum) {
    KeyResultTypeEnum["NUMERICAL"] = "Numerical";
    KeyResultTypeEnum["TRUE_OR_FALSE"] = "True/False";
    KeyResultTypeEnum["CURRENCY"] = "Currency";
    KeyResultTypeEnum["TASK"] = "Task";
    KeyResultTypeEnum["KPI"] = "KPI";
})(KeyResultTypeEnum || (exports.KeyResultTypeEnum = KeyResultTypeEnum = {}));
var KeyResultDeadlineEnum;
(function (KeyResultDeadlineEnum) {
    KeyResultDeadlineEnum["NO_CUSTOM_DEADLINE"] = "No Custom Deadline";
    KeyResultDeadlineEnum["HARD_DEADLINE"] = "Hard Deadline";
    KeyResultDeadlineEnum["HARD_AND_SOFT_DEADLINE"] = "Hard and Soft Deadline";
})(KeyResultDeadlineEnum || (exports.KeyResultDeadlineEnum = KeyResultDeadlineEnum = {}));
var GoalLevelEnum;
(function (GoalLevelEnum) {
    GoalLevelEnum["ORGANIZATION"] = "Organization";
    GoalLevelEnum["TEAM"] = "Team";
    GoalLevelEnum["EMPLOYEE"] = "Employee";
})(GoalLevelEnum || (exports.GoalLevelEnum = GoalLevelEnum = {}));
var KeyResultUpdateStatusEnum;
(function (KeyResultUpdateStatusEnum) {
    KeyResultUpdateStatusEnum["ON_TRACK"] = "on track";
    KeyResultUpdateStatusEnum["NEEDS_ATTENTION"] = "needs attention";
    KeyResultUpdateStatusEnum["OFF_TRACK"] = "off track";
    KeyResultUpdateStatusEnum["NONE"] = "none";
})(KeyResultUpdateStatusEnum || (exports.KeyResultUpdateStatusEnum = KeyResultUpdateStatusEnum = {}));
//# sourceMappingURL=goals.model.js.map