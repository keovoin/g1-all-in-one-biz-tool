"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppIntegrationConfigDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * DTO mirroring {@link IAppIntegrationConfig}.
 *
 * Used to give the `POST /auth/email/verify/resend-link` endpoint a concrete, decorated class so
 * `@UseValidationPipe({ whitelist: true })` strips any unexpected body keys (including prototype
 * pollution vectors such as `__proto__`) before the body reaches `deepMerge`.
 */
class AppIntegrationConfigDTO {
}
exports.AppIntegrationConfigDTO = AppIntegrationConfigDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppIntegrationConfigDTO.prototype, "appName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppIntegrationConfigDTO.prototype, "appLogo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppIntegrationConfigDTO.prototype, "appSignature", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppIntegrationConfigDTO.prototype, "appLink", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppIntegrationConfigDTO.prototype, "appEmailConfirmationUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppIntegrationConfigDTO.prototype, "appMagicSignUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppIntegrationConfigDTO.prototype, "companyLink", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppIntegrationConfigDTO.prototype, "companyName", void 0);
//# sourceMappingURL=app-integration-config.dto.js.map