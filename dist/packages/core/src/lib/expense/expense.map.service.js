"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseMapService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const moment = require("moment");
const underscore_1 = require("underscore");
let ExpenseMapService = class ExpenseMapService {
    constructor() { }
    mapByDate(expenses) {
        const dailyLogs = this.groupByDate(expenses).map((byDateExpense, date) => {
            const sum = this.getDurationSum(byDateExpense);
            const byEmployee = this.groupByEmployee(byDateExpense).map((byEmployeeExpense) => {
                const byProject = this.groupByProject(byEmployeeExpense).map((byProjectExpense) => {
                    const project = byProjectExpense.length > 0 &&
                        byProjectExpense[0]
                        ? byProjectExpense[0].project
                        : null;
                    return {
                        project,
                        expanse: byProjectExpense.map((row) => this.mapExpensePercentage(row, sum))
                    };
                }).value();
                const employee = byEmployeeExpense.length > 0 && byEmployeeExpense[0]
                    ? byEmployeeExpense[0].employee
                    : null;
                return {
                    employee,
                    projects: byProject
                };
            }).value();
            return {
                date,
                employees: byEmployee
            };
        }).value();
        return dailyLogs;
    }
    mapByEmployee(expenses) {
        const byEmployee = this.groupByEmployee(expenses).map((byEmployeeExpense) => {
            const sum = this.getDurationSum(byEmployeeExpense);
            const dailyLogs = this.groupByDate(byEmployeeExpense).map((byDateExpense, date) => {
                const byProject = this.groupByProject(byDateExpense).map((byProjectExpense) => {
                    const project = byProjectExpense.length > 0 &&
                        byProjectExpense[0]
                        ? byProjectExpense[0].project
                        : null;
                    return {
                        project,
                        expanse: byProjectExpense.map((row) => this.mapExpensePercentage(row, sum))
                    };
                }).value();
                return {
                    date,
                    projects: byProject
                };
            }).value();
            const employee = byEmployeeExpense.length > 0 && byEmployeeExpense[0]
                ? byEmployeeExpense[0].employee
                : null;
            return {
                employee,
                dates: dailyLogs
            };
        }).value();
        return byEmployee;
    }
    mapByProject(expenses) {
        const byEmployee = this.groupByProject(expenses).map((byProjectExpense) => {
            const sum = this.getDurationSum(byProjectExpense);
            const dailyLogs = this.groupByDate(byProjectExpense).map((byDateExpense, date) => {
                const byProject = this.groupByEmployee(byDateExpense).map((byEmployeeExpense) => {
                    const employee = byEmployeeExpense.length > 0 &&
                        byEmployeeExpense[0]
                        ? byEmployeeExpense[0].employee
                        : null;
                    return {
                        employee,
                        expanse: byEmployeeExpense.map((row) => this.mapExpensePercentage(row, sum))
                    };
                }).value();
                return {
                    date,
                    employees: byProject
                };
            }).value();
            const project = byProjectExpense.length > 0 && byProjectExpense[0]
                ? byProjectExpense[0].project
                : null;
            return {
                project,
                dates: dailyLogs
            };
        }).value();
        return byEmployee;
    }
    groupByProject(expenses) {
        return (0, underscore_1.chain)(expenses).groupBy((expanse) => {
            return expanse.projectId;
        });
    }
    groupByDate(expenses) {
        return (0, underscore_1.chain)(expenses).groupBy((expanse) => {
            return moment.utc(expanse.valueDate).add(1, 'day').format('YYYY-MM-DD');
        });
    }
    groupByEmployee(expenses) {
        return (0, underscore_1.chain)(expenses).groupBy((expanse) => {
            return expanse.employeeId;
        });
    }
    mapExpensePercentage(expanse, sum = 0) {
        expanse.duration_percentage =
            (parseInt(expanse.duration, 10) * 100) / sum;
        return expanse;
    }
    getDurationSum(expenses) {
        return expenses.reduce((iteratee, log) => {
            return iteratee + parseInt(log.duration, 10);
        }, 0);
    }
};
exports.ExpenseMapService = ExpenseMapService;
exports.ExpenseMapService = ExpenseMapService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], ExpenseMapService);
//# sourceMappingURL=expense.map.service.js.map