"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomEmployeeSetting = void 0;
const faker_1 = require("@faker-js/faker");
const employee_setting_entity_1 = require("./employee-setting.entity");
const createRandomEmployeeSetting = async (dataSource, tenants, tenantOrganizationsMap, organizationEmployeesMap) => {
    if (!organizationEmployeesMap) {
        console.warn('Warning: organizationEmployeesMap not found, Employee settings  will not be created');
        return;
    }
    const employees = [];
    for await (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant);
        for await (const organization of organizations) {
            const tenantEmployees = organizationEmployeesMap.get(organization);
            for await (const tenantEmployee of tenantEmployees) {
                const employee = new employee_setting_entity_1.EmployeeSetting();
                employee.employeeId = tenantEmployee.id;
                employee.employee = tenantEmployee;
                employee.organization = faker_1.faker.helpers.arrayElement(organizations);
                employee.tenant = tenant;
                employees.push(employee);
            }
        }
    }
    await insertRandomEmployeeSetting(dataSource, employees);
    return employees;
};
exports.createRandomEmployeeSetting = createRandomEmployeeSetting;
const insertRandomEmployeeSetting = async (dataSource, Employees) => {
    await dataSource.createQueryBuilder().insert().into(employee_setting_entity_1.EmployeeSetting).values(Employees).execute();
};
//# sourceMappingURL=employee-setting.seed.js.map