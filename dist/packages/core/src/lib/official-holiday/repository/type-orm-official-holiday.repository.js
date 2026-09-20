"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOfficialHolidayRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const official_holiday_entity_1 = require("../official-holiday.entity");
let TypeOrmOfficialHolidayRepository = class TypeOrmOfficialHolidayRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOfficialHolidayRepository = TypeOrmOfficialHolidayRepository;
exports.TypeOrmOfficialHolidayRepository = TypeOrmOfficialHolidayRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(official_holiday_entity_1.OfficialHoliday)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOfficialHolidayRepository);
//# sourceMappingURL=type-orm-official-holiday.repository.js.map