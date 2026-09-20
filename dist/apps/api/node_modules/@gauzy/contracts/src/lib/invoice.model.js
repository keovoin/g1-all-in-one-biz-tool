"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxCalculationTypeEnum = exports.InvoiceTabsEnum = exports.EstimateColumnsEnum = exports.InvoiceColumnsEnum = exports.EstimateStatusTypesEnum = exports.InvoiceStatusTypesEnum = exports.DiscountTaxTypeEnum = exports.InvoiceTypeEnum = void 0;
var InvoiceTypeEnum;
(function (InvoiceTypeEnum) {
    InvoiceTypeEnum["BY_EMPLOYEE_HOURS"] = "BY_EMPLOYEE_HOURS";
    InvoiceTypeEnum["BY_PROJECT_HOURS"] = "BY_PROJECT_HOURS";
    InvoiceTypeEnum["BY_TASK_HOURS"] = "BY_TASK_HOURS";
    InvoiceTypeEnum["BY_PRODUCTS"] = "BY_PRODUCTS";
    InvoiceTypeEnum["BY_EXPENSES"] = "BY_EXPENSES";
    InvoiceTypeEnum["DETAILED_ITEMS"] = "DETAILED_ITEMS";
})(InvoiceTypeEnum || (exports.InvoiceTypeEnum = InvoiceTypeEnum = {}));
var DiscountTaxTypeEnum;
(function (DiscountTaxTypeEnum) {
    DiscountTaxTypeEnum["PERCENT"] = "PERCENT";
    DiscountTaxTypeEnum["FLAT_VALUE"] = "FLAT";
})(DiscountTaxTypeEnum || (exports.DiscountTaxTypeEnum = DiscountTaxTypeEnum = {}));
var InvoiceStatusTypesEnum;
(function (InvoiceStatusTypesEnum) {
    InvoiceStatusTypesEnum["DRAFT"] = "DRAFT";
    InvoiceStatusTypesEnum["SENT"] = "SENT";
    InvoiceStatusTypesEnum["VIEWED"] = "VIEWED";
    InvoiceStatusTypesEnum["FULLY_PAID"] = "FULLY_PAID";
    InvoiceStatusTypesEnum["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    InvoiceStatusTypesEnum["OVERPAID"] = "OVERPAID";
    InvoiceStatusTypesEnum["VOID"] = "VOID";
})(InvoiceStatusTypesEnum || (exports.InvoiceStatusTypesEnum = InvoiceStatusTypesEnum = {}));
var EstimateStatusTypesEnum;
(function (EstimateStatusTypesEnum) {
    EstimateStatusTypesEnum["DRAFT"] = "DRAFT";
    EstimateStatusTypesEnum["SENT"] = "SENT";
    EstimateStatusTypesEnum["VIEWED"] = "VIEWED";
    EstimateStatusTypesEnum["ACCEPTED"] = "ACCEPTED";
    EstimateStatusTypesEnum["REJECTED"] = "REJECTED";
    EstimateStatusTypesEnum["VOID"] = "VOID";
})(EstimateStatusTypesEnum || (exports.EstimateStatusTypesEnum = EstimateStatusTypesEnum = {}));
var InvoiceColumnsEnum;
(function (InvoiceColumnsEnum) {
    InvoiceColumnsEnum["INVOICE_DATE"] = "INVOICE_DATE";
    InvoiceColumnsEnum["DUE_DATE"] = "DUE_DATE";
    InvoiceColumnsEnum["STATUS"] = "STATUS";
    InvoiceColumnsEnum["TOTAL_VALUE"] = "TOTAL_VALUE";
    InvoiceColumnsEnum["CURRENCY"] = "CURRENCY";
    InvoiceColumnsEnum["TAX"] = "TAX";
    InvoiceColumnsEnum["TAX_2"] = "TAX_2";
    InvoiceColumnsEnum["DISCOUNT"] = "DISCOUNT";
    InvoiceColumnsEnum["CONTACT"] = "CONTACT";
    InvoiceColumnsEnum["PAID_STATUS"] = "PAID_STATUS";
})(InvoiceColumnsEnum || (exports.InvoiceColumnsEnum = InvoiceColumnsEnum = {}));
var EstimateColumnsEnum;
(function (EstimateColumnsEnum) {
    EstimateColumnsEnum["ESTIMATE_DATE"] = "ESTIMATE_DATE";
    EstimateColumnsEnum["DUE_DATE"] = "DUE_DATE";
    EstimateColumnsEnum["STATUS"] = "STATUS";
    EstimateColumnsEnum["TOTAL_VALUE"] = "TOTAL_VALUE";
    EstimateColumnsEnum["CURRENCY"] = "CURRENCY";
    EstimateColumnsEnum["TAX"] = "TAX";
    EstimateColumnsEnum["TAX_2"] = "TAX_2";
    EstimateColumnsEnum["DISCOUNT"] = "DISCOUNT";
    EstimateColumnsEnum["CONTACT"] = "CONTACT";
})(EstimateColumnsEnum || (exports.EstimateColumnsEnum = EstimateColumnsEnum = {}));
var InvoiceTabsEnum;
(function (InvoiceTabsEnum) {
    InvoiceTabsEnum["ACTIONS"] = "ACTIONS";
    InvoiceTabsEnum["SEARCH"] = "SEARCH";
    InvoiceTabsEnum["HISTORY"] = "HISTORY";
})(InvoiceTabsEnum || (exports.InvoiceTabsEnum = InvoiceTabsEnum = {}));
var TaxCalculationTypeEnum;
(function (TaxCalculationTypeEnum) {
    TaxCalculationTypeEnum["SIMPLE"] = "SIMPLE";
    TaxCalculationTypeEnum["COMPOSED"] = "COMPOSED";
})(TaxCalculationTypeEnum || (exports.TaxCalculationTypeEnum = TaxCalculationTypeEnum = {}));
//# sourceMappingURL=invoice.model.js.map