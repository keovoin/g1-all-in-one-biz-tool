"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationRecurringExpenseRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_recurring_expense_entity_1 = require("../organization-recurring-expense.entity");
let TypeOrmOrganizationRecurringExpenseRepository = class TypeOrmOrganizationRecurringExpenseRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationRecurringExpenseRepository = TypeOrmOrganizationRecurringExpenseRepository;
exports.TypeOrmOrganizationRecurringExpenseRepository = TypeOrmOrganizationRecurringExpenseRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_recurring_expense_entity_1.OrganizationRecurringExpense)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationRecurringExpenseRepository);
//# sourceMappingURL=type-orm-organization-recurring-expense.repository.js.map