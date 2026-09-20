"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPublicEmployeesByOrganizationHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const find_public_employees_by_organization_query_1 = require("../find-public-employees-by-organization.query");
const public_employee_service_1 = require("../../public-employee.service");
let FindPublicEmployeesByOrganizationHandler = class FindPublicEmployeesByOrganizationHandler {
    constructor(publicEmployeeService) {
        this.publicEmployeeService = publicEmployeeService;
    }
    async execute(query) {
        const { options, relations = [] } = query;
        return await this.publicEmployeeService.findPublicEmployeeByOrganization(options, relations);
    }
};
exports.FindPublicEmployeesByOrganizationHandler = FindPublicEmployeesByOrganizationHandler;
exports.FindPublicEmployeesByOrganizationHandler = FindPublicEmployeesByOrganizationHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_public_employees_by_organization_query_1.FindPublicEmployeesByOrganizationQuery),
    tslib_1.__metadata("design:paramtypes", [public_employee_service_1.PublicEmployeeService])
], FindPublicEmployeesByOrganizationHandler);
//# sourceMappingURL=find-public-employees-by-organization.handler.js.map