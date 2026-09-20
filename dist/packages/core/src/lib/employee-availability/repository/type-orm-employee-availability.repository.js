"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeAvailabilityRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_availability_entity_1 = require("../employee-availability.entity");
let TypeOrmEmployeeAvailabilityRepository = class TypeOrmEmployeeAvailabilityRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeAvailabilityRepository = TypeOrmEmployeeAvailabilityRepository;
exports.TypeOrmEmployeeAvailabilityRepository = TypeOrmEmployeeAvailabilityRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_availability_entity_1.EmployeeAvailability)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeAvailabilityRepository);
//# sourceMappingURL=type-orm-employee-availability.repository.js.map