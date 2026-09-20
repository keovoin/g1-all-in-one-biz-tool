"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
class ProductCategoryDTO extends dto_1.TranslatableBaseDTO {
}
exports.ProductCategoryDTO = ProductCategoryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", Object)
], ProductCategoryDTO.prototype, "imageId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], ProductCategoryDTO.prototype, "imageUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    tslib_1.__metadata("design:type", Array)
], ProductCategoryDTO.prototype, "products", void 0);
//# sourceMappingURL=product-category.dto.js.map