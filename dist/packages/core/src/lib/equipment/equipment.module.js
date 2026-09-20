"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const equipment_entity_1 = require("./equipment.entity");
const equipment_controller_1 = require("./equipment.controller");
const equipment_service_1 = require("./equipment.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_equipment_repository_1 = require("./repository/type-orm-equipment.repository");
const mikro_orm_equipment_repository_1 = require("./repository/mikro-orm-equipment.repository");
let EquipmentModule = class EquipmentModule {
};
exports.EquipmentModule = EquipmentModule;
exports.EquipmentModule = EquipmentModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([equipment_entity_1.Equipment]), nestjs_1.MikroOrmModule.forFeature([equipment_entity_1.Equipment]), role_permission_module_1.RolePermissionModule],
        controllers: [equipment_controller_1.EquipmentController],
        providers: [equipment_service_1.EquipmentService, type_orm_equipment_repository_1.TypeOrmEquipmentRepository, mikro_orm_equipment_repository_1.MikroOrmEquipmentRepository]
    })
], EquipmentModule);
//# sourceMappingURL=equipment.module.js.map