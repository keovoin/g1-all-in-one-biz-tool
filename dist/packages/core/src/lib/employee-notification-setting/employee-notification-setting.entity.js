"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeNotificationSetting = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_employee_notification_setting_repository_1 = require("./repository/mikro-orm-employee-notification-setting.repository");
let EmployeeNotificationSetting = class EmployeeNotificationSetting extends internal_1.TenantOrganizationBaseEntity {
};
exports.EmployeeNotificationSetting = EmployeeNotificationSetting;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], EmployeeNotificationSetting.prototype, "payment", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], EmployeeNotificationSetting.prototype, "assignment", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], EmployeeNotificationSetting.prototype, "invitation", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], EmployeeNotificationSetting.prototype, "mention", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], EmployeeNotificationSetting.prototype, "comment", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], EmployeeNotificationSetting.prototype, "message", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text' }),
    tslib_1.__metadata("design:type", Object)
], EmployeeNotificationSetting.prototype, "preferences", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToOne)(() => internal_1.Employee, {
        /** If set to true then it means that related object can be allowed to be inserted or updated in the database. */
        cascade: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EmployeeNotificationSetting.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeNotificationSetting.prototype, "employeeId", void 0);
exports.EmployeeNotificationSetting = EmployeeNotificationSetting = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('employee_notification_setting', {
        mikroOrmRepository: () => mikro_orm_employee_notification_setting_repository_1.MikroOrmEmployeeNotificationSettingRepository
    })
], EmployeeNotificationSetting);
//# sourceMappingURL=employee-notification-setting.entity.js.map