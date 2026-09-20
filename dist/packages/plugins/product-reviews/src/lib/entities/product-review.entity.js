"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReview = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const product_review_types_1 = require("../product-review.types");
const mikro_orm_product_review_repository_1 = require("./repository/mikro-orm-product-review.repository");
let ProductReview = class ProductReview extends core_1.TenantOrganizationBaseEntity {
};
exports.ProductReview = ProductReview;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ProductReview.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)('text', { nullable: true }),
    tslib_1.__metadata("design:type", String)
], ProductReview.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 0, maximum: 10 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], ProductReview.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ProductReview.prototype, "upvotes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ProductReview.prototype, "downvotes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: product_review_types_1.ProductReviewStatusEnum }),
    (0, class_validator_1.IsEnum)(product_review_types_1.ProductReviewStatusEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', default: product_review_types_1.ProductReviewStatusEnum.PENDING }),
    tslib_1.__metadata("design:type", String)
], ProductReview.prototype, "status", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isBetterSqlite3)() ? 'text' : 'timestamp' }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], ProductReview.prototype, "editedAt", void 0);
tslib_1.__decorate([
    (0, core_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], ProductReview.prototype, "isEdited", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Product, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], ProductReview.prototype, "product", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.product),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], ProductReview.prototype, "productId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.User, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], ProductReview.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.user),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], ProductReview.prototype, "userId", void 0);
exports.ProductReview = ProductReview = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('product_review', { mikroOrmRepository: () => mikro_orm_product_review_repository_1.MikroOrmProductReviewRepository })
], ProductReview);
//# sourceMappingURL=product-review.entity.js.map