"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../shared/validators");
const dto_1 = require("./../../terms-acceptance/dto");
const create_user_dto_1 = require("./create-user.dto");
/**
 * Register User DTO validation
 */
class RegisterUserDTO {
}
exports.RegisterUserDTO = RegisterUserDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password should not be empty' }),
    (0, class_validator_1.MinLength)(8, {
        message: 'Password should be at least 8 characters long.'
    }),
    tslib_1.__metadata("design:type", String)
], RegisterUserDTO.prototype, "password", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Confirm password should not be empty' }),
    (0, validators_1.Match)(RegisterUserDTO, (it) => it.password, {
        message: 'The password and confirmation password must match.'
    }),
    tslib_1.__metadata("design:type", String)
], RegisterUserDTO.prototype, "confirmPassword", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => create_user_dto_1.CreateUserDTO }),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_user_dto_1.CreateUserDTO),
    tslib_1.__metadata("design:type", create_user_dto_1.CreateUserDTO)
], RegisterUserDTO.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], RegisterUserDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], RegisterUserDTO.prototype, "createdByUserId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], RegisterUserDTO.prototype, "featureAsEmployee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [dto_1.TermsAcceptanceClaimDTO] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Terms acceptance, when supplied, must list at least one document.' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => dto_1.TermsAcceptanceClaimDTO),
    tslib_1.__metadata("design:type", Array)
], RegisterUserDTO.prototype, "terms", void 0);
//# sourceMappingURL=register-user.dto.js.map