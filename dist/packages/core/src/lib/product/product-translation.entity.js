"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTranslation = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const internal_1 = require("../core/entities/internal");
const product_entity_1 = require("./product.entity");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_product_translation_repository_1 = require("./repository/mikro-orm-product-translation.repository");
let ProductTranslation = class ProductTranslation extends internal_1.TranslationBase {
};
exports.ProductTranslation = ProductTranslation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ProductTranslation.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ProductTranslation.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.LanguagesEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.LanguagesEnum),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], ProductTranslation.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => product_entity_1.Product }),
    (0, entity_1.MultiORMManyToOne)(() => product_entity_1.Product, (product) => product.translations, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], ProductTranslation.prototype, "reference", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.reference),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], ProductTranslation.prototype, "referenceId", void 0);
exports.ProductTranslation = ProductTranslation = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('product_translation', { mikroOrmRepository: () => mikro_orm_product_translation_repository_1.MikroOrmProductTranslationRepository })
], ProductTranslation);
//# sourceMappingURL=product-translation.entity.js.map