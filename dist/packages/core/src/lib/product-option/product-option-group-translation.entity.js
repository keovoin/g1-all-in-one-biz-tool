"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOptionGroupTranslation = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const product_option_group_entity_1 = require("./product-option-group.entity");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_product_option_group_translation_repository_1 = require("./repository/mikro-orm-product-option-group-translation.repository");
let ProductOptionGroupTranslation = class ProductOptionGroupTranslation extends internal_1.TenantOrganizationBaseEntity {
};
exports.ProductOptionGroupTranslation = ProductOptionGroupTranslation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ProductOptionGroupTranslation.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.LanguagesEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.LanguagesEnum),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], ProductOptionGroupTranslation.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => product_option_group_entity_1.ProductOptionGroup }),
    (0, entity_1.MultiORMManyToOne)(() => product_option_group_entity_1.ProductOptionGroup, (group) => group.translations),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", product_option_group_entity_1.ProductOptionGroup)
], ProductOptionGroupTranslation.prototype, "reference", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.reference),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], ProductOptionGroupTranslation.prototype, "referenceId", void 0);
exports.ProductOptionGroupTranslation = ProductOptionGroupTranslation = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('product_option_group_translation', { mikroOrmRepository: () => mikro_orm_product_option_group_translation_repository_1.MikroOrmProductOptionGroupTranslationRepository })
], ProductOptionGroupTranslation);
//# sourceMappingURL=product-option-group-translation.entity.js.map