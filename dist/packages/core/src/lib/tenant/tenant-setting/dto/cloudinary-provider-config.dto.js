"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProviderConfigDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("../../../core/decorators");
const trim_decorator_1 = require("../../../shared/decorators/trim.decorator");
/**
 * Cloudinary FileStorage Provider Configuration DTO validation
 */
class CloudinaryProviderConfigDTO {
}
exports.CloudinaryProviderConfigDTO = CloudinaryProviderConfigDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.CLOUDINARY),
    (0, class_validator_1.IsNotEmpty)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], CloudinaryProviderConfigDTO.prototype, "cloudinary_cloud_name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.CLOUDINARY),
    (0, class_validator_1.IsNotEmpty)(),
    (0, decorators_1.IsSecret)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], CloudinaryProviderConfigDTO.prototype, "cloudinary_api_key", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.CLOUDINARY),
    (0, class_validator_1.IsNotEmpty)(),
    (0, decorators_1.IsSecret)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], CloudinaryProviderConfigDTO.prototype, "cloudinary_api_secret", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.fileStorageProvider === contracts_1.FileStorageProviderEnum.CLOUDINARY),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], CloudinaryProviderConfigDTO.prototype, "cloudinary_api_secure", void 0);
//# sourceMappingURL=cloudinary-provider-config.dto.js.map