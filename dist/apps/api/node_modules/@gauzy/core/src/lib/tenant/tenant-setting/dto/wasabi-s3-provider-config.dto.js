"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasabiS3ProviderConfigDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("../../../core/decorators");
const trim_decorator_1 = require("../../../shared/decorators/trim.decorator");
/**
 * Wasabi S3 FileStorage Provider Configuration DTO validation
 */
class WasabiS3ProviderConfigDTO {
}
exports.WasabiS3ProviderConfigDTO = WasabiS3ProviderConfigDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.WASABI),
    (0, class_validator_1.IsString)(),
    (0, decorators_1.IsSecret)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], WasabiS3ProviderConfigDTO.prototype, "wasabi_aws_access_key_id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.WASABI),
    (0, class_validator_1.IsString)(),
    (0, decorators_1.IsSecret)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], WasabiS3ProviderConfigDTO.prototype, "wasabi_aws_secret_access_key", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.WASABI),
    (0, class_validator_1.IsString)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], WasabiS3ProviderConfigDTO.prototype, "wasabi_aws_bucket", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.WASABI),
    (0, class_validator_1.IsString)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], WasabiS3ProviderConfigDTO.prototype, "wasabi_aws_default_region", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.WASABI),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], WasabiS3ProviderConfigDTO.prototype, "wasabi_aws_service_url", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.WASABI),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], WasabiS3ProviderConfigDTO.prototype, "wasabi_aws_force_path_style", void 0);
//# sourceMappingURL=wasabi-s3-provider-config.dto.js.map