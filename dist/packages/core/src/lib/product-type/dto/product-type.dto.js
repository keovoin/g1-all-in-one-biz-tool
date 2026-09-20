"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
class ProductTypeDTO extends dto_1.TranslatableBaseDTO {
}
exports.ProductTypeDTO = ProductTypeDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.ProductTypesIconsEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ProductTypesIconsEnum),
    tslib_1.__metadata("design:type", String)
], ProductTypeDTO.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    tslib_1.__metadata("design:type", Array)
], ProductTypeDTO.prototype, "products", void 0);
//# sourceMappingURL=product-type.dto.js.map