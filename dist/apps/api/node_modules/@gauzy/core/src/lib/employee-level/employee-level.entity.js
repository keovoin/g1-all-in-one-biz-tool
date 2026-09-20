"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeLevel = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_employee_level_repository_1 = require("./repository/mikro-orm-employee-level.repository");
let EmployeeLevel = class EmployeeLevel extends internal_1.TenantOrganizationBaseEntity {
};
exports.EmployeeLevel = EmployeeLevel;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmployeeLevel.prototype, "level", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (it) => it.employeeLevels, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_employee_level',
        joinColumn: 'employeeLevelId',
        inverseJoinColumn: 'tagId',
    }),
    (0, typeorm_1.JoinTable)({
        name: 'tag_employee_level'
    }),
    tslib_1.__metadata("design:type", Array)
], EmployeeLevel.prototype, "tags", void 0);
exports.EmployeeLevel = EmployeeLevel = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('employee_level', { mikroOrmRepository: () => mikro_orm_employee_level_repository_1.MikroOrmEmployeeLevelRepository })
], EmployeeLevel);
//# sourceMappingURL=employee-level.entity.js.map