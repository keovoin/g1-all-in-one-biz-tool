"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurePlaneIntegrationDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * DTO for configuring Plane integration with tenant-specific URLs.
 */
class ConfigurePlaneIntegrationDto {
}
exports.ConfigurePlaneIntegrationDto = ConfigurePlaneIntegrationDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Integration mode: "shared" uses the global hosted Ever Gauzy PM UIs, "custom" uses tenant-provided URLs',
        enum: ['shared', 'custom'],
        example: 'shared'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['shared', 'custom']),
    tslib_1.__metadata("design:type", String)
], ConfigurePlaneIntegrationDto.prototype, "mode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Main Plane web app URL (required only in custom mode)',
        example: 'https://plane.example.com'
    }),
    (0, class_validator_1.ValidateIf)((o) => o.mode === 'custom'),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({ require_tld: false, require_protocol: true }),
    tslib_1.__metadata("design:type", String)
], ConfigurePlaneIntegrationDto.prototype, "planeWebUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Plane admin panel URL (optional; not used in shared mode)',
        example: 'https://admin.plane.example.com'
    })
    // Admin URL is always optional. Validate the URL only when a non-empty value is
    // supplied, so a blank string (common from a cleared form field) is treated as
    // absent instead of failing @IsUrl — which would 400 an otherwise-valid request.
    ,
    (0, class_validator_1.ValidateIf)((o) => o.planeAdminUrl != null && o.planeAdminUrl !== ''),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({ require_tld: false, require_protocol: true }),
    tslib_1.__metadata("design:type", String)
], ConfigurePlaneIntegrationDto.prototype, "planeAdminUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Plane public space URL (required in custom mode)',
        example: 'https://space.plane.example.com'
    })
    // Required (and validated) only in custom mode; in shared mode the space URL is
    // irrelevant, so validation is skipped and a blank/absent value is accepted.
    ,
    (0, class_validator_1.ValidateIf)((o) => o.mode === 'custom'),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({ require_tld: false, require_protocol: true }),
    tslib_1.__metadata("design:type", String)
], ConfigurePlaneIntegrationDto.prototype, "planeSpaceUrl", void 0);
//# sourceMappingURL=configure-plane-integration.dto.js.map