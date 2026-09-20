"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const utils_1 = require("@gauzy/utils");
const income_create_command_1 = require("../income.create.command");
const income_service_1 = require("../../income.service");
const employee_service_1 = require("../../../employee/employee.service");
const employee_statistics_1 = require("../../../employee-statistics");
let IncomeCreateHandler = class IncomeCreateHandler {
    constructor(incomeService, employeeService, employeeStatisticsService) {
        this.incomeService = incomeService;
        this.employeeService = employeeService;
        this.employeeStatisticsService = employeeStatisticsService;
    }
    async execute(command) {
        const { input } = command;
        const income = await this.incomeService.create(input);
        try {
            let averageIncome = 0;
            let averageBonus = 0;
            if ((0, utils_1.isNotEmpty)(income.employeeId)) {
                const { employeeId } = income;
                const stat = await this.employeeStatisticsService.getStatisticsByEmployeeId(employeeId);
                averageIncome = this.incomeService.countStatistic(stat.incomeStatistics);
                averageBonus = this.incomeService.countStatistic(stat.bonusStatistics);
                await this.employeeService.create({
                    id: employeeId,
                    averageIncome: averageIncome,
                    averageBonus: averageBonus
                });
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
        return await this.incomeService.findOneByIdString(income.id);
    }
};
exports.IncomeCreateHandler = IncomeCreateHandler;
exports.IncomeCreateHandler = IncomeCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(income_create_command_1.IncomeCreateCommand),
    tslib_1.__metadata("design:paramtypes", [income_service_1.IncomeService,
        employee_service_1.EmployeeService,
        employee_statistics_1.EmployeeStatisticsService])
], IncomeCreateHandler);
//# sourceMappingURL=income.create.handler.js.map