"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductTypeTranslationRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_type_translation_entity_1 = require("../product-type-translation.entity");
let TypeOrmProductTypeTranslationRepository = class TypeOrmProductTypeTranslationRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProductTypeTranslationRepository = TypeOrmProductTypeTranslationRepository;
exports.TypeOrmProductTypeTranslationRepository = TypeOrmProductTypeTranslationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(product_type_translation_entity_1.ProductTypeTranslation)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductTypeTranslationRepository);
//# sourceMappingURL=type-orm-product-type-translation.repository.js.map