"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmIncomeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const income_entity_1 = require("../income.entity");
let TypeOrmIncomeRepository = class TypeOrmIncomeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmIncomeRepository = TypeOrmIncomeRepository;
exports.TypeOrmIncomeRepository = TypeOrmIncomeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(income_entity_1.Income)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmIncomeRepository);
//# sourceMappingURL=type-orm-income.repository.js.map