"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringProviderConfigDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../../core/decorators");
const trim_decorator_1 = require("../../../shared/decorators/trim.decorator");
/**
 * Monitoring Provider Configuration DTO validation
 * Used to mask secret values in monitoring settings (PostHog, Sentry, Jitsu)
 */
class MonitoringProviderConfigDTO {
}
exports.MonitoringProviderConfigDTO = MonitoringProviderConfigDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], MonitoringProviderConfigDTO.prototype, "posthogEnabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, decorators_1.IsSecret)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], MonitoringProviderConfigDTO.prototype, "posthogKey", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], MonitoringProviderConfigDTO.prototype, "posthogHost", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], MonitoringProviderConfigDTO.prototype, "posthogFlushInterval", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], MonitoringProviderConfigDTO.prototype, "sentryEnabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, decorators_1.IsSecret)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], MonitoringProviderConfigDTO.prototype, "sentryDsn", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], MonitoringProviderConfigDTO.prototype, "jitsuEnabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], MonitoringProviderConfigDTO.prototype, "jitsuHost", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, decorators_1.IsSecret)(),
    (0, trim_decorator_1.Trimmed)(),
    tslib_1.__metadata("design:type", String)
], MonitoringProviderConfigDTO.prototype, "jitsuWriteKey", void 0);
//# sourceMappingURL=monitoring-provider-config.dto.js.map