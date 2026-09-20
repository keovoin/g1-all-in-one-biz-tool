"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFeatureToggleDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../shared/validators");
const dto_1 = require("./../../core/dto");
class CreateFeatureToggleDTO extends dto_1.TenantBaseDTO {
}
exports.CreateFeatureToggleDTO = CreateFeatureToggleDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateFeatureToggleDTO.prototype, "featureId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateFeatureToggleDTO.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, validators_1.IsOrganizationBelongsToUser)(),
    tslib_1.__metadata("design:type", Object)
], CreateFeatureToggleDTO.prototype, "organization", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, validators_1.IsOrganizationBelongsToUser)(),
    tslib_1.__metadata("design:type", Object)
], CreateFeatureToggleDTO.prototype, "organizationId", void 0);
//# sourceMappingURL=create-feature-toggle.dto.js.map