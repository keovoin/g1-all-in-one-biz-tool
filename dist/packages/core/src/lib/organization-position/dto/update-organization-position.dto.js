"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrganizationPositionDTO = void 0;
const tslib_1 = require("tslib");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../tags/dto");
const organization_position_dto_1 = require("./organization-position.dto");
/**
 * Organization Position Update DTO
 *
 */
class UpdateOrganizationPositionDTO extends (0, mapped_types_1.IntersectionType)(organization_position_dto_1.OrganizationPositionDTO, dto_1.RelationalTagDTO) {
}
exports.UpdateOrganizationPositionDTO = UpdateOrganizationPositionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], UpdateOrganizationPositionDTO.prototype, "name", void 0);
//# sourceMappingURL=update-organization-position.dto.js.map