"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingPolicy = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_equipment_sharing_policy_repository_1 = require("./repository/mikro-orm-equipment-sharing-policy.repository");
let EquipmentSharingPolicy = class EquipmentSharingPolicy extends internal_1.TenantOrganizationBaseEntity {
};
exports.EquipmentSharingPolicy = EquipmentSharingPolicy;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EquipmentSharingPolicy.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], EquipmentSharingPolicy.prototype, "description", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.EquipmentSharing, (it) => it.equipmentSharingPolicy, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], EquipmentSharingPolicy.prototype, "equipmentSharings", void 0);
exports.EquipmentSharingPolicy = EquipmentSharingPolicy = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('equipment_sharing_policy', { mikroOrmRepository: () => mikro_orm_equipment_sharing_policy_repository_1.MikroOrmEquipmentSharingPolicyRepository })
], EquipmentSharingPolicy);
//# sourceMappingURL=equipment-sharing-policy.entity.js.map