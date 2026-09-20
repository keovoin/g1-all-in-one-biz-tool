"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
const validators_1 = require("./../../shared/validators");
/**
 * Entity Count DTO
 *
 */
class CountQueryDTO extends (0, swagger_1.PickType)(dto_1.TenantBaseDTO, ['tenantId']) {
}
exports.CountQueryDTO = CountQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, validators_1.IsOrganizationBelongsToUser)(),
    tslib_1.__metadata("design:type", String)
], CountQueryDTO.prototype, "organizationId", void 0);
//# sourceMappingURL=count-query.dto.js.map