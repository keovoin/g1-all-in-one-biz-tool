"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomHelpCenterAuthor = exports.createDefaultHelpCenterAuthor = void 0;
const faker_1 = require("@faker-js/faker");
const help_center_author_entity_1 = require("./help-center-author.entity");
const help_center_article_entity_1 = require("../help-center-article/help-center-article.entity");
const createDefaultHelpCenterAuthor = async (dataSource, defaultEmployees) => {
    if (!defaultEmployees) {
        console.warn('Warning: defaultEmployees not found, default help center author not be created');
        return;
    }
    let mapEmployeeToArticles = [];
    const allArticle = await dataSource.manager.find(help_center_article_entity_1.HelpCenterArticle);
    mapEmployeeToArticles = await operateData(dataSource, mapEmployeeToArticles, allArticle, defaultEmployees);
    return mapEmployeeToArticles;
};
exports.createDefaultHelpCenterAuthor = createDefaultHelpCenterAuthor;
const createRandomHelpCenterAuthor = async (dataSource, tenants, tenantEmployeeMap) => {
    if (!tenantEmployeeMap) {
        console.warn('Warning: tenantEmployeeMap not found, help center author not be created');
        return;
    }
    let mapEmployeeToArticles = [];
    const employees = [];
    const allArticle = await dataSource.manager.find(help_center_article_entity_1.HelpCenterArticle, {});
    for (const tenant of tenants) {
        const tenantEmployee = tenantEmployeeMap.get(tenant);
        for (const tenantEmp of tenantEmployee) {
            employees.push(tenantEmp);
        }
    }
    mapEmployeeToArticles = await operateData(dataSource, mapEmployeeToArticles, allArticle, employees);
    return mapEmployeeToArticles;
};
exports.createRandomHelpCenterAuthor = createRandomHelpCenterAuthor;
const insertRandomHelpCenterAuthor = async (dataSource, data) => {
    await dataSource.manager.save(data);
};
const operateData = async (dataSource, mapEmployeeToArticles, allArticle, employees) => {
    for (let i = 0; i < allArticle.length; i++) {
        const employee = faker_1.faker.helpers.arrayElement(employees);
        const employeeMap = new help_center_author_entity_1.HelpCenterAuthor();
        employeeMap.employeeId = employee.id;
        employeeMap.articleId = allArticle[i].id;
        employeeMap.organizationId = employee.organizationId;
        employeeMap.tenantId = employee.tenantId;
        mapEmployeeToArticles.push(employeeMap);
    }
    await insertRandomHelpCenterAuthor(dataSource, mapEmployeeToArticles);
    return mapEmployeeToArticles;
};
//# sourceMappingURL=help-center-author.seed.js.map