"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const trim_decorator_1 = require("../../shared/decorators/trim.decorator");
const dto_1 = require("./../../role/dto");
const user_email_dto_1 = require("./user-email.dto");
/**
 * DTO (Data Transfer Object) for creating a user.
 * Extends UserEmailDTO and includes partial RoleFeatureDTO.
 */
class CreateUserDTO extends (0, swagger_1.IntersectionType)(user_email_dto_1.UserEmailDTO, (0, swagger_1.PartialType)(dto_1.RoleFeatureDTO)) {
}
exports.CreateUserDTO = CreateUserDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDTO.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDTO.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDTO.prototype, "imageUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.LanguagesEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.LanguagesEnum),
    tslib_1.__metadata("design:type", String)
], CreateUserDTO.prototype, "preferredLanguage", void 0);
//# sourceMappingURL=create-user.dto.js.map