"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprintEmployee = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_organization_sprint_employee_repository_1 = require("./repository/mikro-orm-organization-sprint-employee.repository");
let OrganizationSprintEmployee = class OrganizationSprintEmployee extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationSprintEmployee = OrganizationSprintEmployee;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: Boolean, nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationSprintEmployee.prototype, "isManager", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OrganizationSprintEmployee.prototype, "assignedAt", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationSprint, (it) => it.members, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", internal_1.OrganizationSprint)
], OrganizationSprintEmployee.prototype, "organizationSprint", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationSprint),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintEmployee.prototype, "organizationSprintId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, (it) => it.sprints, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationSprintEmployee.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintEmployee.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Role, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationSprintEmployee.prototype, "role", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.role),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintEmployee.prototype, "roleId", void 0);
exports.OrganizationSprintEmployee = OrganizationSprintEmployee = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_sprint_employee', {
        mikroOrmRepository: () => mikro_orm_organization_sprint_employee_repository_1.MikroOrmOrganizationSprintEmployeeRepository
    })
], OrganizationSprintEmployee);
//# sourceMappingURL=organization-sprint-employee.entity.js.map