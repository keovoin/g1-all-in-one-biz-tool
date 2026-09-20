"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSocialAccountDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const dto_1 = require("../../../core/dto");
const dto_2 = require("../../../user/dto");
/**
 * Create Social Account DTO validation
 */
class CreateSocialAccountDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantBaseDTO) {
}
exports.CreateSocialAccountDTO = CreateSocialAccountDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => dto_2.CreateUserDTO }),
    (0, class_validator_1.ValidateIf)((it) => !it.userId),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => dto_2.CreateUserDTO),
    tslib_1.__metadata("design:type", dto_2.CreateUserDTO)
], CreateSocialAccountDTO.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.user),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateSocialAccountDTO.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.ProviderEnum, { message: 'provider `$value` must be a valid enum value' }),
    tslib_1.__metadata("design:type", String)
], CreateSocialAccountDTO.prototype, "provider", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateSocialAccountDTO.prototype, "providerAccountId", void 0);
//# sourceMappingURL=create-social-account.dto.js.map