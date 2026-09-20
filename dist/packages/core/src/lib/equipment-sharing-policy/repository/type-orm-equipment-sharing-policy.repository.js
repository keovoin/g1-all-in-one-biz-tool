"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEquipmentSharingPolicyRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const equipment_sharing_policy_entity_1 = require("../equipment-sharing-policy.entity");
let TypeOrmEquipmentSharingPolicyRepository = class TypeOrmEquipmentSharingPolicyRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEquipmentSharingPolicyRepository = TypeOrmEquipmentSharingPolicyRepository;
exports.TypeOrmEquipmentSharingPolicyRepository = TypeOrmEquipmentSharingPolicyRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(equipment_sharing_policy_entity_1.EquipmentSharingPolicy)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEquipmentSharingPolicyRepository);
//# sourceMappingURL=type-orm-equipment-sharing-policy.repository.js.map