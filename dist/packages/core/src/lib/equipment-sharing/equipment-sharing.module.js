"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const equipment_sharing_entity_1 = require("./equipment-sharing.entity");
const equipment_sharing_controller_1 = require("./equipment-sharing.controller");
const equipment_sharing_service_1 = require("./equipment-sharing.service");
const handlers_1 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_equipment_sharing_repository_1 = require("./repository/type-orm-equipment-sharing.repository");
const mikro_orm_equipment_sharing_repository_1 = require("./repository/mikro-orm-equipment-sharing.repository");
const request_approval_module_1 = require("../request-approval/request-approval.module");
let EquipmentSharingModule = class EquipmentSharingModule {
};
exports.EquipmentSharingModule = EquipmentSharingModule;
exports.EquipmentSharingModule = EquipmentSharingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([equipment_sharing_entity_1.EquipmentSharing]),
            nestjs_1.MikroOrmModule.forFeature([equipment_sharing_entity_1.EquipmentSharing]),
            cqrs_1.CqrsModule,
            (0, common_1.forwardRef)(() => request_approval_module_1.RequestApprovalModule),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [equipment_sharing_controller_1.EquipmentSharingController],
        providers: [equipment_sharing_service_1.EquipmentSharingService, type_orm_equipment_sharing_repository_1.TypeOrmEquipmentSharingRepository, mikro_orm_equipment_sharing_repository_1.MikroOrmEquipmentSharingRepository, ...handlers_1.CommandHandlers],
        exports: [equipment_sharing_service_1.EquipmentSharingService]
    })
], EquipmentSharingModule);
//# sourceMappingURL=equipment-sharing.module.js.map