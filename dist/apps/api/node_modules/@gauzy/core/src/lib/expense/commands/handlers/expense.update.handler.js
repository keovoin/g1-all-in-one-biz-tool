"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const utils_1 = require("@gauzy/utils");
const expense_service_1 = require("../../expense.service");
const employee_service_1 = require("../../../employee/employee.service");
const employee_statistics_1 = require("../../../employee-statistics");
const expense_update_command_1 = require("../expense.update.command");
let ExpenseUpdateHandler = class ExpenseUpdateHandler {
    constructor(expenseService, employeeService, employeeStatisticsService) {
        this.expenseService = expenseService;
        this.employeeService = employeeService;
        this.employeeStatisticsService = employeeStatisticsService;
    }
    async execute(command) {
        let { id, entity } = command;
        try {
            await this.expenseService.findOneByIdString(id);
            const expense = await this.expenseService.create({ ...entity, id });
            let averageExpense = 0;
            if ((0, utils_1.isNotEmpty)(expense.employeeId)) {
                const { employeeId } = expense;
                const statistic = await this.employeeStatisticsService.getStatisticsByEmployeeId(employeeId);
                averageExpense = this.expenseService.countStatistic(statistic.expenseStatistics);
                await this.employeeService.create({
                    id: employeeId,
                    averageExpenses: averageExpense
                });
            }
            return expense;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ExpenseUpdateHandler = ExpenseUpdateHandler;
exports.ExpenseUpdateHandler = ExpenseUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(expense_update_command_1.ExpenseUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [expense_service_1.ExpenseService,
        employee_service_1.EmployeeService,
        employee_statistics_1.EmployeeStatisticsService])
], ExpenseUpdateHandler);
//# sourceMappingURL=expense.update.handler.js.map