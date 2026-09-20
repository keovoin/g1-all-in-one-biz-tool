"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRecurringExpenseByMonthHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../../shared");
const organization_recurring_expense_service_1 = require("../../organization-recurring-expense.service");
const organization_recurring_expense_by_month_query_1 = require("../organization-recurring-expense.by-month.query");
let OrganizationRecurringExpenseByMonthHandler = class OrganizationRecurringExpenseByMonthHandler extends shared_1.FindRecurringExpenseByMonthHandler {
    constructor(organizationRecurringExpenseService) {
        super(organizationRecurringExpenseService);
        this.organizationRecurringExpenseService = organizationRecurringExpenseService;
    }
    async execute(command) {
        const { input } = command;
        const recurringExpenses = await this.executeCommand(input);
        return recurringExpenses;
    }
};
exports.OrganizationRecurringExpenseByMonthHandler = OrganizationRecurringExpenseByMonthHandler;
exports.OrganizationRecurringExpenseByMonthHandler = OrganizationRecurringExpenseByMonthHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(organization_recurring_expense_by_month_query_1.OrganizationRecurringExpenseByMonthQuery),
    tslib_1.__metadata("design:paramtypes", [organization_recurring_expense_service_1.OrganizationRecurringExpenseService])
], OrganizationRecurringExpenseByMonthHandler);
//# sourceMappingURL=organization-recurring-expense.by-month.handler.js.map