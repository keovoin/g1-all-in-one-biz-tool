"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffPolicy = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const pipes_1 = require("./../shared/pipes");
const mikro_orm_time_off_policy_repository_1 = require("./repository/mikro-orm-time-off-policy.repository");
let TimeOffPolicy = class TimeOffPolicy extends internal_1.TenantOrganizationBaseEntity {
};
exports.TimeOffPolicy = TimeOffPolicy;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], TimeOffPolicy.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], TimeOffPolicy.prototype, "requiresApproval", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], TimeOffPolicy.prototype, "paid", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.LeaveTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.LeaveTypeEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', nullable: true }),
    tslib_1.__metadata("design:type", String)
], TimeOffPolicy.prototype, "leaveType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], TimeOffPolicy.prototype, "maxDaysPerYear", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], TimeOffPolicy.prototype, "allowCarryForward", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], TimeOffPolicy.prototype, "maxCarryForwardDays", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], TimeOffPolicy.prototype, "accrualRate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.LeaveAccrualFrequencyEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.LeaveAccrualFrequencyEnum),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', nullable: true }),
    tslib_1.__metadata("design:type", String)
], TimeOffPolicy.prototype, "accrualFrequency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], TimeOffPolicy.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TimeOffRequest, (it) => it.policy, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Array)
], TimeOffPolicy.prototype, "timeOffRequests", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Employee, (employee) => employee.timeOffPolicies, {
        // Defines the database action to perform on update.
        onUpdate: 'CASCADE',
        // Defines the database cascade action on delete.
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], TimeOffPolicy.prototype, "employees", void 0);
exports.TimeOffPolicy = TimeOffPolicy = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('time_off_policy', { mikroOrmRepository: () => mikro_orm_time_off_policy_repository_1.MikroOrmTimeOffPolicyRepository })
], TimeOffPolicy);
//# sourceMappingURL=time-off-policy.entity.js.map