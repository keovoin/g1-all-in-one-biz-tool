"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLastLoginAtDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
/**
 * User last login timestamp input DTO validation
 */
class UserLastLoginAtDTO {
}
exports.UserLastLoginAtDTO = UserLastLoginAtDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    tslib_1.__metadata("design:type", Date)
], UserLastLoginAtDTO.prototype, "lastLoginAt", void 0);
//# sourceMappingURL=user-last-login.dto.js.map