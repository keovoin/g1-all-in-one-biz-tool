"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokenDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * User token input DTO validation
 */
class UserTokenDTO {
}
exports.UserTokenDTO = UserTokenDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UserTokenDTO.prototype, "token", void 0);
//# sourceMappingURL=user-token.dto.js.map