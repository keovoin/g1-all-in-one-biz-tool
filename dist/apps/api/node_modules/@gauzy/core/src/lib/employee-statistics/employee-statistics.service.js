"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeStatisticsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const moment = require("moment");
const constants_1 = require("@gauzy/constants");
const contracts_1 = require("@gauzy/contracts");
const employee_service_1 = require("../employee/employee.service");
const expense_service_1 = require("../expense/expense.service");
const income_service_1 = require("../income/income.service");
const typeorm_1 = require("typeorm");
const employee_recurring_expense_service_1 = require("../employee-recurring-expense/employee-recurring-expense.service");
const organization_recurring_expense_service_1 = require("../organization-recurring-expense/organization-recurring-expense.service");
let EmployeeStatisticsService = class EmployeeStatisticsService {
    constructor(incomeService, expenseService, employeeRecurringExpenseService, employeeService, organizationRecurringExpenseService) {
        this.incomeService = incomeService;
        this.expenseService = expenseService;
        this.employeeRecurringExpenseService = employeeRecurringExpenseService;
        this.employeeService = employeeService;
        this.organizationRecurringExpenseService = organizationRecurringExpenseService;
        this._monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        /**
         * Return bonus value based on the bonus type and percentage
         * For revenue based bonus, bonus is calculated based on income
         * For profit based bonus, bonus is calculated based on profit
         */
        this.calculateEmployeeBonus = (bonusType, bonusPercentage, income, profit) => {
            bonusType = bonusType ? bonusType : contracts_1.BonusTypeEnum.PROFIT_BASED_BONUS;
            switch (bonusType) {
                case contracts_1.BonusTypeEnum.PROFIT_BASED_BONUS:
                    return (profit * (bonusPercentage || constants_1.DEFAULT_PROFIT_BASED_BONUS)) / 100;
                case contracts_1.BonusTypeEnum.REVENUE_BASED_BONUS:
                    return (income * (bonusPercentage || constants_1.DEFAULT_REVENUE_BASED_BONUS)) / 100;
                default:
                    return 0;
            }
        };
        /**
         * Gets all income records of one or more employees(using employeeId)
         * in last N months(lastNMonths),
         * till the specified Date(searchMonth)
         * lastNMonths = 1, for last 1 month and 12 for an year
         */
        this.employeeIncomeInNMonths = async (employeeIds, { startDate, endDate }, organizationId) => await this.incomeService.findAll({
            select: ['employeeId', 'valueDate', 'amount', 'currency', 'notes', 'isBonus'],
            // typeorm-v1: `join.leftJoinAndSelect: { client }` is expressed as `relations` now
            relations: { client: true },
            where: {
                organizationId,
                employee: {
                    id: (0, typeorm_1.In)(employeeIds)
                },
                valueDate: (0, typeorm_1.Between)(moment(moment(startDate).format('YYYY-MM-DD HH:mm:ss.SSS')).toDate(), moment(moment(endDate).format('YYYY-MM-DD HH:mm:ss.SSS')).toDate())
            },
            order: {
                valueDate: 'DESC'
            }
        });
        /**
         * Gets all expense records of one or more employees(using employeeId)
         * in last N months(lastNMonths),
         * till the specified Date(searchMonth)
         * lastNMonths = 1, for last 1 month and 12 for an year
         */
        this.employeeExpenseInNMonths = async (employeeIds, { startDate, endDate }, organizationId) => await this.expenseService.findAll({
            select: ['employeeId', 'valueDate', 'amount', 'currency', 'notes', 'vendor', 'category'],
            where: {
                organizationId,
                employee: {
                    id: (0, typeorm_1.In)(employeeIds)
                },
                splitExpense: false,
                valueDate: (0, typeorm_1.Between)(moment(moment(startDate).format('YYYY-MM-DD HH:mm:ss.SSS')).toDate(), moment(moment(endDate).format('YYYY-MM-DD HH:mm:ss.SSS')).toDate())
            },
            order: {
                valueDate: 'DESC'
            },
            relations: ['vendor', 'category']
        });
        /**
         * Fetch all recurring expenses of one or more employees using employeeId
         */
        this.employeeRecurringExpenses = async (employeeIds, { startDate, endDate }, organizationId) => await this.employeeRecurringExpenseService.findAll({
            select: ['employeeId', 'currency', 'value', 'categoryName', 'startDate', 'endDate'],
            where: [
                {
                    employeeId: (0, typeorm_1.In)(employeeIds),
                    organizationId,
                    startDate: (0, typeorm_1.LessThanOrEqual)(endDate),
                    endDate: (0, typeorm_1.MoreThanOrEqual)(startDate)
                },
                {
                    employeeId: (0, typeorm_1.In)(employeeIds),
                    organizationId,
                    startDate: (0, typeorm_1.LessThanOrEqual)(endDate),
                    endDate: (0, typeorm_1.IsNull)()
                }
            ]
        });
        /**
         * Gets all expense records of a employee's organization(employeeId)
         * that were marked to be split among its employees,
         * in last N months(lastNMonths),till the specified Date(searchMonth)
         * lastNMonths = 1, for last 1 month and 12 for an year
         *
         * @returns {Promise<Map<string, IMonthAggregatedSplitExpense>>} A map with
         * the key as 'month-year' for every month in the range & for which at least
         * one expense is available
         */
        this.employeeSplitExpenseInNMonths = async (employeeId, { startDate, endDate }, organizationId) => {
            // 1 Get Employee's Organization
            const employee = await this.employeeService.findOneByOptions({
                where: {
                    id: employeeId,
                    organizationId
                },
                relations: ['organization']
            });
            // 2 Find split expenses for Employee's Organization in last N months
            const { items } = await this.expenseService.findAll({
                select: ['valueDate', 'amount', 'currency', 'notes', 'category'],
                where: {
                    organization: { id: employee.organization.id },
                    splitExpense: true,
                    valueDate: (0, typeorm_1.Between)(moment(startDate).toDate(), moment(endDate).toDate())
                },
                relations: ['category']
            });
            const monthlySplitExpenseMap = new Map();
            // 3 Find the number of active employees for each month, and split the expenses among the active employees for each month
            for (const expense of items) {
                const key = `${expense.valueDate.getMonth()}-${expense.valueDate.getFullYear()}`;
                const amount = Number(expense.amount);
                if (monthlySplitExpenseMap.has(key)) {
                    // Update expense statistics values in map if key pre-exists
                    const stat = monthlySplitExpenseMap.get(key);
                    const splitAmount = amount / stat.splitAmong;
                    stat.splitExpense = Number((splitAmount + stat.splitExpense).toFixed(2));
                    stat.expense.push(expense);
                }
                else {
                    // Add a new map entry if the key(month-year) does not already exist
                    const { total: splitAmong } = await this.employeeService.findWorkingEmployees(employee.organization.id, expense.valueDate);
                    const newStat = {
                        month: expense.valueDate.getMonth(),
                        year: expense.valueDate.getFullYear(),
                        splitExpense: Number((amount / splitAmong).toFixed(2)),
                        splitAmong,
                        expense: [expense]
                    };
                    monthlySplitExpenseMap.set(key, newStat);
                }
            }
            return monthlySplitExpenseMap;
        };
        /**
         * Fetch all recurring split expenses of the employee's Organization
         */
        this.organizationRecurringSplitExpenses = async (employeeId, { startDate, endDate }, organizationId) => {
            // 1 Get Employee's Organization
            const employee = await this.employeeService.findOneByOptions({
                where: {
                    id: employeeId,
                    organizationId
                },
                relations: ['organization']
            });
            // 2 Fetch all split recurring expenses of the Employee's Organization
            const { items } = await this.organizationRecurringExpenseService.findAll({
                select: ['currency', 'value', 'categoryName', 'startDate', 'endDate'],
                where: [
                    {
                        organizationId: employee.organization.id,
                        splitExpense: true,
                        startDate: (0, typeorm_1.LessThanOrEqual)(endDate),
                        endDate: (0, typeorm_1.MoreThanOrEqual)(startDate)
                    },
                    {
                        organizationId: employee.organization.id,
                        splitExpense: true,
                        startDate: (0, typeorm_1.LessThanOrEqual)(endDate),
                        endDate: (0, typeorm_1.IsNull)()
                    }
                ]
            });
            const monthlySplitExpenseMap = new Map();
            /**
             * Add Organization split recurring expense from the
             * expense start date
             * OR
             * past N months to each month's expense, whichever is lesser
             * Stop adding recurring expenses at the month where it was stopped
             * OR
             * till the input date
             */
            for (const expense of items) {
                // Find start date based on input date and X months.
                const inputStartDate = startDate;
                /**
                 * Add Organization split recurring expense from the
                 * expense start date
                 * OR
                 * past N months to each month's expense, whichever is more recent
                 */
                const requiredStartDate = expense.startDate > inputStartDate ? expense.startDate : inputStartDate;
                for (const date = new Date(requiredStartDate); date <= new Date(endDate); date.setMonth(date.getMonth() + 1)) {
                    // Stop loading expense if the split recurring expense has ended before input date
                    if (expense.endDate && date > expense.endDate)
                        break;
                    const key = `${date.getMonth()}-${date.getFullYear()}`;
                    const amount = Number(expense.value);
                    if (monthlySplitExpenseMap.has(key)) {
                        // Update expense statistics values in map if key pre-exists
                        const stat = monthlySplitExpenseMap.get(key);
                        const splitExpense = amount / stat.splitAmong;
                        stat.splitExpense = Number((splitExpense + stat.splitExpense).toFixed(2));
                        stat.recurringExpense.push(expense);
                        stat.valueDate = date;
                    }
                    else {
                        const { total: splitAmong } = await this.employeeService.findWorkingEmployees(employee.organization.id, date);
                        // Add a new map entry if the key(month-year) does not already exist
                        const newStat = {
                            month: date.getMonth(),
                            year: date.getFullYear(),
                            splitExpense: Number((amount / splitAmong).toFixed(2)),
                            splitAmong,
                            recurringExpense: [expense],
                            valueDate: date
                        };
                        monthlySplitExpenseMap.set(key, newStat);
                    }
                }
            }
            return monthlySplitExpenseMap;
        };
    }
    async getStatisticsByEmployeeId(employeeId, findInput) {
        const mappedEmployeeIncome = (await this.incomeService.findAllIncomes({
            where: {
                employee: {
                    id: employeeId
                }
            }
        }, findInput ? findInput.valueDate.toString() : null)).items.map((e) => {
            const obj = {};
            const formattedDate = this._formatDate(e.valueDate);
            obj[formattedDate] = +e.amount;
            return obj;
        });
        const mappedEmployeeExpenses = (await this.expenseService.findAllExpenses({
            where: {
                employee: {
                    id: employeeId
                }
            }
        }, findInput ? findInput.valueDate.toString() : null)).items.map((e) => {
            const obj = {};
            const formattedDate = this._formatDate(e.valueDate);
            obj[formattedDate] = +e.amount;
            return obj;
        });
        const sortedEmployeeExpenses = [];
        mappedEmployeeExpenses.forEach((obj) => {
            // tslint:disable-next-line: forin
            for (const key in obj) {
                const foundObject = sortedEmployeeExpenses.find((o) => o.hasOwnProperty(key));
                if (foundObject) {
                    foundObject[key] += obj[key];
                }
                else {
                    sortedEmployeeExpenses.push(obj);
                }
            }
        });
        const sortedEmployeeIncome = [];
        mappedEmployeeIncome.forEach((obj) => {
            // tslint:disable-next-line: forin
            for (const key in obj) {
                const foundObject = sortedEmployeeIncome.find((o) => o.hasOwnProperty(key));
                if (foundObject) {
                    foundObject[key] += obj[key];
                }
                else {
                    sortedEmployeeIncome.push(obj);
                }
            }
        });
        let incomeStatistics = [];
        let expenseStatistics = [];
        this._getLast12months().forEach((month) => {
            const incomeStatForTheMonth = sortedEmployeeIncome.find((incomeStat) => incomeStat.hasOwnProperty(month));
            incomeStatForTheMonth ? incomeStatistics.push(incomeStatForTheMonth[month]) : incomeStatistics.push(0);
            const expenseStatForTheMonth = sortedEmployeeExpenses.find((expenseStat) => expenseStat.hasOwnProperty(month));
            expenseStatForTheMonth ? expenseStatistics.push(expenseStatForTheMonth[month]) : expenseStatistics.push(0);
        });
        const { organization: { bonusType, bonusPercentage } } = await this.employeeService.findOneByIdString(employeeId, {
            relations: ['organization']
        });
        let profitStatistics = [];
        let bonusStatistics = [];
        expenseStatistics.forEach((expenseStat, index) => {
            const income = incomeStatistics[index];
            const profit = income - expenseStat;
            const bonus = this.calculateEmployeeBonus(bonusType, bonusPercentage, income, profit);
            profitStatistics.push(profit);
            bonusStatistics.push(bonus);
        });
        if (findInput && findInput.valueDate) {
            expenseStatistics = expenseStatistics.filter(Number);
            incomeStatistics = incomeStatistics.filter(Number);
            profitStatistics = profitStatistics.filter(Number);
            bonusStatistics = bonusStatistics.filter(Number);
        }
        return {
            expenseStatistics,
            incomeStatistics,
            profitStatistics,
            bonusStatistics
        };
    }
    _getLast12months() {
        const start = new Date(Date.now()).getMonth() + 1;
        const end = start + 11;
        const currentYear = new Date(Date.now()).getFullYear() - 2000;
        const monthsNeeded = [];
        for (let i = start; i <= end; i++) {
            if (i > 11) {
                monthsNeeded.push(this._monthNames[i - 12] + ` '${currentYear}`);
            }
            else {
                monthsNeeded.push(this._monthNames[i] + ` '${currentYear - 1}`);
            }
        }
        return monthsNeeded.reverse();
    }
    _formatDate(date) {
        return `${this._monthNames[date.getMonth()]} '${date.getFullYear() - 2000}`;
    }
};
exports.EmployeeStatisticsService = EmployeeStatisticsService;
exports.EmployeeStatisticsService = EmployeeStatisticsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [income_service_1.IncomeService,
        expense_service_1.ExpenseService,
        employee_recurring_expense_service_1.EmployeeRecurringExpenseService,
        employee_service_1.EmployeeService,
        organization_recurring_expense_service_1.OrganizationRecurringExpenseService])
], EmployeeStatisticsService);
//# sourceMappingURL=employee-statistics.service.js.map