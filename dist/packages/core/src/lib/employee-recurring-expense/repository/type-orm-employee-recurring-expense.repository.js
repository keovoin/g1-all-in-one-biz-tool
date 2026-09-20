"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeRecurringExpenseRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_recurring_expense_entity_1 = require("../employee-recurring-expense.entity");
let TypeOrmEmployeeRecurringExpenseRepository = class TypeOrmEmployeeRecurringExpenseRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeRecurringExpenseRepository = TypeOrmEmployeeRecurringExpenseRepository;
exports.TypeOrmEmployeeRecurringExpenseRepository = TypeOrmEmployeeRecurringExpenseRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_recurring_expense_entity_1.EmployeeRecurringExpense)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeRecurringExpenseRepository);
//# sourceMappingURL=type-orm-employee-recurring-expense.repository.js.map