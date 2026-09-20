"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecurringExpenseUpdateTypeHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const recurring_expense_find_update_type_handler_1 = require("../../../shared/handlers/recurring-expense.find-update-type.handler");
const employee_recurring_expense_service_1 = require("../../employee-recurring-expense.service");
const employee_recurring_expense_update_type_query_1 = require("../employee-recurring-expense.update-type.query");
let EmployeeRecurringExpenseUpdateTypeHandler = class EmployeeRecurringExpenseUpdateTypeHandler extends recurring_expense_find_update_type_handler_1.FindRecurringExpenseStartDateUpdateTypeHandler {
    constructor(employeeRecurringExpenseService) {
        super(employeeRecurringExpenseService);
        this.employeeRecurringExpenseService = employeeRecurringExpenseService;
    }
    async execute(command) {
        return await this.executeQuery(command.input);
    }
};
exports.EmployeeRecurringExpenseUpdateTypeHandler = EmployeeRecurringExpenseUpdateTypeHandler;
exports.EmployeeRecurringExpenseUpdateTypeHandler = EmployeeRecurringExpenseUpdateTypeHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(employee_recurring_expense_update_type_query_1.EmployeeRecurringExpenseStartDateUpdateTypeQuery),
    tslib_1.__metadata("design:paramtypes", [employee_recurring_expense_service_1.EmployeeRecurringExpenseService])
], EmployeeRecurringExpenseUpdateTypeHandler);
//# sourceMappingURL=employee-recurring-expense.start-date-update-type.handler.js.map