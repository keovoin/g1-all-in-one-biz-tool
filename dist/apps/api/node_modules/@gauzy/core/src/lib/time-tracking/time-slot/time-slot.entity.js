"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlot = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const internal_1 = require("./../../core/entities/internal");
const entity_1 = require("./../../core/decorators/entity");
const time_slot_minute_entity_1 = require("./time-slot-minute/time-slot-minute.entity");
const time_slot_session_entity_1 = require("../time-slot-session/time-slot-session.entity");
const mikro_orm_time_slot_repository_1 = require("./repository/mikro-orm-time-slot.repository");
let TimeSlot = class TimeSlot extends internal_1.TenantOrganizationBaseEntity {
};
exports.TimeSlot = TimeSlot;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Number,
        description: 'The number of seconds employee spent in the given time slot',
        default: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], TimeSlot.prototype, "duration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Number,
        description: 'Number of keyboard interactions in the given time slot.',
        example: 42,
        default: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], TimeSlot.prototype, "keyboard", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Number,
        description: 'Number of mouse interactions in the given time slot.',
        example: 42,
        default: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], TimeSlot.prototype, "mouse", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Number of movements detected in 10 minutes',
        example: 42,
        default: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], TimeSlot.prototype, "location", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], TimeSlot.prototype, "overall", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => 'timestamptz' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], TimeSlot.prototype, "startedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text',
        nullable: true
    }),
    tslib_1.__metadata("design:type", Object)
], TimeSlot.prototype, "kbMouseActivity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text',
        nullable: true
    }),
    tslib_1.__metadata("design:type", Object)
], TimeSlot.prototype, "locationActivity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text',
        nullable: true
    }),
    tslib_1.__metadata("design:type", Object)
], TimeSlot.prototype, "customActivity", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Date)
], TimeSlot.prototype, "stoppedAt", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Number)
], TimeSlot.prototype, "percentage", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Number)
], TimeSlot.prototype, "keyboardPercentage", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Number)
], TimeSlot.prototype, "mousePercentage", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, (it) => it.timeSlots, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], TimeSlot.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimeSlot.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Screenshot, (it) => it.timeSlot, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], TimeSlot.prototype, "screenshots", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Activity, (it) => it.timeSlot, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], TimeSlot.prototype, "activities", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => time_slot_minute_entity_1.TimeSlotMinute, (it) => it.timeSlot, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], TimeSlot.prototype, "timeSlotMinutes", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => time_slot_session_entity_1.TimeSlotSession, (it) => it.timeSlot, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], TimeSlot.prototype, "timeSlotSessions", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.TimeLog, (it) => it.timeSlots, {
        /**  Database cascade action on update. */
        onUpdate: 'CASCADE',
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true,
        /** Pivot table for many-to-many relationship. */
        pivotTable: 'time_slot_time_logs',
        /** Column in pivot table referencing 'time_slot' primary key. */
        joinColumn: 'timeSlotId',
        /** Column in pivot table referencing 'time_logs' primary key. */
        inverseJoinColumn: 'timeLogId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'time_slot_time_logs' }),
    tslib_1.__metadata("design:type", Array)
], TimeSlot.prototype, "timeLogs", void 0);
exports.TimeSlot = TimeSlot = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('time_slot', { mikroOrmRepository: () => mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository })
], TimeSlot);
//# sourceMappingURL=time-slot.entity.js.map