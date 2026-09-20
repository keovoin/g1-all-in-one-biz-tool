"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilitySlotsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const availability_slots_entity_1 = require("./availability-slots.entity");
const availability_slots_service_1 = require("./availability-slots.service");
const availability_slots_controller_1 = require("./availability-slots.controller");
const handlers_1 = require("./commands/handlers");
const employee_module_1 = require("./../employee/employee.module");
const organization_module_1 = require("./../organization/organization.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_availability_slot_repository_1 = require("./repository/type-orm-availability-slot.repository");
const mikro_orm_availability_slot_repository_1 = require("./repository/mikro-orm-availability-slot.repository");
let AvailabilitySlotsModule = class AvailabilitySlotsModule {
};
exports.AvailabilitySlotsModule = AvailabilitySlotsModule;
exports.AvailabilitySlotsModule = AvailabilitySlotsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([availability_slots_entity_1.AvailabilitySlot]),
            nestjs_1.MikroOrmModule.forFeature([availability_slots_entity_1.AvailabilitySlot]),
            cqrs_1.CqrsModule,
            employee_module_1.EmployeeModule,
            organization_module_1.OrganizationModule,
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [availability_slots_controller_1.AvailabilitySlotsController],
        providers: [availability_slots_service_1.AvailabilitySlotsService, type_orm_availability_slot_repository_1.TypeOrmAvailabilitySlotRepository, mikro_orm_availability_slot_repository_1.MikroOrmAvailabilitySlotRepository, ...handlers_1.CommandHandlers]
    })
], AvailabilitySlotsModule);
//# sourceMappingURL=availability-slots.module.js.map