"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPasswordDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * User password input DTO validation
 */
class UserPasswordDTO {
}
exports.UserPasswordDTO = UserPasswordDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], UserPasswordDTO.prototype, "password", void 0);
//# sourceMappingURL=user-password.dto.js.map