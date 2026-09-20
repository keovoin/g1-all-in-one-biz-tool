"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotSession = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("./../../core/entities/internal");
const entity_1 = require("./../../core/decorators/entity");
const mikro_orm_time_slot_session_repository_1 = require("./repository/mikro-orm-time-slot-session.repository");
let TimeSlotSession = class TimeSlotSession extends internal_1.TenantOrganizationBaseEntity {
};
exports.TimeSlotSession = TimeSlotSession;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => String,
        description: 'Session identifier for tracking across multiple TimeSlots'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], TimeSlotSession.prototype, "sessionId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => 'timestamptz',
        description: 'Session start time'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], TimeSlotSession.prototype, "startTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => 'timestamptz',
        description: 'Session last activity time'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], TimeSlotSession.prototype, "lastActivity", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.TimeSlot, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TimeSlotSession.prototype, "timeSlot", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.timeSlot),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimeSlotSession.prototype, "timeSlotId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TimeSlotSession.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimeSlotSession.prototype, "employeeId", void 0);
exports.TimeSlotSession = TimeSlotSession = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('time_slot_session', { mikroOrmRepository: () => mikro_orm_time_slot_session_repository_1.MikroOrmTimeSlotSessionRepository })
], TimeSlotSession);
//# sourceMappingURL=time-slot-session.entity.js.map