"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentType = exports.StartDateUpdateTypeEnum = exports.RecurringExpenseDefaultCategoriesEnum = exports.RecurringExpenseDeletionEnum = void 0;
var RecurringExpenseDeletionEnum;
(function (RecurringExpenseDeletionEnum) {
    RecurringExpenseDeletionEnum["CURRENT"] = "current";
    RecurringExpenseDeletionEnum["FUTURE"] = "future";
    RecurringExpenseDeletionEnum["ALL"] = "all";
})(RecurringExpenseDeletionEnum || (exports.RecurringExpenseDeletionEnum = RecurringExpenseDeletionEnum = {}));
var RecurringExpenseDefaultCategoriesEnum;
(function (RecurringExpenseDefaultCategoriesEnum) {
    RecurringExpenseDefaultCategoriesEnum["SALARY"] = "SALARY";
    RecurringExpenseDefaultCategoriesEnum["SALARY_TAXES"] = "SALARY_TAXES";
    RecurringExpenseDefaultCategoriesEnum["RENT"] = "RENT";
    RecurringExpenseDefaultCategoriesEnum["EXTRA_BONUS"] = "EXTRA_BONUS";
})(RecurringExpenseDefaultCategoriesEnum || (exports.RecurringExpenseDefaultCategoriesEnum = RecurringExpenseDefaultCategoriesEnum = {}));
var StartDateUpdateTypeEnum;
(function (StartDateUpdateTypeEnum) {
    StartDateUpdateTypeEnum["REDUCE_SAFE"] = "REDUCE_SAFE";
    StartDateUpdateTypeEnum["REDUCE_CONFLICT"] = "REDUCE_CONFLICT";
    StartDateUpdateTypeEnum["INCREASE_SAFE_WITHIN_LIMIT"] = "INCREASE_SAFE_WITHIN_LIMIT";
    StartDateUpdateTypeEnum["INCREASE_SAFE_OUTSIDE_LIMIT"] = "INCREASE_SAFE_OUTSIDE_LIMIT";
    StartDateUpdateTypeEnum["INCREASE_CONFLICT"] = "INCREASE_CONFLICT";
    StartDateUpdateTypeEnum["WITHIN_MONTH"] = "WITHIN_MONTH";
    StartDateUpdateTypeEnum["NO_CHANGE"] = "NO_CHANGE";
})(StartDateUpdateTypeEnum || (exports.StartDateUpdateTypeEnum = StartDateUpdateTypeEnum = {}));
var ComponentType;
(function (ComponentType) {
    ComponentType["EMPLOYEE"] = "EMPLOYEE";
    ComponentType["ORGANIZATION"] = "ORGANIZATION";
})(ComponentType || (exports.ComponentType = ComponentType = {}));
//# sourceMappingURL=recurring-expense.model.js.map