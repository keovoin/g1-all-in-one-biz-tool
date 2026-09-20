"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTenantSettingDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const aws_s3_provider_config_dto_1 = require("./aws-s3-provider-config.dto");
const wasabi_s3_provider_config_dto_1 = require("./wasabi-s3-provider-config.dto");
const cloudinary_provider_config_dto_1 = require("./cloudinary-provider-config.dto");
const digitalocean_s3_provider_config_dto_1 = require("./digitalocean-s3.provider-config.dto");
/**
 * Tenant Setting Save Request DTO validation
 */
class CreateTenantSettingDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.IntersectionType)(wasabi_s3_provider_config_dto_1.WasabiS3ProviderConfigDTO, digitalocean_s3_provider_config_dto_1.DigitalOceanS3ProviderConfigDTO), (0, swagger_1.IntersectionType)(aws_s3_provider_config_dto_1.AwsS3ProviderConfigDTO, cloudinary_provider_config_dto_1.CloudinaryProviderConfigDTO)) {
}
exports.CreateTenantSettingDTO = CreateTenantSettingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.FileStorageProviderEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.FileStorageProviderEnum),
    (0, class_transformer_1.Transform)((params) => params.value.trim().toUpperCase()),
    tslib_1.__metadata("design:type", String)
], CreateTenantSettingDTO.prototype, "fileStorageProvider", void 0);
//# sourceMappingURL=create-tenant-setting.dto.js.map