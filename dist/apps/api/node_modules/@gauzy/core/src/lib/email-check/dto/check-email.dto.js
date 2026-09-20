"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckEmailDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * DTO for checking if an email exists in the database.
 * Used in the POST method to check the existence of an email.
 */
class CheckEmailDTO {
}
exports.CheckEmailDTO = CheckEmailDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'test@example.com',
        required: true,
        description: 'Email address to check for existence'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], CheckEmailDTO.prototype, "email", void 0);
//# sourceMappingURL=check-email.dto.js.map