"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPayrollItemRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payroll_item_entity_1 = require("../payroll-item.entity");
let TypeOrmPayrollItemRepository = class TypeOrmPayrollItemRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmPayrollItemRepository = TypeOrmPayrollItemRepository;
exports.TypeOrmPayrollItemRepository = TypeOrmPayrollItemRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(payroll_item_entity_1.PayrollItem)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPayrollItemRepository);
//# sourceMappingURL=type-orm-payroll-item.repository.js.map