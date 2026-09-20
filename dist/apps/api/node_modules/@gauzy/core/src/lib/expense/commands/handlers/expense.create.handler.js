"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const utils_1 = require("@gauzy/utils");
const expense_create_command_1 = require("../expense.create.command");
const expense_service_1 = require("../../expense.service");
const employee_service_1 = require("../../../employee/employee.service");
const employee_statistics_1 = require("../../../employee-statistics");
let ExpenseCreateHandler = class ExpenseCreateHandler {
    constructor(expenseService, employeeService, employeeStatisticsService) {
        this.expenseService = expenseService;
        this.employeeService = employeeService;
        this.employeeStatisticsService = employeeStatisticsService;
    }
    async execute(command) {
        const { input } = command;
        const expense = await this.expenseService.create(input);
        try {
            let averageExpense = 0;
            if ((0, utils_1.isNotEmpty)(expense.employeeId)) {
                const { employeeId } = expense;
                const stat = await this.employeeStatisticsService.getStatisticsByEmployeeId(employeeId);
                averageExpense = this.expenseService.countStatistic(stat.expenseStatistics);
                await this.employeeService.create({
                    id: employeeId,
                    averageExpenses: averageExpense
                });
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
        return await this.expenseService.findOneByIdString(expense.id);
    }
};
exports.ExpenseCreateHandler = ExpenseCreateHandler;
exports.ExpenseCreateHandler = ExpenseCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(expense_create_command_1.ExpenseCreateCommand),
    tslib_1.__metadata("design:paramtypes", [expense_service_1.ExpenseService,
        employee_service_1.EmployeeService,
        employee_statistics_1.EmployeeStatisticsService])
], ExpenseCreateHandler);
//# sourceMappingURL=expense.create.handler.js.map