"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotMinute = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const class_validator_1 = require("class-validator");
const internal_1 = require("../../../core/entities/internal");
const entity_1 = require("../../../core/decorators/entity");
const time_slot_entity_1 = require("../time-slot.entity");
const mikro_orm_time_slot_minute_repository_1 = require("./repositories/mikro-orm-time-slot-minute.repository");
let TimeSlotMinute = class TimeSlotMinute extends internal_1.TenantOrganizationBaseEntity {
};
exports.TimeSlotMinute = TimeSlotMinute;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Number,
        description: 'Number of keyboard interactions in the given time slot minute.',
        example: 42,
        default: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], TimeSlotMinute.prototype, "keyboard", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Number,
        description: 'Number of mouse interactions in the given time slot minute.',
        example: 42,
        default: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], TimeSlotMinute.prototype, "mouse", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Number of movements detected in 1 minute',
        example: 42,
        default: 0
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], TimeSlotMinute.prototype, "location", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => 'timestamptz' }),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], TimeSlotMinute.prototype, "datetime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text',
        nullable: true
    }),
    tslib_1.__metadata("design:type", Object)
], TimeSlotMinute.prototype, "kbMouseActivity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text',
        nullable: true
    }),
    tslib_1.__metadata("design:type", Object)
], TimeSlotMinute.prototype, "locationActivity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text',
        nullable: true
    }),
    tslib_1.__metadata("design:type", Object)
], TimeSlotMinute.prototype, "customActivity", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => time_slot_entity_1.TimeSlot, (timeSlot) => timeSlot.timeSlotMinutes, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TimeSlotMinute.prototype, "timeSlot", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.timeSlot),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimeSlotMinute.prototype, "timeSlotId", void 0);
exports.TimeSlotMinute = TimeSlotMinute = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('time_slot_minute', { mikroOrmRepository: () => mikro_orm_time_slot_minute_repository_1.MikroOrmTimeSlotMinuteRepository }),
    (0, typeorm_1.Unique)(['timeSlotId', 'datetime'])
], TimeSlotMinute);
//# sourceMappingURL=time-slot-minute.entity.js.map