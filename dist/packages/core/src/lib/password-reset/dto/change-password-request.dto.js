"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordRequestDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../shared/validators");
/**
 * Change Password Request DTO validation
 */
class ChangePasswordRequestDTO {
}
exports.ChangePasswordRequestDTO = ChangePasswordRequestDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Authorization token is invalid or missing.' }),
    (0, class_validator_1.IsString)({ message: 'Authorization token must be string.' }),
    tslib_1.__metadata("design:type", String)
], ChangePasswordRequestDTO.prototype, "token", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password should not be empty' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password should be at least 8 characters long.' }),
    (0, class_validator_1.IsStrongPassword)({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, {
        message: 'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
    }),
    tslib_1.__metadata("design:type", String)
], ChangePasswordRequestDTO.prototype, "password", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Confirm password should not be empty' }),
    (0, validators_1.Match)(ChangePasswordRequestDTO, (it) => it.password, {
        message: 'The password and confirmation password must match.'
    }),
    tslib_1.__metadata("design:type", String)
], ChangePasswordRequestDTO.prototype, "confirmPassword", void 0);
//# sourceMappingURL=change-password-request.dto.js.map