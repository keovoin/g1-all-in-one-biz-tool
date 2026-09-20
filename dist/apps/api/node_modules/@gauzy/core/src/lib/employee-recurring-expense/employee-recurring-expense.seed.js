"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomEmployeeRecurringExpense = void 0;
const contracts_1 = require("@gauzy/contracts");
const faker_1 = require("@faker-js/faker");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const employee_recurring_expense_entity_1 = require("./employee-recurring-expense.entity");
const createRandomEmployeeRecurringExpense = async (dataSource, tenants, tenantOrganizationsMap, organizationEmployeesMap) => {
    if (!tenantOrganizationsMap) {
        console.warn('Warning: tenantOrganizationsMap not found, Employee Recurring Expense  will not be created');
        return;
    }
    if (!organizationEmployeesMap) {
        console.warn('Warning: organizationEmployeesMap not found, Employee Recurring Expense  will not be created');
        return;
    }
    const employeeRecurringExpenses = [];
    for await (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant);
        for await (const organization of organizations) {
            const tenantEmployees = organizationEmployeesMap.get(organization);
            for (const [index, tenantEmployee] of tenantEmployees.entries()) {
                const employeeRecurringExpense = new employee_recurring_expense_entity_1.EmployeeRecurringExpense();
                employeeRecurringExpense.employeeId = tenantEmployee.id;
                const startDate = faker_1.faker.date.past();
                employeeRecurringExpense.startDay = startDate.getDate();
                employeeRecurringExpense.startMonth = startDate.getMonth() + 1;
                employeeRecurringExpense.startYear = startDate.getFullYear();
                employeeRecurringExpense.startDate = startDate;
                // TODO: fix endDate generation for some entities only, most should not have end date really
                if (index % 2 === 0) {
                    // new changes
                    const endDate = faker_1.faker.date.between({
                        from: new Date(startDate),
                        to: moment(startDate).add(4, 'months').toDate()
                    });
                    employeeRecurringExpense.endDay = endDate.getDate();
                    employeeRecurringExpense.endMonth = endDate.getMonth();
                    employeeRecurringExpense.endYear = endDate.getFullYear();
                    employeeRecurringExpense.endDate = endDate;
                }
                // TODO: seed with random Categories from that enum, but make sure that SALARY exists in most of employees anyway (except contractors)
                employeeRecurringExpense.categoryName = contracts_1.RecurringExpenseDefaultCategoriesEnum.SALARY;
                employeeRecurringExpense.value = faker_1.faker.number.int(999); // new changes
                employeeRecurringExpense.currency = config_1.environment.defaultCurrency; // new changes
                // TODO: some expenses should have a parent if they change "over time"
                employeeRecurringExpense.parentRecurringExpenseId = null;
                employeeRecurringExpense.employee = tenantEmployee;
                employeeRecurringExpense.tenant = tenant;
                employeeRecurringExpense.organization = organization;
                employeeRecurringExpenses.push(employeeRecurringExpense);
            }
        }
    }
    await insertRandomEmployeeRecurringExpense(dataSource, employeeRecurringExpenses);
    return employeeRecurringExpenses;
};
exports.createRandomEmployeeRecurringExpense = createRandomEmployeeRecurringExpense;
const insertRandomEmployeeRecurringExpense = async (dataSource, Employees) => {
    await dataSource.createQueryBuilder().insert().into(employee_recurring_expense_entity_1.EmployeeRecurringExpense).values(Employees).execute();
};
//# sourceMappingURL=employee-recurring-expense.seed.js.map