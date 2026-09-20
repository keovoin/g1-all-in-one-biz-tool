"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecurringExpenseService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_employee_recurring_expense_repository_1 = require("./repository/type-orm-employee-recurring-expense.repository");
const mikro_orm_employee_recurring_expense_repository_1 = require("./repository/mikro-orm-employee-recurring-expense.repository");
let EmployeeRecurringExpenseService = class EmployeeRecurringExpenseService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEmployeeRecurringExpenseRepository, mikroOrmEmployeeRecurringExpenseRepository) {
        super(typeOrmEmployeeRecurringExpenseRepository, mikroOrmEmployeeRecurringExpenseRepository);
    }
};
exports.EmployeeRecurringExpenseService = EmployeeRecurringExpenseService;
exports.EmployeeRecurringExpenseService = EmployeeRecurringExpenseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_employee_recurring_expense_repository_1.TypeOrmEmployeeRecurringExpenseRepository,
        mikro_orm_employee_recurring_expense_repository_1.MikroOrmEmployeeRecurringExpenseRepository])
], EmployeeRecurringExpenseService);
//# sourceMappingURL=employee-recurring-expense.service.js.map