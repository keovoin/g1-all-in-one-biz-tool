"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmWarehouseProductRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warehouse_product_entity_1 = require("../warehouse-product.entity");
let TypeOrmWarehouseProductRepository = class TypeOrmWarehouseProductRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmWarehouseProductRepository = TypeOrmWarehouseProductRepository;
exports.TypeOrmWarehouseProductRepository = TypeOrmWarehouseProductRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(warehouse_product_entity_1.WarehouseProduct)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmWarehouseProductRepository);
//# sourceMappingURL=type-orm-warehouse-product.repository.js.map