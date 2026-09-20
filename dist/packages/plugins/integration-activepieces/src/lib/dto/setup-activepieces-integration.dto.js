"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupActivepiecesIntegrationDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
/**
 * DTO for setting up ActivePieces integration with an API key
 */
class SetupActivepiecesIntegrationDto extends core_1.TenantOrganizationBaseDTO {
}
exports.SetupActivepiecesIntegrationDto = SetupActivepiecesIntegrationDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ActivePieces API key for authentication',
        example: 'sk-...'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SetupActivepiecesIntegrationDto.prototype, "apiKey", void 0);
//# sourceMappingURL=setup-activepieces-integration.dto.js.map