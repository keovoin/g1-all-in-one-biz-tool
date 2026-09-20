"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAwardService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_employee_award_repository_1 = require("./repository/type-orm-employee-award.repository");
const mikro_orm_employee_award_repository_1 = require("./repository/mikro-orm-employee-award.repository");
let EmployeeAwardService = class EmployeeAwardService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEmployeeAwardRepository, mikroOrmEmployeeAwardRepository) {
        super(typeOrmEmployeeAwardRepository, mikroOrmEmployeeAwardRepository);
    }
};
exports.EmployeeAwardService = EmployeeAwardService;
exports.EmployeeAwardService = EmployeeAwardService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_employee_award_repository_1.TypeOrmEmployeeAwardRepository,
        mikro_orm_employee_award_repository_1.MikroOrmEmployeeAwardRepository])
], EmployeeAwardService);
//# sourceMappingURL=employee-award.service.js.map