"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeLevelService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_employee_level_repository_1 = require("./repository/type-orm-employee-level.repository");
const mikro_orm_employee_level_repository_1 = require("./repository/mikro-orm-employee-level.repository");
let EmployeeLevelService = class EmployeeLevelService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEmployeeLevelRepository, mikroOrmEmployeeLevelRepository) {
        super(typeOrmEmployeeLevelRepository, mikroOrmEmployeeLevelRepository);
    }
};
exports.EmployeeLevelService = EmployeeLevelService;
exports.EmployeeLevelService = EmployeeLevelService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_employee_level_repository_1.TypeOrmEmployeeLevelRepository,
        mikro_orm_employee_level_repository_1.MikroOrmEmployeeLevelRepository])
], EmployeeLevelService);
//# sourceMappingURL=employee-level.service.js.map