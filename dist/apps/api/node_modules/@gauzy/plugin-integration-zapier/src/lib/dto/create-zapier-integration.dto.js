"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateZapierIntegrationDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
class CreateZapierIntegrationDto extends core_1.TenantOrganizationBaseDTO {
}
exports.CreateZapierIntegrationDto = CreateZapierIntegrationDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateZapierIntegrationDto.prototype, "organizationId", void 0);
//# sourceMappingURL=create-zapier-integration.dto.js.map