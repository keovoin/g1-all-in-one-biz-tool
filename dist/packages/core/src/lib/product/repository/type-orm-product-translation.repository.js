"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductTranslationRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_translation_entity_1 = require("../product-translation.entity");
let TypeOrmProductTranslationRepository = class TypeOrmProductTranslationRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProductTranslationRepository = TypeOrmProductTranslationRepository;
exports.TypeOrmProductTranslationRepository = TypeOrmProductTranslationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(product_translation_entity_1.ProductTranslation)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductTranslationRepository);
//# sourceMappingURL=type-orm-product-translation.repository.js.map