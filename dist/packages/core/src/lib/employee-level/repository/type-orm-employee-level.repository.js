"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeLevelRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_level_entity_1 = require("../employee-level.entity");
let TypeOrmEmployeeLevelRepository = class TypeOrmEmployeeLevelRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeLevelRepository = TypeOrmEmployeeLevelRepository;
exports.TypeOrmEmployeeLevelRepository = TypeOrmEmployeeLevelRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_level_entity_1.EmployeeLevel)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeLevelRepository);
//# sourceMappingURL=type-orm-employee-level.repository.js.map