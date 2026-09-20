"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureSimIntegrationDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * DTO for configuring SIM integration with an API key.
 */
class ConfigureSimIntegrationDto {
}
exports.ConfigureSimIntegrationDto = ConfigureSimIntegrationDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SIM API key for authentication',
        example: 'sim_...'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ConfigureSimIntegrationDto.prototype, "apiKey", void 0);
//# sourceMappingURL=configure-sim-integration.dto.js.map