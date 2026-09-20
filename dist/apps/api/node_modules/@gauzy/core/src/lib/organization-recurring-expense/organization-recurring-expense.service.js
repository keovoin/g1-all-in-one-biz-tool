"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRecurringExpenseService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_organization_recurring_expense_repository_1 = require("./repository/type-orm-organization-recurring-expense.repository");
const mikro_orm_organization_recurring_expense_repository_1 = require("./repository/mikro-orm-organization-recurring-expense.repository");
let OrganizationRecurringExpenseService = class OrganizationRecurringExpenseService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationRecurringExpenseRepository, mikroOrmOrganizationRecurringExpenseRepository) {
        super(typeOrmOrganizationRecurringExpenseRepository, mikroOrmOrganizationRecurringExpenseRepository);
    }
};
exports.OrganizationRecurringExpenseService = OrganizationRecurringExpenseService;
exports.OrganizationRecurringExpenseService = OrganizationRecurringExpenseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_recurring_expense_repository_1.TypeOrmOrganizationRecurringExpenseRepository,
        mikro_orm_organization_recurring_expense_repository_1.MikroOrmOrganizationRecurringExpenseRepository])
], OrganizationRecurringExpenseService);
//# sourceMappingURL=organization-recurring-expense.service.js.map