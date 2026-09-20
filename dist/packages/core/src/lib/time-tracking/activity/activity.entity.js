"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const internal_1 = require("./../../core/entities/internal");
const entity_1 = require("../../core/decorators/entity");
const mikro_orm_activity_repository_1 = require("./repository/mikro-orm-activity.repository");
let Activity = class Activity extends internal_1.TenantOrganizationBaseEntity {
};
exports.Activity = Activity;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Activity.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        ...((0, config_1.isMySQL)() ? { type: 'longtext' } : {})
    }),
    tslib_1.__metadata("design:type", String)
], Activity.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? 'text' : 'json')
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        type: (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? 'text' : 'json'
    }),
    tslib_1.__metadata("design:type", Object)
], Activity.prototype, "metaData", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => 'date' }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'date', nullable: true }),
    tslib_1.__metadata("design:type", String)
], Activity.prototype, "date", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => 'time' }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'time', nullable: true }),
    tslib_1.__metadata("design:type", String)
], Activity.prototype, "time", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Activity.prototype, "duration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.ActivityType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ActivityType),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Activity.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.TimeLogSourceEnum, default: contracts_1.TimeLogSourceEnum.WEB_TIMER }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.TimeLogSourceEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ default: contracts_1.TimeLogSourceEnum.WEB_TIMER }),
    tslib_1.__metadata("design:type", String)
], Activity.prototype, "source", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'timestamptz' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Activity.prototype, "recordedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        nullable: false,
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Activity.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", Object)
], Activity.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.OrganizationProject }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, (it) => it.activities, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Activity.prototype, "project", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, entity_1.ColumnIndex)(),
    (0, typeorm_1.RelationId)((it) => it.project),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], Activity.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.TimeSlot, (it) => it.activities, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Activity.prototype, "timeSlot", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, entity_1.ColumnIndex)(),
    (0, typeorm_1.RelationId)((it) => it.timeSlot),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], Activity.prototype, "timeSlotId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Task, (it) => it.activities, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Activity.prototype, "task", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, entity_1.ColumnIndex)(),
    (0, typeorm_1.RelationId)((it) => it.task),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], Activity.prototype, "taskId", void 0);
exports.Activity = Activity = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('activity', { mikroOrmRepository: () => mikro_orm_activity_repository_1.MikroOrmActivityRepository })
], Activity);
//# sourceMappingURL=activity.entity.js.map