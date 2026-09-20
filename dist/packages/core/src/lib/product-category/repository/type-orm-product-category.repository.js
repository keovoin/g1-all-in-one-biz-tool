"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductCategoryRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_category_entity_1 = require("../product-category.entity");
let TypeOrmProductCategoryRepository = class TypeOrmProductCategoryRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProductCategoryRepository = TypeOrmProductCategoryRepository;
exports.TypeOrmProductCategoryRepository = TypeOrmProductCategoryRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(product_category_entity_1.ProductCategory)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductCategoryRepository);
//# sourceMappingURL=type-orm-product-category.repository.js.map