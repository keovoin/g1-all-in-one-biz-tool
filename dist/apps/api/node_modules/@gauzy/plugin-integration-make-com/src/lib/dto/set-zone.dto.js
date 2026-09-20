"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetZoneDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const make_com_api_model_1 = require("../interfaces/make-com-api.model");
/**
 * DTO for the "set zone" endpoint.
 *
 * The zone is string-interpolated into the Make.com API hostname (`https://${zone}.make.com/...`),
 * so it MUST be constrained to the known allowlist at runtime — `@IsIn(MAKE_COM_ZONES)` — to prevent
 * host-injection SSRF (GHSA-vcwx-qh95-54g6). The compile-time `MakeComZone` union is erased at
 * runtime and is not sufficient on its own.
 */
class SetZoneDTO {
}
exports.SetZoneDTO = SetZoneDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        enum: make_com_api_model_1.MAKE_COM_ZONES,
        description: 'The Make.com zone that determines the API base URL',
        example: 'us2'
    }),
    (0, class_validator_1.IsIn)(make_com_api_model_1.MAKE_COM_ZONES),
    tslib_1.__metadata("design:type", String)
], SetZoneDTO.prototype, "zone", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Optional Gauzy organization ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], SetZoneDTO.prototype, "organizationId", void 0);
//# sourceMappingURL=set-zone.dto.js.map