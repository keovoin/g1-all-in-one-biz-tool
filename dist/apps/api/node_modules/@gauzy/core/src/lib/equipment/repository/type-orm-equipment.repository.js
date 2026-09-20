"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEquipmentRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const equipment_entity_1 = require("../equipment.entity");
let TypeOrmEquipmentRepository = class TypeOrmEquipmentRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEquipmentRepository = TypeOrmEquipmentRepository;
exports.TypeOrmEquipmentRepository = TypeOrmEquipmentRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(equipment_entity_1.Equipment)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEquipmentRepository);
//# sourceMappingURL=type-orm-equipment.repository.js.map