"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectModuleEmployee = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_organization_project_module_employee_repository_1 = require("./repository/mikro-orm-organization-project-module-employee.repository");
let OrganizationProjectModuleEmployee = class OrganizationProjectModuleEmployee extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationProjectModuleEmployee = OrganizationProjectModuleEmployee;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: Boolean, nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationProjectModuleEmployee.prototype, "isManager", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OrganizationProjectModuleEmployee.prototype, "assignedAt", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProjectModule, (it) => it.members, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", internal_1.OrganizationProjectModule)
], OrganizationProjectModuleEmployee.prototype, "organizationProjectModule", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationProjectModule),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModuleEmployee.prototype, "organizationProjectModuleId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, (it) => it.modules, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationProjectModuleEmployee.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModuleEmployee.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Role, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationProjectModuleEmployee.prototype, "role", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.role),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModuleEmployee.prototype, "roleId", void 0);
exports.OrganizationProjectModuleEmployee = OrganizationProjectModuleEmployee = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_project_module_employee', {
        mikroOrmRepository: () => mikro_orm_organization_project_module_employee_repository_1.MikroOrmOrganizationProjectModuleEmployeeRepository
    })
], OrganizationProjectModuleEmployee);
//# sourceMappingURL=organization-project-module-employee.entity.js.map