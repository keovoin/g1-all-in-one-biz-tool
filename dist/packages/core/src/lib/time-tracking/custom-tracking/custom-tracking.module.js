"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTrackingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const cqrs_1 = require("@nestjs/cqrs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const custom_tracking_controller_1 = require("./custom-tracking.controller");
const custom_tracking_service_1 = require("./custom-tracking.service");
const time_slot_entity_1 = require("../time-slot/time-slot.entity");
const time_log_entity_1 = require("../time-log/time-log.entity");
const time_slot_session_entity_1 = require("../time-slot-session/time-slot-session.entity");
const time_slot_session_service_1 = require("../time-slot-session/time-slot-session.service");
const time_slot_module_1 = require("../time-slot/time-slot.module");
const time_log_module_1 = require("../time-log/time-log.module");
const handlers_1 = require("./commands/handlers");
const type_orm_time_slot_repository_1 = require("../time-slot/repository/type-orm-time-slot.repository");
const mikro_orm_time_slot_repository_1 = require("../time-slot/repository/mikro-orm-time-slot.repository");
const type_orm_time_slot_session_repository_1 = require("../time-slot-session/repository/type-orm-time-slot-session.repository");
const mikro_orm_time_slot_session_repository_1 = require("../time-slot-session/repository/mikro-orm-time-slot-session.repository");
let CustomTrackingModule = class CustomTrackingModule {
};
exports.CustomTrackingModule = CustomTrackingModule;
exports.CustomTrackingModule = CustomTrackingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([time_slot_entity_1.TimeSlot, time_log_entity_1.TimeLog, time_slot_session_entity_1.TimeSlotSession]),
            nestjs_1.MikroOrmModule.forFeature([time_slot_entity_1.TimeSlot, time_log_entity_1.TimeLog, time_slot_session_entity_1.TimeSlotSession]),
            role_permission_module_1.RolePermissionModule,
            (0, common_1.forwardRef)(() => time_slot_module_1.TimeSlotModule),
            (0, common_1.forwardRef)(() => time_log_module_1.TimeLogModule),
            cqrs_1.CqrsModule
        ],
        controllers: [custom_tracking_controller_1.CustomTrackingController],
        providers: [
            custom_tracking_service_1.CustomTrackingService,
            time_slot_session_service_1.TimeSlotSessionService,
            type_orm_time_slot_repository_1.TypeOrmTimeSlotRepository,
            mikro_orm_time_slot_repository_1.MikroOrmTimeSlotRepository,
            type_orm_time_slot_session_repository_1.TypeOrmTimeSlotSessionRepository,
            mikro_orm_time_slot_session_repository_1.MikroOrmTimeSlotSessionRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [custom_tracking_service_1.CustomTrackingService, time_slot_session_service_1.TimeSlotSessionService]
    })
], CustomTrackingModule);
//# sourceMappingURL=custom-tracking.module.js.map