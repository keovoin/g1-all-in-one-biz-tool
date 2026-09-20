"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductTypeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_type_entity_1 = require("../product-type.entity");
let TypeOrmProductTypeRepository = class TypeOrmProductTypeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProductTypeRepository = TypeOrmProductTypeRepository;
exports.TypeOrmProductTypeRepository = TypeOrmProductTypeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(product_type_entity_1.ProductType)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductTypeRepository);
//# sourceMappingURL=type-orm-product-type.repository.js.map