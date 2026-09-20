"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingPolicyService = void 0;
const tslib_1 = require("tslib");
const crud_1 = require("./../core/crud");
const common_1 = require("@nestjs/common");
const type_orm_equipment_sharing_policy_repository_1 = require("./repository/type-orm-equipment-sharing-policy.repository");
const mikro_orm_equipment_sharing_policy_repository_1 = require("./repository/mikro-orm-equipment-sharing-policy.repository");
let EquipmentSharingPolicyService = class EquipmentSharingPolicyService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEquipmentSharingPolicyRepository, mikroOrmEquipmentSharingPolicyRepository) {
        super(typeOrmEquipmentSharingPolicyRepository, mikroOrmEquipmentSharingPolicyRepository);
    }
};
exports.EquipmentSharingPolicyService = EquipmentSharingPolicyService;
exports.EquipmentSharingPolicyService = EquipmentSharingPolicyService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_equipment_sharing_policy_repository_1.TypeOrmEquipmentSharingPolicyRepository,
        mikro_orm_equipment_sharing_policy_repository_1.MikroOrmEquipmentSharingPolicyRepository])
], EquipmentSharingPolicyService);
//# sourceMappingURL=equipment-sharing-policy.service.js.map