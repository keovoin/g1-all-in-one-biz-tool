"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActivepiecesIntegrationDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
/**
 * DTO for creating ActivePieces integration connection
 */
class CreateActivepiecesIntegrationDto extends core_1.TenantOrganizationBaseDTO {
}
exports.CreateActivepiecesIntegrationDto = CreateActivepiecesIntegrationDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ActivePieces access token for API authentication',
        example: 'ap_1234567890abcdef'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateActivepiecesIntegrationDto.prototype, "accessToken", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ActivePieces project ID where the connection will be created',
        example: 'proj_1234567890abcdef'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateActivepiecesIntegrationDto.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Display name for the connection (defaults to tenant name)',
        example: 'Ever Gauzy Connection'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateActivepiecesIntegrationDto.prototype, "connectionName", void 0);
//# sourceMappingURL=create-activepieces-integration.dto.js.map