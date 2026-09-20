"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantOrganizationBaseDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const tenant_base_dto_1 = require("./tenant-base.dto");
const validators_1 = require("./../../shared/validators");
class TenantOrganizationBaseDTO extends tenant_base_dto_1.TenantBaseDTO {
}
exports.TenantOrganizationBaseDTO = TenantOrganizationBaseDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object }),
    (0, class_validator_1.ValidateIf)((it) => !it.organizationId && !it.sentTo),
    (0, class_validator_1.IsObject)(),
    (0, validators_1.IsOrganizationBelongsToUser)(),
    tslib_1.__metadata("design:type", Object)
], TenantOrganizationBaseDTO.prototype, "organization", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.organization && !it.sentTo),
    (0, class_validator_1.IsUUID)(),
    (0, validators_1.IsOrganizationBelongsToUser)(),
    tslib_1.__metadata("design:type", String)
], TenantOrganizationBaseDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.organization && !it.organizationId),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], TenantOrganizationBaseDTO.prototype, "sentTo", void 0);
//# sourceMappingURL=tenant-organization-base.dto.js.map