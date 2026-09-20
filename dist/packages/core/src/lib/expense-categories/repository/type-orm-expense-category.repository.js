"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmExpenseCategoryRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_category_entity_1 = require("../expense-category.entity");
let TypeOrmExpenseCategoryRepository = class TypeOrmExpenseCategoryRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmExpenseCategoryRepository = TypeOrmExpenseCategoryRepository;
exports.TypeOrmExpenseCategoryRepository = TypeOrmExpenseCategoryRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(expense_category_entity_1.ExpenseCategory)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmExpenseCategoryRepository);
//# sourceMappingURL=type-orm-expense-category.repository.js.map