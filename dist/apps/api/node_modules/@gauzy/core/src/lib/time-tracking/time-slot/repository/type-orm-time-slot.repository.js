"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTimeSlotRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const time_slot_entity_1 = require("../time-slot.entity");
let TypeOrmTimeSlotRepository = class TypeOrmTimeSlotRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTimeSlotRepository = TypeOrmTimeSlotRepository;
exports.TypeOrmTimeSlotRepository = TypeOrmTimeSlotRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(time_slot_entity_1.TimeSlot)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTimeSlotRepository);
//# sourceMappingURL=type-orm-time-slot.repository.js.map