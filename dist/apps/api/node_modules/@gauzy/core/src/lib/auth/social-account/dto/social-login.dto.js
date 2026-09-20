"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserBySocialLoginDTO = exports.SocialLoginBodyRequestDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const include_teams_dto_1 = require("../../../user/dto/include-teams.dto");
/**
 * Validate the social login body request
 */
class SocialLoginBodyRequestDTO extends include_teams_dto_1.IncludeTeamsDTO {
}
exports.SocialLoginBodyRequestDTO = SocialLoginBodyRequestDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.ProviderEnum, { message: 'provider `$value` must be a valid enum value' }),
    tslib_1.__metadata("design:type", String)
], SocialLoginBodyRequestDTO.prototype, "provider", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SocialLoginBodyRequestDTO.prototype, "token", void 0);
class FindUserBySocialLoginDTO extends (0, swagger_1.PickType)(SocialLoginBodyRequestDTO, ['provider']) {
}
exports.FindUserBySocialLoginDTO = FindUserBySocialLoginDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], FindUserBySocialLoginDTO.prototype, "providerAccountId", void 0);
//# sourceMappingURL=social-login.dto.js.map