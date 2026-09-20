"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTimeSlotMinuteRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const time_slot_minute_entity_1 = require("../time-slot-minute.entity");
let TypeOrmTimeSlotMinuteRepository = class TypeOrmTimeSlotMinuteRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTimeSlotMinuteRepository = TypeOrmTimeSlotMinuteRepository;
exports.TypeOrmTimeSlotMinuteRepository = TypeOrmTimeSlotMinuteRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(time_slot_minute_entity_1.TimeSlotMinute)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTimeSlotMinuteRepository);
//# sourceMappingURL=type-orm-time-slot-minute.repository.js.map