"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSetting = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_employee_setting_repository_1 = require("./repository/mikro-orm-employee-setting.repository");
const pipes_1 = require("../shared/pipes");
let EmployeeSetting = class EmployeeSetting extends internal_1.TenantOrganizationBaseEntity {
};
exports.EmployeeSetting = EmployeeSetting;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.EmployeeSettingTypeEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.EmployeeSettingTypeEnum),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({
        type: 'int',
        nullable: true,
        default: 0,
        transformer: new pipes_1.EmployeeSettingTypeTransformerPipe()
    }),
    tslib_1.__metadata("design:type", String)
], EmployeeSetting.prototype, "settingType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeSetting.prototype, "entityId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.BaseEntityEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.BaseEntityEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeSetting.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], EmployeeSetting.prototype, "data", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], EmployeeSetting.prototype, "defaultData", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, (employee) => employee.settings, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], EmployeeSetting.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeSetting.prototype, "employeeId", void 0);
exports.EmployeeSetting = EmployeeSetting = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('employee_setting', { mikroOrmRepository: () => mikro_orm_employee_setting_repository_1.MikroOrmEmployeeSettingRepository })
], EmployeeSetting);
//# sourceMappingURL=employee-setting.entity.js.map