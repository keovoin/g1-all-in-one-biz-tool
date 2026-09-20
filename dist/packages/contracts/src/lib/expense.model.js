"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseStatusesEnum = exports.TaxTypesEnum = exports.ExpenseTypesEnum = void 0;
var ExpenseTypesEnum;
(function (ExpenseTypesEnum) {
    ExpenseTypesEnum["TAX_DEDUCTIBLE"] = "TAX_DEDUCTIBLE";
    ExpenseTypesEnum["NOT_TAX_DEDUCTIBLE"] = "NOT_TAX_DEDUCTIBLE";
    ExpenseTypesEnum["BILLABLE_TO_CONTACT"] = "BILLABLE_TO_CONTACT";
})(ExpenseTypesEnum || (exports.ExpenseTypesEnum = ExpenseTypesEnum = {}));
var TaxTypesEnum;
(function (TaxTypesEnum) {
    TaxTypesEnum["PERCENTAGE"] = "PERCENTAGE";
    TaxTypesEnum["VALUE"] = "VALUE";
})(TaxTypesEnum || (exports.TaxTypesEnum = TaxTypesEnum = {}));
var ExpenseStatusesEnum;
(function (ExpenseStatusesEnum) {
    ExpenseStatusesEnum["INVOICED"] = "INVOICED";
    ExpenseStatusesEnum["UNINVOICED"] = "UNINVOICED";
    ExpenseStatusesEnum["PAID"] = "PAID";
    ExpenseStatusesEnum["NOT_BILLABLE"] = "NOT_BILLABLE";
})(ExpenseStatusesEnum || (exports.ExpenseStatusesEnum = ExpenseStatusesEnum = {}));
//# sourceMappingURL=expense.model.js.map