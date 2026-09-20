"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmAvailabilitySlotRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const availability_slots_entity_1 = require("../availability-slots.entity");
let TypeOrmAvailabilitySlotRepository = class TypeOrmAvailabilitySlotRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmAvailabilitySlotRepository = TypeOrmAvailabilitySlotRepository;
exports.TypeOrmAvailabilitySlotRepository = TypeOrmAvailabilitySlotRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(availability_slots_entity_1.AvailabilitySlot)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmAvailabilitySlotRepository);
//# sourceMappingURL=type-orm-availability-slot.repository.js.map