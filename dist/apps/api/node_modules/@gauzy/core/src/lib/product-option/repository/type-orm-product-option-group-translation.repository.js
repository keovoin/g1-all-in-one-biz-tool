"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductOptionGroupTranslationRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_option_group_translation_entity_1 = require("../product-option-group-translation.entity");
let TypeOrmProductOptionGroupTranslationRepository = class TypeOrmProductOptionGroupTranslationRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProductOptionGroupTranslationRepository = TypeOrmProductOptionGroupTranslationRepository;
exports.TypeOrmProductOptionGroupTranslationRepository = TypeOrmProductOptionGroupTranslationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(product_option_group_translation_entity_1.ProductOptionGroupTranslation)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductOptionGroupTranslationRepository);
//# sourceMappingURL=type-orm-product-option-group-translation.repository.js.map