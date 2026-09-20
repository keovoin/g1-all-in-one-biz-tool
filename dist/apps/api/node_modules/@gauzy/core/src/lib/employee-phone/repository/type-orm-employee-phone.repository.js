"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeePhoneRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_phone_entity_1 = require("../employee-phone.entity");
let TypeOrmEmployeePhoneRepository = class TypeOrmEmployeePhoneRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeePhoneRepository = TypeOrmEmployeePhoneRepository;
exports.TypeOrmEmployeePhoneRepository = TypeOrmEmployeePhoneRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_phone_entity_1.EmployeePhone)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeePhoneRepository);
//# sourceMappingURL=type-orm-employee-phone.repository.js.map