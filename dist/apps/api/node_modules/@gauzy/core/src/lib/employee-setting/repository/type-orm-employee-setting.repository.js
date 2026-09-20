"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeSettingRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_setting_entity_1 = require("../employee-setting.entity");
let TypeOrmEmployeeSettingRepository = class TypeOrmEmployeeSettingRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeSettingRepository = TypeOrmEmployeeSettingRepository;
exports.TypeOrmEmployeeSettingRepository = TypeOrmEmployeeSettingRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_setting_entity_1.EmployeeSetting)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeSettingRepository);
//# sourceMappingURL=type-orm-employee-setting.repository.js.map