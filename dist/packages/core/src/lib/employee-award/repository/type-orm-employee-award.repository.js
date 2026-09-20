"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeAwardRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_award_entity_1 = require("../employee-award.entity");
let TypeOrmEmployeeAwardRepository = class TypeOrmEmployeeAwardRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeAwardRepository = TypeOrmEmployeeAwardRepository;
exports.TypeOrmEmployeeAwardRepository = TypeOrmEmployeeAwardRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_award_entity_1.EmployeeAward)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeAwardRepository);
//# sourceMappingURL=type-orm-employee-award.repository.js.map