"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../shared/validators");
const dto_1 = require("./../../core/dto");
class ExpenseCategoryDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.ExpenseCategoryDTO = ExpenseCategoryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, validators_1.IsExpenseCategoryAlreadyExist)(),
    tslib_1.__metadata("design:type", String)
], ExpenseCategoryDTO.prototype, "name", void 0);
//# sourceMappingURL=expense-category.dto.js.map