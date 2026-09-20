"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEmailDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * User email input DTO validation
 */
class UserEmailDTO {
}
exports.UserEmailDTO = UserEmailDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], UserEmailDTO.prototype, "email", void 0);
//# sourceMappingURL=user-email.dto.js.map