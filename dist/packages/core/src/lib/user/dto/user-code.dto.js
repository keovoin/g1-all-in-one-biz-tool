"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCodeDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("@gauzy/constants");
const validators_1 = require("./../../shared/validators");
/**
 * User code input DTO validation
 */
class UserCodeDTO {
}
exports.UserCodeDTO = UserCodeDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsString)(),
    (0, validators_1.CustomLength)(constants_1.ALPHA_NUMERIC_CODE_LENGTH),
    tslib_1.__metadata("design:type", String)
], UserCodeDTO.prototype, "code", void 0);
//# sourceMappingURL=user-code.dto.js.map