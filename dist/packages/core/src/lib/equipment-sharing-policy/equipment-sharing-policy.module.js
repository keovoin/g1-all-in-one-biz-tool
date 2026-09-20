"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingPolicyModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const equipment_sharing_policy_controller_1 = require("./equipment-sharing-policy.controller");
const equipment_sharing_policy_service_1 = require("./equipment-sharing-policy.service");
const equipment_sharing_policy_entity_1 = require("./equipment-sharing-policy.entity");
const type_orm_equipment_sharing_policy_repository_1 = require("./repository/type-orm-equipment-sharing-policy.repository");
const mikro_orm_equipment_sharing_policy_repository_1 = require("./repository/mikro-orm-equipment-sharing-policy.repository");
let EquipmentSharingPolicyModule = class EquipmentSharingPolicyModule {
};
exports.EquipmentSharingPolicyModule = EquipmentSharingPolicyModule;
exports.EquipmentSharingPolicyModule = EquipmentSharingPolicyModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([equipment_sharing_policy_entity_1.EquipmentSharingPolicy]),
            nestjs_1.MikroOrmModule.forFeature([equipment_sharing_policy_entity_1.EquipmentSharingPolicy]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [equipment_sharing_policy_controller_1.EquipmentSharingPolicyController],
        providers: [equipment_sharing_policy_service_1.EquipmentSharingPolicyService, type_orm_equipment_sharing_policy_repository_1.TypeOrmEquipmentSharingPolicyRepository, mikro_orm_equipment_sharing_policy_repository_1.MikroOrmEquipmentSharingPolicyRepository]
    })
], EquipmentSharingPolicyModule);
//# sourceMappingURL=equipment-sharing-policy.module.js.map