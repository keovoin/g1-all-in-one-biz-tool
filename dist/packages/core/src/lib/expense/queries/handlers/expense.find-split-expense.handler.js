"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSplitExpenseHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const employee_service_1 = require("../../../employee/employee.service");
const expense_service_1 = require("../../expense.service");
const expense_find_split_expense_query_1 = require("../expense.find-split-expense.query");
const utils_1 = require("../../../core/utils");
/**
 * Finds the split expense for a given organization.
 *
 * 1. Find all expenses for organization which have splitExpense = true & all for the employee
 * 2. Find all employees of the organization (TODO: No. of employees CURRENTLY in the organization?)
 * 3. Divide the value of the expense found in 1 to the no. of employees found in 2 to 'split' the expense equally for all employees.
 */
let FindSplitExpenseHandler = class FindSplitExpenseHandler {
    constructor(expenseService, employeeService) {
        this.expenseService = expenseService;
        this.employeeService = employeeService;
    }
    async execute(query) {
        const { findInput: { relations, filterDate, employeeId } } = query;
        const employee = await this.employeeService.findOneByOptions({
            where: {
                id: employeeId
            },
            relations: ['organization']
        });
        //1. Find all expenses for organization which have splitExpense = true & all for the employee
        const { items, total } = await this.expenseService.findAllExpenses({
            where: [
                {
                    organizationId: employee.organization.id,
                    splitExpense: true
                },
                {
                    employee: {
                        id: employeeId
                    }
                }
            ],
            relations: (0, utils_1.parseFindOptionsRelations)(relations)
        }, filterDate);
        //2. Find all employees of the organization
        const orgEmployees = await this.employeeService.findAll({
            where: {
                organizationId: employee.organization.id
            }
        });
        //3. Divide the value of the expense found in 1 to the no. of employees found in 2.
        const splitItems = items.map((e) => e.splitExpense
            ? {
                ...e,
                amount: +(e.amount /
                    (orgEmployees.total !== 0 ? orgEmployees.total : 1)).toFixed(2),
                originalValue: +e.amount,
                employeeCount: orgEmployees.total
            }
            : e);
        return { items: splitItems, total };
    }
};
exports.FindSplitExpenseHandler = FindSplitExpenseHandler;
exports.FindSplitExpenseHandler = FindSplitExpenseHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(expense_find_split_expense_query_1.FindSplitExpenseQuery),
    tslib_1.__metadata("design:paramtypes", [expense_service_1.ExpenseService,
        employee_service_1.EmployeeService])
], FindSplitExpenseHandler);
//# sourceMappingURL=expense.find-split-expense.handler.js.map