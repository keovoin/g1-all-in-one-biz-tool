"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductOptionGroupRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_option_group_entity_1 = require("../product-option-group.entity");
let TypeOrmProductOptionGroupRepository = class TypeOrmProductOptionGroupRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProductOptionGroupRepository = TypeOrmProductOptionGroupRepository;
exports.TypeOrmProductOptionGroupRepository = TypeOrmProductOptionGroupRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(product_option_group_entity_1.ProductOptionGroup)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductOptionGroupRepository);
//# sourceMappingURL=type-orm-product-option-group.repository.js.map