"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOnePublicEmployeeHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const find_one_public_employee_query_1 = require("../find-one-public-employee.query");
const public_employee_service_1 = require("./../../public-employee.service");
let FindOnePublicEmployeeHandler = class FindOnePublicEmployeeHandler {
    constructor(publicEmployeeService) {
        this.publicEmployeeService = publicEmployeeService;
    }
    async execute(query) {
        const { params, relations = [] } = query;
        return await this.publicEmployeeService.findOneByConditions(params, relations);
    }
};
exports.FindOnePublicEmployeeHandler = FindOnePublicEmployeeHandler;
exports.FindOnePublicEmployeeHandler = FindOnePublicEmployeeHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_one_public_employee_query_1.FindOnePublicEmployeeQuery),
    tslib_1.__metadata("design:paramtypes", [public_employee_service_1.PublicEmployeeService])
], FindOnePublicEmployeeHandler);
//# sourceMappingURL=find-one-public-employee.handler.js.map