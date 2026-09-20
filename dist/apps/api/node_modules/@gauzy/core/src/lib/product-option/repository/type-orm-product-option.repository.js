"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductOptionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_option_entity_1 = require("../product-option.entity");
let TypeOrmProductOptionRepository = class TypeOrmProductOptionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProductOptionRepository = TypeOrmProductOptionRepository;
exports.TypeOrmProductOptionRepository = TypeOrmProductOptionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(product_option_entity_1.ProductOption)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductOptionRepository);
//# sourceMappingURL=type-orm-product-option.repository.js.map