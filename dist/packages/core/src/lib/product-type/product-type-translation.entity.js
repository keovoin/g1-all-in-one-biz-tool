"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeTranslation = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_product_type_translation_repository_1 = require("./repository/mikro-orm-product-type-translation.repository");
let ProductTypeTranslation = class ProductTypeTranslation extends internal_1.TranslationBase {
};
exports.ProductTypeTranslation = ProductTypeTranslation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ProductTypeTranslation.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ProductTypeTranslation.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], ProductTypeTranslation.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.ProductType }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ProductType, (productType) => productType.translations, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", internal_1.ProductType)
], ProductTypeTranslation.prototype, "reference", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.reference),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], ProductTypeTranslation.prototype, "referenceId", void 0);
exports.ProductTypeTranslation = ProductTypeTranslation = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('product_type_translation', { mikroOrmRepository: () => mikro_orm_product_type_translation_repository_1.MikroOrmProductTypeTranslationRepository })
], ProductTypeTranslation);
//# sourceMappingURL=product-type-translation.entity.js.map