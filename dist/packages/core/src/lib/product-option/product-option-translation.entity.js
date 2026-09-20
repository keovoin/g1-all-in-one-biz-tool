"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionTranslation = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_product_option_translation_repository_1 = require("./repository/mikro-orm-product-option-translation.repository");
let ProductOptionTranslation = class ProductOptionTranslation extends internal_1.TenantOrganizationBaseEntity {
};
exports.ProductOptionTranslation = ProductOptionTranslation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ProductOptionTranslation.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ProductOptionTranslation.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.LanguagesEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.LanguagesEnum),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], ProductOptionTranslation.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.ProductOption }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ProductOption, (option) => option.translations),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", internal_1.ProductOption)
], ProductOptionTranslation.prototype, "reference", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.reference),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], ProductOptionTranslation.prototype, "referenceId", void 0);
exports.ProductOptionTranslation = ProductOptionTranslation = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('product_option_translation', { mikroOrmRepository: () => mikro_orm_product_option_translation_repository_1.MikroOrmProductOptionTranslationRepository })
], ProductOptionTranslation);
//# sourceMappingURL=product-option-translation.entity.js.map