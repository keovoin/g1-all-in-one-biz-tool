"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslatableBaseDTO = exports.TranslationBaseDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const tenant_organization_base_dto_1 = require("./tenant-organization-base.dto");
class TranslationBaseDTO extends tenant_organization_base_dto_1.TenantOrganizationBaseDTO {
}
exports.TranslationBaseDTO = TranslationBaseDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], TranslationBaseDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], TranslationBaseDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], TranslationBaseDTO.prototype, "languageCode", void 0);
class TranslatableBaseDTO extends tenant_organization_base_dto_1.TenantOrganizationBaseDTO {
}
exports.TranslatableBaseDTO = TranslatableBaseDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TranslationBaseDTO),
    tslib_1.__metadata("design:type", Object)
], TranslatableBaseDTO.prototype, "translations", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Function }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Function)
], TranslatableBaseDTO.prototype, "translate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Function }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Function)
], TranslatableBaseDTO.prototype, "translateNested", void 0);
//# sourceMappingURL=translate-base-dto.js.map