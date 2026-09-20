"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExpenseCategoryDTO = void 0;
const tslib_1 = require("tslib");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../tags/dto");
const expense_category_dto_1 = require("./expense-category.dto");
/**
 * Update expense category request validation
 */
class UpdateExpenseCategoryDTO extends (0, mapped_types_1.IntersectionType)(expense_category_dto_1.ExpenseCategoryDTO, dto_1.RelationalTagDTO) {
}
exports.UpdateExpenseCategoryDTO = UpdateExpenseCategoryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateExpenseCategoryDTO.prototype, "id", void 0);
//# sourceMappingURL=update-expense-category.dto.js.map